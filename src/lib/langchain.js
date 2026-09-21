import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  // Keep application evaluation on the same available Groq model used by
  // the agent's structured operations. The legacy llama model is no longer
  // available to this project and made submissions fail after confirmation.
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: 2000,
  maxRetries: 2,
});

export default llm;
