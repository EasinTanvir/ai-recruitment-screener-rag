export async function aggregateScores(state) {
  const scoreByJobId = new Map(state.jobScores.map((s) => [s.jobId, s]));

  const merged = state.candidateJobs
    .map((job) => {
      const s = scoreByJobId.get(job.id);
      return {
        id: job.id,
        title: job.title,
        companyName: job.companyName,
        matchScore: s?.score ?? null,
        matchReason: s?.reason ?? null,
      };
    })
    .sort((a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1));

  return {
    jobResults: merged,
    lastShownJobs: merged,
    // clear scratch space so the next CV upload starts clean
    // (jobScores uses a concat reducer, so it needs the null-reset signal;
    // candidateJobs/job have no custom reducer so [] / null overwrite fine)
    candidateJobs: [],
    jobScores: null,
    job: null,
  };
}
