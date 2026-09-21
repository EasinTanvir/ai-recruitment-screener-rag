import { z } from "zod";
import { structuredModel } from "../lib/models";

const ScoreSchema = z.object({
  score: z.number().min(0).max(100),
  reason: z.string().describe("One short sentence on why this score"),
});

const scorer = structuredModel.withStructuredOutput(ScoreSchema, {
  name: "cv_job_match",
});

/**
 * Fan-out target: this node is invoked once per candidate job via
 * Send("scoreJob", { job, resumeText }) from prepareCandidates' outgoing
 * conditional edge. LangGraph runs each Send invocation concurrently.
 */
export async function scoreJob(state) {
  const { job, resumeText } = state;

  const result = await scorer.invoke([
    {
      role: "system",
      content:
        "Score how well this resume matches this job, 0-100, based on " +
        "skills/experience overlap with the requirements. Be realistic, " +
        "not generous.",
    },
    {
      role: "user",
      content: `JOB TITLE: ${job.title}\nREQUIREMENTS: ${job.requirements}\nDESCRIPTION: ${job.description}\n\nRESUME:\n${resumeText.slice(0, 8000)}`,
    },
  ]);

  return {
    jobScores: [{ jobId: job.id, score: result.score, reason: result.reason }],
  };
}
