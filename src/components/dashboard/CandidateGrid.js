import CandidateCard from "./CandidateCard";

export default function CandidateGrid({ candidates }) {
  if (!candidates?.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No candidates found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Candidates will appear here once they apply for a job.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
