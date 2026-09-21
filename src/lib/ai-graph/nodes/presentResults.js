import { AIMessage } from "@langchain/core/messages";

export async function presentResults(state) {
  const jobs = state.jobResults;

  // If an earlier node already sent a "no results" message, don't
  // pile on a second empty one.
  if (!jobs || jobs.length === 0) {
    return {};
  }

  const hasScores = jobs.some((j) => typeof j.matchScore === "number");

  const lines = jobs.map((j, i) => {
    const scorePart = hasScores && typeof j.matchScore === "number" ? ` — ${j.matchScore}% match` : "";
    return `${i + 1}. **${j.title}** at ${j.companyName}${scorePart}`;
  });

  const header = hasScores
    ? "Based on your CV, here's how you match against open roles:"
    : "Here's what I found:";

  const text = [
    header,
    "",
    ...lines,
    "",
    "Let me know which one you'd like to apply for.",
  ].join("\n");

  return { messages: [new AIMessage(text)] };
}
