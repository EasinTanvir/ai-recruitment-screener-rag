import { searchJobsByTitle } from "@/lib/ai/queries/jobs";
import { reply } from "../lib/helpers";

export async function searchJobsByTitleNode(state) {
  const query = state.searchKeyword;
  const jobs = await searchJobsByTitle(query);

  if (!jobs.length) {
    return {
      jobResults: [],
      lastShownJobs: [],
      ...reply(
        `I couldn't find any published jobs matching "${query}". Try a different title or a broader skill, or upload your CV and I'll match you against everything open.`,
      ),
    };
  }

  return { jobResults: jobs, lastShownJobs: jobs };
}
