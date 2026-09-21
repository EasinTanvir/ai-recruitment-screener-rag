import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import { recruitingGraph } from "@/lib/ai-graph/graph";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  const { threadId, message, resumeUrl, resume } = body;

  if (!threadId) {
    return Response.json({ error: "threadId is required" }, { status: 400 });
  }

  const user = await getCurrentUser(); // reads auth_token cookie server-side
  const config = { configurable: { thread_id: threadId } };
  const isResume = resume !== undefined && resume !== null;

  let result;

  if (isResume) {
    // Resuming a paused (interrupted) graph — e.g. user tapped Confirm/Cancel
    result = await recruitingGraph.invoke(new Command({ resume }), config);
  } else {
    result = await recruitingGraph.invoke(
      {
        messages: message ? [new HumanMessage(message)] : [],
        incomingResumeUrl: resumeUrl ?? null,
        isAuthenticated: !!user,
        userId: user?.id ?? null,
      },
      config,
    );
  }

  // ---- did the graph pause for human approval? ----
  const pendingInterrupt = result.__interrupt__?.[0]?.value ?? null;

  // ---- last assistant text message (if any) ----
  const aiMessage = [...(result.messages ?? [])]
    .reverse()
    .find((m) => m instanceof AIMessage);
  const message_ = pendingInterrupt
    ? pendingInterrupt.message
    : (aiMessage?.content ?? "");

  // ---- job list to render, ONLY for a fresh turn that actually produced
  // one — never on a resume turn, and never when we're mid-confirmation,
  // otherwise stale checkpointed jobResults leak into unrelated replies ----
  let toolResult = null;
  if (!pendingInterrupt && !isResume && result.jobResults?.length) {
    toolResult = {
      type: "jobs",
      items: result.jobResults.map((job) => ({
        ...job,
        url: `/job/details/${job.id}`,
      })),
    };
  }

  return Response.json({
    message: message_,
    toolResult,
    interrupt: pendingInterrupt,
  });
}
