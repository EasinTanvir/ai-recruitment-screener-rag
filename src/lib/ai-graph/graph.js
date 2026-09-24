import { StateGraph, START, END, Send } from "@langchain/langgraph";
import { AgentState } from "./state";
import { getCheckpointer } from "./lib/checkpointer";

import { moderationGuard } from "./nodes/moderationGuard";
import { moderationRejected } from "./nodes/moderationRejected";
import { classify } from "./nodes/classify";
import { offtopicGuard } from "./nodes/offtopicGuard";
import { chatNode, jobToolNode, toolsRouter } from "./nodes/chatNode";
import { syncSearchResults } from "./nodes/syncSearchResults";
import { handleCvUpload } from "./nodes/handleCvUpload";
import { prepareCandidates } from "./nodes/prepareCandidates";
import { scoreJob } from "./nodes/scoreJob";
import { aggregateScores } from "./nodes/aggregateScores";
import { presentResults } from "./nodes/presentResults";
import { resolveApplyTarget } from "./nodes/resolveApplyTarget";
import { clarifyApplyTarget, needLogin, needCv } from "./nodes/applyDetours";
import { buildConfirmation } from "./nodes/buildConfirmation";
import { applyJobNode, cancelNode } from "./nodes/applyOutcome";

const builder = new StateGraph(AgentState)
  .addNode("moderationGuard", moderationGuard)
  .addNode("moderationRejected", moderationRejected)
  .addNode("classify", classify)
  .addNode("offtopicGuard", offtopicGuard)
  .addNode("chat", chatNode)
  .addNode("tools", jobToolNode)
  .addNode("syncSearchResults", syncSearchResults)
  .addNode("handleCvUpload", handleCvUpload)
  .addNode("prepareCandidates", prepareCandidates)
  .addNode("scoreJob", scoreJob)
  .addNode("aggregateScores", aggregateScores)
  .addNode("presentResults", presentResults)
  .addNode("resolveApplyTarget", resolveApplyTarget)
  .addNode("clarifyApplyTarget", clarifyApplyTarget)
  .addNode("needLogin", needLogin)
  .addNode("needCv", needCv)
  .addNode("buildConfirmation", buildConfirmation)
  .addNode("applyJobNode", applyJobNode)
  .addNode("cancelNode", cancelNode)

  .addEdge(START, "moderationGuard")
  .addConditionalEdges(
    "moderationGuard",
    (s) => (s.blocked ? "BLOCKED" : "OK"),
    {
      BLOCKED: "moderationRejected",
      OK: "classify",
    },
  )
  .addEdge("moderationRejected", END)

  .addConditionalEdges("classify", (state) => state.route, {
    OFFTOPIC: "offtopicGuard",
    CHAT: "chat",
    CV_SEARCH: "handleCvUpload",
    RESUME_APPLY_WITH_CV: "handleCvUpload",
    RESUME_APPLY_READY: "buildConfirmation",
    RESUME_APPLY_NEEDS_CV: "needCv",
    CV_MATCH_SEARCH: "prepareCandidates",
    APPLY_INTENT: "resolveApplyTarget",
  })
  .addEdge("offtopicGuard", END)

  // the ONLY LLM-decided branch in the whole graph
  .addConditionalEdges("chat", toolsRouter, { tools: "tools", [END]: END })
  .addEdge("tools", "syncSearchResults")
  .addEdge("syncSearchResults", "chat")

  .addConditionalEdges(
    "handleCvUpload",
    (state) => {
      if (state.cvParseError) return "STOP";
      return state.pendingApplyJobId ? "RESUME" : "SEARCH";
    },
    { STOP: END, RESUME: "buildConfirmation", SEARCH: "prepareCandidates" },
  )

  .addConditionalEdges("prepareCandidates", (state) => {
    if (!state.candidateJobs.length) return [];
    return state.candidateJobs.map(
      (job) => new Send("scoreJob", { job, resumeText: state.resumeText }),
    );
  })
  .addEdge("scoreJob", "aggregateScores")
  .addEdge("aggregateScores", "presentResults")
  .addEdge("presentResults", END)

  .addConditionalEdges(
    "resolveApplyTarget",
    (state) => {
      if (!state.selectedJobId) return "CLARIFY";
      if (!state.isAuthenticated) return "NEED_LOGIN";
      if (!state.resumeUrl) return "NEED_CV";
      return "READY";
    },
    {
      CLARIFY: "clarifyApplyTarget",
      NEED_LOGIN: "needLogin",
      NEED_CV: "needCv",
      READY: "buildConfirmation",
    },
  )
  .addEdge("clarifyApplyTarget", END)
  .addEdge("needLogin", END)
  .addEdge("needCv", END)

  .addConditionalEdges("buildConfirmation", (state) => state.route ?? "STOP", {
    DO_APPLY: "applyJobNode",
    DO_CANCEL: "cancelNode",
    STOP: END,
  })
  .addEdge("applyJobNode", END)
  .addEdge("cancelNode", END);

export const recruitingGraph = builder.compile({
  checkpointer: getCheckpointer(),
});
