import CandidateCard from "@/components/dashboard/CandidateCard";
import { candidates } from "@/data/dummyData";

export default function CandidatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Candidates
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Talent profiles
        </h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}
