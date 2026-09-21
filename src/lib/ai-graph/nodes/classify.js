import { z } from "zod";
import { structuredModel } from "../lib/models";
import { getLastHumanText } from "../lib/helpers";

const RouteSchema = z.object({
  route: z
    .enum(["OFFTOPIC", "GENERAL", "JOB_SEARCH_TEXT", "APPLY_INTENT"])
    .describe("Best matching route for the user's latest message"),
});

const router = structuredModel.withStructuredOutput(RouteSchema, {
  name: "route_classification",
});

const SYSTEM = `You are the intent router for a recruiting-platform chatbot.
Classify the user's LATEST message into exactly one route, using the recent
conversation for context (e.g. if the assistant just listed jobs and asked
which one to apply to, a reply like "the second one" or a job title is
APPLY_INTENT, not JOB_SEARCH_TEXT).

Routes:
- JOB_SEARCH_TEXT: user describes a role/skill/title they want, or asks what
  jobs are open ("frontend roles?", "any React jobs", "show me openings").
- APPLY_INTENT: user wants to apply / proceed with a specific job they were
  just shown, or names a job to apply to.
- GENERAL: on-topic questions about the platform, applying process, this
  assistant's capabilities, greetings, "what can you do".
- OFFTOPIC: anything unrelated to jobs/careers/this platform (weather,
  politics, coding help, personal chit-chat unrelated to job search, etc).

Always prefer JOB_SEARCH_TEXT or APPLY_INTENT when there is any reasonable
reading that fits — this platform's whole purpose is job search.`;

export async function classify(state) {
  // ---- deterministic short-circuits (no LLM needed / wanted) ----
  if (state.incomingResumeUrl && state.pendingApplyJobId) {
    return { route: "RESUME_APPLY_WITH_CV" };
  }
  if (state.incomingResumeUrl) {
    return { route: "CV_SEARCH" };
  }

  const lastText = getLastHumanText(state.messages).trim();
  if (!lastText) {
    return { route: "GENERAL" };
  }

  // ---- last few turns for context, LLM classification for the rest ----
  const recent = state.messages.slice(-6);
  const result = await router.invoke([
    { role: "system", content: SYSTEM },
    ...recent.map((m) => ({
      role: m._getType?.() === "human" ? "user" : "assistant",
      content: typeof m.content === "string" ? m.content : "",
    })),
  ]);

  return { route: result.route };
}
