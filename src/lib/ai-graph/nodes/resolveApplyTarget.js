import { getLastHumanText, resolveJobFromText } from "../lib/helpers";

export async function resolveApplyTarget(state) {
  const text = getLastHumanText(state.messages);
  const job = resolveJobFromText(text, state.lastShownJobs);

  if (!job) {
    return { selectedJobId: null };
  }

  return { selectedJobId: job.id };
}
