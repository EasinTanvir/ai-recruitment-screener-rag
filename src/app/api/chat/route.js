import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { agent } from "@/lib/ai/agent";

export async function POST(req) {
  const { messages } = await req.json();

  const response = await agent.invoke({
    messages,
  });

  const aiMessage = [...response.messages]
    .reverse()
    .find((m) => m instanceof AIMessage);

  const toolMessage = [...response.messages]
    .reverse()
    .find((m) => m instanceof ToolMessage);

  let toolResult = null;

  if (toolMessage) {
    const parsed = JSON.parse(toolMessage.content);

    toolResult = {
      type: "jobs",
      items: parsed.jobs.map((job) => ({
        ...job,
        url: `/job/details/${job.id}`,
      })),
    };
  }

  return Response.json({
    message: aiMessage?.content ?? "",
    toolResult,
  });
}
