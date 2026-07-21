import Link from "next/link";
import { getJobById } from "../../../../../../serverAction/queries/jobs";
import { getJobCandidates } from "../../../../../../serverAction/queries/getJobCandidates";

const AllCandidates = async ({ params }) => {
  const { id } = await params;

  const job = await getJobById(id);

  const candidates = await getJobCandidates(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{job.title}</h1>

        <p className="text-sm text-muted-foreground">
          {candidates.length} Candidates
        </p>
      </div>

      <div className="space-y-3">
        {candidates.map((candidate) => (
          <Link
            key={candidate.applicationId}
            href={`/dashboard/jobs/${id}/candidates/${candidate.applicationId}`}
            className="flex items-center justify-between rounded-xl border p-5 transition hover:bg-muted/50"
          >
            <div>
              <h2 className="font-semibold">
                {candidate.firstName} {candidate.lastName}
              </h2>

              <p className="text-sm text-muted-foreground">{candidate.email}</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">AI Score</p>
                <p className="text-lg font-bold">
                  {candidate.overallScore ?? "--"}%
                </p>
              </div>

              <div className="rounded-full border px-3 py-1 text-sm">
                {candidate.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCandidates;
