// nodes/moderationGuard.js
import { ChatGroq } from "@langchain/groq";
import { getLastHumanText } from "../lib/helpers";

const moderationModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0,
  maxTokens: 10, // we only need one word back
  maxRetries: 2,
});

export async function moderationGuard(state) {
  const text = getLastHumanText(state.messages);
  if (!text) return { blocked: false };

  // only ambiguous, longer messages go to the LLM
  try {
    const res = await moderationModel.invoke([
      {
        role: "system",
        content:
          'You are a strict content moderator for a job-recruiting chatbot. Reply with ONLY one word: "BLOCK" or "ALLOW". Block only genuinely harmful, violent, hateful, or abusive content — not just off-topic chat.',
      },
      { role: "user", content: text },
    ]);
    return {
      blocked: res.content.toString().trim().toUpperCase().startsWith("BLOCK"),
    };
  } catch (err) {
    console.error("moderationGuard LLM fallback failed:", err);
    return { blocked: false }; // fail-open
  }
}
