# Update: Migrate AI Chat Assistant to LangGraph (Parallel + Conditional + HITL)

## 0. Context for Codex (read first)

1. Read `AGENTS.md` at the project root and follow every convention defined there (file structure, naming, error handling style, lint rules, commit style).
2. Analyze the current project structure, specifically:
   - `app/(...)/chat/api/route.js` (or wherever the current chat API route lives — locate it, don't assume the path)
   - The existing single-tool agent setup (`createAgent` from `langchain`, `ChatGroq`, `tools/searchJobsTool.js`, `tools/index.js`, `prompts/system.js`)
   - The **existing manual flow** for CV upload + parse + apply that currently lives in the "Job Details" page flow (find the service/action functions that: (a) parse an uploaded CV file into structured data, (b) submit a job application using parsed CV data). Identify the exact function signatures, return shapes, and any DB writes (e.g. Application model/table, duplicate-application checks).
   - The `<AiChat />` component and how it currently calls the chat API (streaming or not, message format, how tool results are rendered).
3. Do not rewrite or duplicate the CV parsing / application submission business logic. Reuse the existing functions directly inside new LangGraph tool wrappers. If those functions are tightly coupled to the job-details page (e.g. expect `req`/`res`, or read `FormData` directly from an HTTP request), refactor them minimally into pure, importable functions (e.g. `lib/cv/parseCv.js`, `lib/applications/applyToJob.js`) that both the existing page and the new agent tools can call — without changing their existing behavior or output shape.
4. Confirm the Groq API key and model config already used (`openai/gpt-oss-120b` via `ChatGroq`) and reuse the same client config unless something below requires a change (e.g. structured output for intent classification).

**Do not change or break:**

- The existing job-details-page manual apply flow must keep working exactly as-is.
- The existing `search_jobs` tool behavior for plain job search queries.

---

## 1. Goal

Replace the current single-tool `createAgent` chat with a **LangGraph `StateGraph`** that supports:

- Conditional routing (chitchat vs. job search intent)
- A human-in-the-loop (HITL) gate before job search: "do you have a CV?"
- Two nodes running in **parallel**: CV parsing + job search
- HITL job selection from results
- HITL "apply to this job?" confirmation
- HITL "use CV data or provide manually?" choice
- A final HITL "confirm & submit application?" gate
- Duplicate-application check before asking to apply
- Fallback behavior when CV parsing fails or job search returns zero results
- In-memory persistence across turns (checkpointer), keyed by a per-conversation `thread_id`
- Fault tolerance: every external call (CV parse, DB search, application submit, LLM call) wrapped so a failure produces a graceful message and a safe state, not a crash

---

## 2. State schema

Create `lib/agent/state.js`:

```javascript
import { Annotation } from "@langchain/langgraph";

export const JobAssistantState = Annotation.Root({
  messages: Annotation({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  intent: Annotation({ default: () => null }), // "job_search" | "chitchat"
  status: Annotation({ default: () => "idle" }),
  // idle | awaiting_cv_confirm | awaiting_job_choice | awaiting_apply_confirm
  // | awaiting_data_source_choice | awaiting_final_confirm | done | terminated

  hasCv: Annotation({ default: () => null }), // true/false once answered
  cvFileRef: Annotation({ default: () => null }), // uploaded file ref/id from client
  cvData: Annotation({ default: () => null }), // parsed CV JSON
  cvParseError: Annotation({ default: () => null }),

  jobQuery: Annotation({ default: () => null }), // extracted title/keyword
  jobResults: Annotation({ default: () => [] }),
  searchError: Annotation({ default: () => null }),

  selectedJob: Annotation({ default: () => null }),
  alreadyApplied: Annotation({ default: () => false }),

  useCvData: Annotation({ default: () => null }), // true/false
  manualApplyData: Annotation({ default: () => null }),

  applicationResult: Annotation({ default: () => null }),
  errorCount: Annotation({ default: () => 0 }), // for fault-tolerance circuit breaking
});
```

---

## 3. Graph structure

File: `lib/agent/graph.js`

### Nodes

| Node                      | Responsibility                                                                                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat_node`               | Classify intent (chitchat vs job_search) using the LLM with structured output. If chitchat, answer directly and end turn.                                              |
| `ask_cv_node`             | Emit an `interrupt()` asking "Do you have a CV to search with? (yes/no)".                                                                                              |
| `no_cv_end_node`          | Terminal message: "Sorry, I can't suggest jobs without a CV." Sets `status: "terminated"`.                                                                             |
| `parse_cv_node`           | Calls the reused CV parsing function. On failure, sets `cvParseError`, does not throw.                                                                                 |
| `search_job_node`         | Calls the reused/existing `searchJobsByTitle`. On failure, sets `searchError`.                                                                                         |
| `merge_results_node`      | Runs after both parallel branches join. If both failed → fallback message + end. If job search empty → `fallback_broaden_node`. Otherwise proceeds to present results. |
| `fallback_broaden_node`   | Suggest broadening search (e.g. drop seniority/location, or ask for a different title). Loops back to `search_job_node` or ends turn awaiting user's new input.        |
| `present_jobs_node`       | Interrupt: show job list, ask user to pick one.                                                                                                                        |
| `select_job_node`         | Resolves user's selection into `selectedJob`. If invalid selection, re-ask (loop to `present_jobs_node`).                                                              |
| `check_applied_node`      | Calls existing duplicate-application check. If already applied → message + loop back to `present_jobs_node`.                                                           |
| `ask_apply_node`          | Interrupt: "Apply to this job? yes/no". If no → loop back to `present_jobs_node`.                                                                                      |
| `ask_data_source_node`    | Interrupt: "Use your parsed CV data, or enter details manually?"                                                                                                       |
| `manual_data_node`        | Interrupt: collect manual fields from user (name/email/etc. — reuse whatever fields the existing manual apply form requires).                                          |
| `confirm_details_node`    | Show assembled application details, interrupt: "Confirm submission? yes/no". If no → loop back to `present_jobs_node`.                                                 |
| `submit_application_node` | Calls the reused, existing apply function. On failure, catch and return a retry/failure message without crashing the graph.                                            |
| `end_node`                | Final response formatting.                                                                                                                                             |

### Conditional edges

```javascript
graph.addConditionalEdges("chat_node", (state) =>
  state.intent === "job_search" ? "ask_cv_node" : "end_node",
);

graph.addConditionalEdges("ask_cv_node", (state) =>
  state.hasCv ? "parallel_join" : "no_cv_end_node",
);

// fan-out: parse_cv_node and search_job_node both get an edge FROM the same
// upstream node (e.g. "start_parallel_node") so LangGraph runs them concurrently;
// both then have a normal edge INTO merge_results_node (fan-in).

graph.addConditionalEdges("merge_results_node", (state) => {
  if (state.searchError && state.cvParseError) return "hard_fallback_end";
  if (state.jobResults.length === 0) return "fallback_broaden_node";
  return "present_jobs_node";
});

graph.addConditionalEdges("select_job_node", (state) =>
  state.selectedJob ? "check_applied_node" : "present_jobs_node",
);

graph.addConditionalEdges("check_applied_node", (state) =>
  state.alreadyApplied ? "present_jobs_node" : "ask_apply_node",
);

graph.addConditionalEdges("ask_apply_node", (state) =>
  state.wantsToApply ? "ask_data_source_node" : "present_jobs_node",
);

graph.addConditionalEdges("ask_data_source_node", (state) =>
  state.useCvData ? "confirm_details_node" : "manual_data_node",
);

graph.addConditionalEdges("confirm_details_node", (state) =>
  state.applicationConfirmed ? "submit_application_node" : "present_jobs_node",
);
```

### HITL implementation

Use LangGraph's `interrupt()` inside each of the nodes marked "Interrupt" above (`ask_cv_node`, `present_jobs_node`, `ask_apply_node`, `ask_data_source_node`, `manual_data_node`, `confirm_details_node`). Each interrupt payload must be structured JSON, not just a string, so the frontend can render proper UI (buttons, job cards, a form) instead of parsing text:

```javascript
import { interrupt } from "@langgraph/sdk"; // or "@langchain/langgraph" per installed version

const answer = interrupt({
  type: "confirm", // "confirm" | "select_job" | "form"
  question: "Do you have a CV to search with?",
  options: ["yes", "no"],
});
```

The API route resumes the graph with `Command({ resume: answer })` when the client sends the user's response to a pending interrupt (see section 5).

### Persistence (in-memory for now)

```javascript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

export const jobAssistantGraph = graph.compile({ checkpointer });
```

- Every request must carry a stable `thread_id` (e.g. the chat session id already used by `<AiChat />` if not sent from frontend, or generate one client-side and persist it in local state/cookies for the conversation's lifetime).
- Document clearly in code comments that `MemorySaver` is **process-memory only** — state is lost on server restart/redeploy and does not work across multiple server instances. Leave a TODO comment pointing to swapping in `@langchain/langgraph-checkpoint-postgres` or `-sqlite` later; do not implement that now.

### Fault tolerance rules

- Wrap every node body in try/catch. On error: log server-side, set the relevant `*Error` state field, increment `errorCount`, and route to a graceful fallback/end node — never let an exception bubble up and kill the API response.
- If `errorCount` exceeds 3 in a single thread run, force-route to `end_node` with a "something went wrong, please try again" message rather than looping indefinitely.
- CV parse failure must not block job search — the parallel branch that succeeded should still be usable (e.g. job search worked, CV parse failed → tell user jobs were found but CV-based matching/autofill isn't available, offer manual apply path later).
- Application submission failure (e.g. DB write fails) must return a clear retry message and must NOT mark `applicationResult` as success.

---

## 4. Tools vs. plain nodes

Since this flow is a fixed, deterministic multi-step process (not "LLM freely decides which tool to call each turn"), model CV parsing, job search, duplicate-check, and apply-submit as **graph nodes that directly call the existing service functions** — not as LLM-invoked tools inside a ReAct loop. Only `chat_node`'s intent classification needs the LLM. This avoids the LLM unpredictably skipping HITL gates.

Keep `search_jobs` as a LangChain `tool` only if you still want the LLM to be able to call it conversationally outside this guided flow (e.g. "what other frontend jobs are there" mid-conversation). If kept, make sure the guided application flow above does not run through the tool-calling path — it should be graph-native so the interrupts are reliable.

---

## 5. API route (`route.js`) requirements

- Accept `{ threadId, message }` or `{ threadId, resumeValue }` from the client — resumeValue is present when responding to a pending interrupt.
- On a fresh message: `await jobAssistantGraph.invoke({ messages: [...] }, { configurable: { thread_id: threadId } })`.
- On a resume: `await jobAssistantGraph.invoke(new Command({ resume: resumeValue }), { configurable: { thread_id: threadId } })`.
- Inspect the result for `__interrupt__`. If present, return `{ interrupt: {...payload} }` to the client instead of a final answer.
- If no interrupt, return the final assistant message(s) as today.
- Wrap the whole handler in try/catch; on unhandled error return a 200 with a graceful chat-style error message (don't surface a raw 500 into the chat UI) plus log details server-side.

---

## 6. Frontend (`<AiChat />`) requirements

- When the API response includes `interrupt`, render the appropriate UI based on `interrupt.type`:
  - `confirm` → yes/no buttons
  - `select_job` → clickable job cards/list
  - `form` → the manual-apply form (reuse existing form component from the job-details page if possible)
- Clicking a button/submitting the form sends `{ threadId, resumeValue }` back to the API — do not let the user free-type over an interrupt unless the interrupt type explicitly allows it.
- Persist `threadId` for the duration of the chat session (e.g. `crypto.randomUUID()` created once on mount, stored in component state).
- Show a distinct visual treatment for HITL prompts (e.g. a bordered card) vs. normal assistant text, so it's clear the user must respond to proceed.

---

## 7. System prompt (`prompts/system.js`)

Replace/extend the current system prompt with:

```
You are a recruiting assistant embedded in a job platform's chat widget.

Your job:
- Help users find jobs and, when they want, guide them through applying — using their CV.
- Handle casual conversation normally and briefly; don't force the job flow on unrelated messages.

Rules:
- If the user expresses any interest in finding, searching, or browsing jobs (e.g. mentions a role, "looking for a job", "I'm a frontend developer", "any openings?"), classify this as job_search intent and hand off to the guided flow — do not attempt to answer with job info yourself.
- Never fabricate job listings, application status, CV contents, or company information. Only reference data provided in state/tool results.
- Never submit a job application without an explicit, unambiguous "yes" from the user at the final confirmation step.
- Respect a "no" at any checkpoint (CV, job selection, apply, data source, final confirm) — do not repeat the same question more than once in a row or pressure the user.
- When presenting jobs, be concise: title, key info, and a clear way to select. Don't repeat the full list in prose if it's already shown as structured data.
- If something fails (CV couldn't be parsed, search failed, application couldn't be submitted), say so plainly and offer a next step — never pretend it succeeded.
- Keep all responses short and action-oriented. You are guiding a step-by-step flow, not writing essays.
```

---

## 8. Testing checklist for Codex to self-verify before finishing

- [ ] Existing manual CV upload + apply flow on the job-details page still works unchanged.
- [ ] Existing plain `search_jobs` behavior for a simple "frontend developer" query still returns results in chat.
- [ ] "hi" / "how are you" → chitchat path, no CV question asked.
- [ ] "I'm looking for a job" → CV question interrupt fires.
- [ ] Answering "no" to CV question → terminates politely, no crash.
- [ ] Answering "yes" → CV parse + job search run, both branches execute (verify via server logs/timing that they're concurrent, not sequential).
- [ ] Zero job results → fallback/broaden message, not a dead end.
- [ ] CV parse failure with job results present → user still gets job list, told CV-based features are unavailable.
- [ ] Selecting a job → apply confirmation interrupt.
- [ ] "no" to apply confirmation → returns to job list, not to start.
- [ ] Already-applied job selected → tells user, returns to job list, does not ask to apply again.
- [ ] "yes" to apply → data source interrupt (CV vs manual).
- [ ] Manual path → form interrupt collects required fields.
- [ ] Final confirmation interrupt shows correct assembled data.
- [ ] "no" at final confirmation → back to job list, nothing submitted.
- [ ] "yes" at final confirmation → calls the real existing apply function, application actually recorded.
- [ ] Killing/restarting the dev server mid-flow is acceptable to lose state (in-memory checkpointer) — confirm this is documented, not silently broken.
- [ ] Reloading the browser mid-flow with the same `threadId` resumes correctly (as long as server process hasn't restarted).

---

## 9. Prompt to paste into Codex

```
Read AGENTS.md and fully analyze the current Next.js project before making changes.

Context: We have an AI recruiting assistant (<AiChat /> component, chat API route using
LangChain's createAgent + ChatGroq with a single search_jobs tool). We also have an
EXISTING, WORKING manual flow on the job-details page where a user uploads their CV,
it gets parsed, and they can apply to a job using the parsed CV data. Find that existing
CV parsing and job application logic in the codebase — do not rewrite it, reuse it.

Goal: Migrate the chat assistant from a single-tool LangChain agent to a LangGraph
StateGraph that supports conditional routing, a parallel CV-parse + job-search step,
and multiple human-in-the-loop (HITL) confirmation points, using in-memory persistence
via MemorySaver keyed by a per-conversation thread_id.
allow user to upload file from the AiChat component

Follow the attached update-chat.md exactly:
- Build the state schema in lib/agent/state.js as specified.
- Build the graph in lib/agent/graph.js with the exact nodes and conditional edges
  described, including the HITL interrupt() calls with structured JSON payloads
  (type: confirm / select_job / form).
- Reuse the existing CV parse and apply-to-job functions by wrapping/refactoring them
  into pure importable functions if needed, without changing their existing behavior,
  and call them from the graph nodes (parse_cv_node, submit_application_node).
- Implement full fault tolerance: every node wrapped in try/catch, graceful fallback
  routing on failure, no unhandled exceptions reaching the API response, an errorCount
  circuit breaker capped at 3 per thread run.
- Update the chat API route to handle both fresh messages and interrupt-resume requests
  (Command({ resume: value })), returning { interrupt: {...} } when the graph pauses.
- Update <AiChat /> to render HITL interrupts appropriately (confirm buttons, selectable
  job list, manual-apply form reusing the existing form component if one exists), and to
  send resume values back instead of free text when an interrupt is pending.
- Update the system prompt per the "System prompt" section.
- Do NOT break the existing manual job-details-page apply flow or the existing plain
  job search behavior.
- Add a code comment noting MemorySaver is in-process only and will need to be swapped
  for a persistent checkpointer (Postgres/SQLite) later — do not implement that swap now.
- Before declaring done, go through the "Testing checklist" section in update-chat.md
  and verify each item; report back on any item you could not verify or had to skip
  and why.

Ask me before making changes if you can't find the existing CV parse/apply functions,
or if the current chat API route/AiChat component structure differs significantly from
what's assumed above.
```
