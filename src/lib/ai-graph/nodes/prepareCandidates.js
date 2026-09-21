import { searchJobsByTitle } from "@/lib/ai/queries/jobs";
import { getJobByIdFull } from "../lib/jobQueries";
import { reply } from "../lib/helpers";

const MAX_CANDIDATES = 5;

/**
 * Uses the CV's extracted title (+ falls back to a broad listing) to pull a
 * short candidate list, which prepareCandidates -> scoreJob will then fan
 * out and score in parallel.
 */
export async function prepareCandidates(state) {
  const searchTerms = [
    state.cvProfile?.title,
    ...(state.cvProfile?.searchTerms ?? []),
    ...(state.cvProfile?.skills ?? []),
  ]
    .filter(Boolean)
    .map((term) => term.trim())
    .filter((term, index, terms) => terms.indexOf(term) === index)
    .slice(0, 6);

  let jobs = [];

  // Search several CV-derived title/skill terms. This preserves the existing
  // title search but lets a "Full Stack Engineer" CV find a "Full Stack
  // Developer" opening and still falls back to strong skills such as React.
  for (const term of searchTerms) {
    if (jobs.length >= MAX_CANDIDATES) break;
    const matches = await searchJobsByTitle(term);
    const existingIds = new Set(jobs.map((job) => job.id));
    jobs = jobs.concat(matches.filter((job) => !existingIds.has(job.id)));
  }

  // A readable CV with no title/skill match should finish gracefully rather
  // than silently producing no assistant message.
  if (!jobs.length) {
    return {
      candidateJobs: [],
      jobResults: [],
      lastShownJobs: [],
      ...reply(
        "I could read your CV, but I couldn't find a currently open role matching its title or skills. Try a title or skill directly and I'll search again.",
      ),
    };
  }

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
