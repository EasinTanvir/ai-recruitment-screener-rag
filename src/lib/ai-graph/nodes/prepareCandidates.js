import { searchJobsByTitle } from "@/lib/ai/queries/jobs";
import { getJobByIdFull } from "../lib/jobQueries";

const MAX_CANDIDATES = 5;

/**
 * Uses the CV's extracted title (+ falls back to a broad listing) to pull a
 * short candidate list, which prepareCandidates -> scoreJob will then fan
 * out and score in parallel.
 */
export async function prepareCandidates(state) {
  const title = state.cvProfile?.title || "";

  let jobs = title ? await searchJobsByTitle(title) : [];

  // widen search using top skills if the title search came back thin
  if (jobs.length < MAX_CANDIDATES && state.cvProfile?.skills?.length) {
    for (const skill of state.cvProfile.skills.slice(0, 3)) {
      if (jobs.length >= MAX_CANDIDATES) break;
      const more = await searchJobsByTitle(skill);
      const existingIds = new Set(jobs.map((j) => j.id));
      jobs = jobs.concat(more.filter((j) => !existingIds.has(j.id)));
    }
  }

  const shortlist = jobs.slice(0, MAX_CANDIDATES);
  const full = (
    await Promise.all(shortlist.map((j) => getJobByIdFull(j.id)))
  ).filter(Boolean);

  return { candidateJobs: full };
}
