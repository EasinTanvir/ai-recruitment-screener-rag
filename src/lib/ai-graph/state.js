import { Annotation, messagesStateReducer } from "@langchain/langgraph";

/**
 * Central graph state.
 *
 * IMPORTANT langgraph behavior: a key WITHOUT a custom reducer uses
 * "last write wins" — if a node's return object omits a key, the
 * previously checkpointed value is kept (not reset to default). We rely
 * on this for cross-turn memory (resumeUrl, pendingApplyJobId, etc.) and
 * we explicitly null-out fields when we want to "consume"/clear them.
 */
export const AgentState = Annotation.Root({
  // ---- conversation ----
  messages: Annotation({
    reducer: messagesStateReducer,
    default: () => [],
  }),

  // ---- auth (recomputed from the request cookie on every turn) ----
  isAuthenticated: Annotation({ default: () => false }),
  userId: Annotation({ default: () => null }),

  // ---- routing ----
  route: Annotation({ default: () => null }),

  // ---- cv ----
  // incomingResumeUrl: set ONLY on the turn a file was just uploaded.
  // Nodes that consume it must return incomingResumeUrl: null afterwards.
  incomingResumeUrl: Annotation({ default: () => null }),
  resumeUrl: Annotation({ default: () => null }),
  resumeText: Annotation({ default: () => null }),
  cvProfile: Annotation({ default: () => null }), // { firstName, lastName, email, title, skills[], yearsExperience }
  cvParseError: Annotation({ default: () => null }),

  // ---- job search ----
  jobResults: Annotation({ default: () => [] }), // last results shown to the user, with optional matchScore
  lastShownJobs: Annotation({ default: () => [] }), // kept stable for "apply to the 2nd one" resolution

  // ---- parallel cv-matching scratch space ----
  candidateJobs: Annotation({ default: () => [] }),
  // transient: populated per-invocation by the Send() fan-out into scoreJob
  job: Annotation({ default: () => null }),
  // reducer accumulates the parallel Send() results within one superstep;
  // a node can hard-reset the list by returning `null` explicitly (plain
  // [] would be a no-op under concat semantics).
  jobScores: Annotation({
    reducer: (existing = [], update) =>
      update === null ? [] : existing.concat(update ?? []),
    default: () => [],
  }),

  // ---- apply flow ----
  selectedJobId: Annotation({ default: () => null }),
  // set when we had to detour the user (login / upload cv) mid-apply,
  // so we can "jump" straight back into the apply flow once satisfied.
  pendingApplyJobId: Annotation({ default: () => null }),
});
