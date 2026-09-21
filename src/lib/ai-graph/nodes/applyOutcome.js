import { getJobByIdFull } from "../lib/jobQueries";
import { reply } from "../lib/helpers";
import { applyJobAction } from "../../../../serverAction/applyJobAction";

export async function applyJobNode(state) {
  const jobId = state.selectedJobId;

  if (!jobId || !state.resumeUrl || !state.resumeText) {
    return {
      ...reply(
        "I no longer have all the information needed to submit this application. Please upload your CV again and retry.",
      ),
    };
  }

  const job = await getJobByIdFull(jobId);
  if (!job) {
    return {
      pendingApplyJobId: null,
      ...reply("That job is no longer available."),
    };
  }

  try {
    // This is deliberately the same path used by ApplyForm. It owns
    // authorization, PDF parsing, evaluation, duplicate checks, and the
    // database transaction, so the agent cannot drift from the main flow.
    const result = await applyJobAction({ jobId, resumeUrl: state.resumeUrl });

    if (!result.success) {
      return {
        pendingApplyJobId: null,
        selectedJobId: null,
        ...reply(result.message),
      };
    }

    return {
      pendingApplyJobId: null,
      selectedJobId: null,
      ...reply(
        `Application submitted for **${job.title}** at ${job.companyName}. Good luck!`,
      ),
    };
  } catch (err) {
    console.error("Chatbot apply failed:", err);
    return {
      ...reply(
        "Something went wrong while submitting your application. Please try again in a moment.",
      ),
    };
  }
}

export async function cancelNode(state) {
  return {
    pendingApplyJobId: null,
    selectedJobId: null,
    ...reply(
      "No problem - application cancelled. Let me know if you'd like to look at other roles.",
    ),
  };
}
