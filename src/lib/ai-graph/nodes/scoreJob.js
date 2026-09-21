import { z } from "zod";
import { structuredModel } from "../lib/models";
import { safeStructured } from "../lib/safeInvoke";

const ScoreSchema = z.object({
  score: z.number().min(0).max(100),
  reason: z.string().describe("One short sentence on why this score"),
});

const scorer = structuredModel.withStructuredOutput(ScoreSchema, {
  name: "cv_job_match",
  method: "functionCalling",
});

export async function scoreJob(state) {
  const { job, resumeText } = state;

  const result = await safeStructured(
    scorer,
    [
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
    ],
    { score: null, reason: "Couldn't be scored automatically." },
    "scoreJob",
  );

  return {
    jobScores: [{ jobId: job.id, score: result.score, reason: result.reason }],
  };
}
