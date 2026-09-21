import { searchJobsByTitle } from "@/lib/ai/queries/jobs";
import { getLastHumanText, reply } from "../lib/helpers";

export async function searchJobsByTitleNode(state) {
  const query = getLastHumanText(state.messages);
  const jobs = await searchJobsByTitle(query);

  if (!jobs.length) {
    return {
      jobResults: [],
      lastShownJobs: [],
      ...reply(
        `I couldn't find any published jobs matching "${query}". Try a different title, or upload your CV and I'll match you against everything open.`,
      ),
    };
  }

  return { jobResults: jobs, lastShownJobs: jobs };
}
