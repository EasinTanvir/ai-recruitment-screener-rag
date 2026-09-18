import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";

import { tools } from "./tools";
import { SYSTEM_PROMPT } from "./prompts/system";

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0,
  maxTokens: 1024,
  maxRetries: 2,
});

export const agent = createAgent({
  model,
  tools,
  systemPrompt: SYSTEM_PROMPT,
});
