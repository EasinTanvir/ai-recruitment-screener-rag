// nodes/syncSearchResults.js
export async function syncSearchResults(state) {
  const lastToolMsg = [...state.messages]
    .reverse()
    .find((m) => m._getType?.() === "tool" && m.name === "search_jobs");

  if (!lastToolMsg) return {};

  try {
    const jobs = JSON.parse(lastToolMsg.content);
    return { jobResults: jobs, lastShownJobs: jobs };
  } catch {
    return {}; // e.g. the "no jobs matched" sentence, not JSON — fine, nothing to sync
  }
}
