import { interrupt } from "@langchain/langgraph";
import { z } from "zod";
import { structuredModel } from "../lib/models";
import { getJobByIdFull } from "../lib/jobQueries";
import { reply } from "../lib/helpers";
import { safeStructured } from "../lib/safeInvoke";

const ScoreSchema = z.object({
  score: z.number().min(0).max(100),
  reason: z.string(),
});
const scorer = structuredModel.withStructuredOutput(ScoreSchema, {
  name: "cv_job_match_single",
  method: "functionCalling",
});

export async function buildConfirmation(state) {
  const jobId = state.selectedJobId ?? state.pendingApplyJobId;
  const job = await getJobByIdFull(jobId);

  if (!job) {
    return {
      route: "STOP",
      pendingApplyJobId: null,
      ...reply(
        "That job doesn't seem to be available anymore — want to search again?",
      ),
    };
  }

  if (!state.resumeText) {
    return {
      route: "STOP",
      ...reply("I don't have your CV on file yet — please upload it first."),
    };
  }

  const match = await safeStructured(
    scorer,
    [
      {
        role: "system",
        content:
          "Score how well this resume matches this job, 0-100, and give one short reason.",
      },
      {
        role: "user",
        content: `JOB TITLE: ${job.title}\nREQUIREMENTS: ${job.requirements}\nDESCRIPTION: ${job.description}\n\nRESUME:\n${state.resumeText.slice(0, 8000)}`,
      },
    ],
    { score: null, reason: "Couldn't be scored automatically." },
    "buildConfirmation:score",
  );

  const applicant = {
    firstName: state.cvProfile?.firstName ?? null,
    lastName: state.cvProfile?.lastName ?? null,
    email: state.cvProfile?.email ?? null,
  };

  const scoreText =
    typeof match.score === "number" ? `${match.score}%` : "not available";

  const decision = interrupt({
    type: "apply_confirmation",
    job: { id: job.id, title: job.title, companyName: job.companyName },
    applicant,
    matchScore: match.score,
    matchReason: match.reason,
    message:
      "Here's what I'll submit for this application — confirm to send it, or cancel.",
    question: `This is what I'll submit for **${job.title}** at ${job.companyName} — name: ${applicant.firstName ?? "?"} ${applicant.lastName ?? ""}, email: ${applicant.email ?? "?"}, estimated match: ${scoreText}. Reply "confirm" to submit or "cancel" to stop.`,
  });

  const confirmed = String(decision).trim().toLowerCase() === "confirm";

  return {
    selectedJobId: job.id,
    route: confirmed ? "DO_APPLY" : "DO_CANCEL",
  };
}
