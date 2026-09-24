// nodes/chatNode.js
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";
import { chatModel } from "../lib/models";
import { CONTEXT_WINDOW, reply } from "../lib/helpers";
import { RESPONSE_FORMATTING } from "../lib/formatting";
import { searchJobsTool } from "../tools/searchJobsTool";

const tools = [searchJobsTool];
export const jobToolNode = new ToolNode(tools);
export const toolsRouter = toolsCondition; // standard tools_condition equivalent

const llmWithTools = chatModel.bindTools(tools);

function systemPrompt(state) {
  const authNote = state.isAuthenticated
    ? "The user IS currently logged in, so CV upload is available right now — never say they need to log in to upload a CV."
    : "The user is NOT logged in. If relevant, mention they need to log in before uploading a CV.";

  return `You are the AI recruiting assistant for this job platform.
Be brief and friendly. You can search jobs with the search_jobs tool, and
walk a logged-in user through applying (with a confirmation step before
anything is submitted). Do not invent job listings — only reference jobs
already shown in this conversation or returned by the tool.
${authNote}

${RESPONSE_FORMATTING}`;
}

export async function chatNode(state) {
  const recent = state.messages.slice(-CONTEXT_WINDOW);

  // pass real BaseMessage objects — no flattening — so tool_calls /
  // tool_call_id survive across turns
  const res = await llmWithTools
    .invoke([new SystemMessage(systemPrompt(state)), ...recent])
    .catch((err) => {
      console.error("chatNode failed:", err);
      return null;
    });

  if (!res) {
    return reply(
      "Hi! I can help you search for jobs or apply with your CV — what would you like to do?",
    );
  }

  return { messages: [res] };
}
