import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";

import { tools } from "./tools";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0,
  maxTokens: 1024,
  maxRetries: 2,
});

export const agent = createAgent({
  model,
  tools,
});
