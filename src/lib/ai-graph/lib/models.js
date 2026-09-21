import { ChatGroq } from "@langchain/groq";

// One low-temp model for deterministic classification / extraction / scoring,
// one slightly warmer model for free-text chat replies. Reuse instances
// across requests (module-level singletons).

export const structuredModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0,
  maxTokens: 1024,
  maxRetries: 2,
});

export const chatModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.4,
  maxTokens: 1024,
  maxRetries: 2,
});
