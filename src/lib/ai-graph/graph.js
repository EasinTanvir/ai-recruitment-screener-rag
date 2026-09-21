import { StateGraph, START, END, Send } from "@langchain/langgraph";
import { AgentState } from "./state";
import { getCheckpointer } from "./lib/checkpointer";

import { classify } from "./nodes/classify";
import { offtopicGuard } from "./nodes/offtopicGuard";
import { generalChat } from "./nodes/generalChat";
import { handleCvUpload } from "./nodes/handleCvUpload";
import { prepareCandidates } from "./nodes/prepareCandidates";
import { scoreJob } from "./nodes/scoreJob";
import { aggregateScores } from "./nodes/aggregateScores";
import { extractSearchKeyword } from "./nodes/extractSearchKeyword";
import { askJobPreference } from "./nodes/askJobPreference";
import { searchJobsByTitleNode } from "./nodes/searchJobsByTitleNode";
import { presentResults } from "./nodes/presentResults";
import { resolveApplyTarget } from "./nodes/resolveApplyTarget";
import { clarifyApplyTarget, needLogin, needCv } from "./nodes/applyDetours";
import { buildConfirmation } from "./nodes/buildConfirmation";
import { applyJobNode, cancelNode } from "./nodes/applyOutcome";

const builder = new StateGraph(AgentState)
  .addNode("classify", classify)
  .addNode("offtopicGuard", offtopicGuard)
  .addNode("generalChat", generalChat)
  .addNode("handleCvUpload", handleCvUpload)
  .addNode("prepareCandidates", prepareCandidates)
  .addNode("scoreJob", scoreJob)
  .addNode("aggregateScores", aggregateScores)
  .addNode("extractSearchKeyword", extractSearchKeyword)
  .addNode("askJobPreference", askJobPreference)
  .addNode("searchJobsByTitleNode", searchJobsByTitleNode)
  .addNode("presentResults", presentResults)
  .addNode("resolveApplyTarget", resolveApplyTarget)
  .addNode("clarifyApplyTarget", clarifyApplyTarget)
  .addNode("needLogin", needLogin)
  .addNode("needCv", needCv)
  .addNode("buildConfirmation", buildConfirmation)
  .addNode("applyJobNode", applyJobNode)
  .addNode("cancelNode", cancelNode)

  .addEdge(START, "classify")

  .addConditionalEdges("classify", (state) => state.route, {
    OFFTOPIC: "offtopicGuard",
    GENERAL: "generalChat",
    CV_SEARCH: "handleCvUpload",
    RESUME_APPLY_WITH_CV: "handleCvUpload",
    RESUME_APPLY_READY: "buildConfirmation",
    RESUME_APPLY_NEEDS_CV: "needCv",
    CV_MATCH_SEARCH: "prepareCandidates",
    JOB_SEARCH_TEXT: "extractSearchKeyword",
    APPLY_INTENT: "resolveApplyTarget",
  })

  // does the message actually name a role/skill, or is it vague ("I'm
  // looking for a job")? avoids blindly querying the DB with raw text.
  .addConditionalEdges(
    "extractSearchKeyword",
    (state) => (state.searchKeyword ? "HAS" : "NONE"),
    { HAS: "searchJobsByTitleNode", NONE: "askJobPreference" },
  )
  .addEdge("askJobPreference", END)

  // after a CV upload: either continue an in-flight apply, or run the
  // general "match me against open jobs" flow
  .addConditionalEdges(
    "handleCvUpload",
    (state) => {
      if (state.cvParseError) return "STOP";
      return state.pendingApplyJobId ? "RESUME" : "SEARCH";
    },
    {
      STOP: END,
      RESUME: "buildConfirmation",
      SEARCH: "prepareCandidates",
    },
  )

  // fan-out: score every candidate job against the CV in parallel
  .addConditionalEdges("prepareCandidates", (state) => {
    if (!state.candidateJobs.length) return [];
    return state.candidateJobs.map(
      (job) => new Send("scoreJob", { job, resumeText: state.resumeText }),
    );
  })
  .addEdge("scoreJob", "aggregateScores")
  .addEdge("aggregateScores", "presentResults")

  .addEdge("searchJobsByTitleNode", "presentResults")
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
