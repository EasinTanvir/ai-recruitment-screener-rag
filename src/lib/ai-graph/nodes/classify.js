import { z } from "zod";
import { structuredModel } from "../lib/models";
import { getLastHumanText, CONTEXT_WINDOW } from "../lib/helpers";
import { safeStructured } from "../lib/safeInvoke";

const RouteSchema = z.object({
  route: z
    .enum(["OFFTOPIC", "GENERAL", "JOB_SEARCH_TEXT", "APPLY_INTENT"])
    .describe("Best matching route for the user's latest message"),
});

const router = structuredModel.withStructuredOutput(RouteSchema, {
  name: "route_classification",
  method: "functionCalling",
});

function isCvRecommendationRequest(text) {
  const normalized = text.toLowerCase().trim();

  return (
    /\b(suggest|recommend|show|find|search|match)\b.*\b(job|jobs|role|roles|position|positions|opening|openings)\b/.test(
      normalized,
    ) ||
    /\b(more|other|another)\s+(job|jobs|role|roles|position|positions|opening|openings)\b/.test(
      normalized,
    ) ||
    /\bwhat\s+(job|jobs|role|roles|position|positions|opening|openings)\b/.test(
      normalized,
    )
  );
}

function isApplyReference(text) {
  return /\b(apply|application|this\s+(job|role|position|post|one)|that\s+(job|role|position|post|one)|apply\s+for\s+it)\b/i.test(
    text,
  );
}

const SYSTEM = `You are the intent router for a recruiting-platform chatbot.
Classify the user's LATEST message into exactly one route, using the recent
conversation for context (e.g. if the assistant just listed jobs and asked
which one to apply to, a reply like "the second one" or a job title is
APPLY_INTENT, not JOB_SEARCH_TEXT).

Routes:
- JOB_SEARCH_TEXT: user describes a role/skill/title they want, or asks what
  jobs are open ("frontend roles?", "any React jobs", "show me openings"),
  including vague statements like "I'm looking for a job" (a later step will
  ask them to be specific — you just need to route it here).
- APPLY_INTENT: user wants to apply / proceed with a specific job they were
  just shown, or names a job to apply to.
- GENERAL: on-topic questions about the platform, applying process, this
  assistant's capabilities, greetings, "what can you do".
- OFFTOPIC: anything unrelated to jobs/careers/this platform (weather,
  politics, coding help, personal chit-chat unrelated to job search, etc).

Always prefer JOB_SEARCH_TEXT or APPLY_INTENT when there is any reasonable
reading that fits — this platform's whole purpose is job search.

When you want to draw attention to something, wrap ONLY the specific phrase 
(never a whole sentence) in one of these markers:

- :danger[...]   → blocking errors / failures        (red)
- :warn[...]     → a required action before continuing, e.g. login  (amber)
- :success[...]  → confirmations, e.g. application submitted        (green)
- :info[...]     → a neutral callout worth noticing                 (blue)
- :highlight[...]→ emphasize one key term                           (yellow)

Example:
"You can browse jobs without an account, but :warn[you'll need to log in] 
before uploading your CV."

Use normal markdown (##, **, -, numbered lists) for everything else.
Use these sparingly — a few words, not paragraphs.
`;

export async function classify(state) {
  // Every fresh (non-resume) turn starts here — always clear last turn's
  // displayed job list so a stale list can't bleed into an unrelated reply.
  const base = { jobResults: [] };

  // ---- deterministic short-circuits (no LLM needed / wanted) ----
  if (state.incomingResumeUrl && state.pendingApplyJobId) {
    return { ...base, route: "RESUME_APPLY_WITH_CV" };
  }
  if (state.incomingResumeUrl) {
    return { ...base, route: "CV_SEARCH" };
  }
  // Everything needed to finish an apply is already on file (e.g. the user
  // just logged in after a "please log in" detour) — skip straight back to
  // confirmation regardless of what they type next.
  if (state.pendingApplyJobId && state.isAuthenticated) {
    return {
      ...base,
      route: state.resumeUrl ? "RESUME_APPLY_READY" : "RESUME_APPLY_NEEDS_CV",
    };
  }

  const lastText = getLastHumanText(state.messages).trim();
  if (!lastText) {
    return { ...base, route: "GENERAL" };
  }

  if (
    state.resumeUrl &&
    state.resumeText &&
    isCvRecommendationRequest(lastText)
  ) {
    return { ...base, route: "CV_MATCH_SEARCH" };
  }

  if (state.lastShownJobs?.length && isApplyReference(lastText)) {
    return { ...base, route: "APPLY_INTENT" };
  }

  const recent = state.messages.slice(-CONTEXT_WINDOW);
  const result = await safeStructured(
    router,
    [
      { role: "system", content: SYSTEM },
      ...recent.map((m) => ({
        role: m._getType?.() === "human" ? "user" : "assistant",
        content: typeof m.content === "string" ? m.content : "",
      })),
    ],
    { route: "GENERAL" }, // fail-safe default if the model output can't be parsed
    "classify",
  );

  return { ...base, route: result.route };
}
