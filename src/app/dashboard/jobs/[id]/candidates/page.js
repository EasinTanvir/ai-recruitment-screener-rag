import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { getApplicantsByJobId } from "../../../../../../serverAction/queries/applications";
import { getJobById } from "../../../../../../serverAction/queries/jobs";

const STATUS_STYLES = {
  PENDING: "bg-slate-100 text-slate-600",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-purple-100 text-purple-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

function scoreColor(score) {
  if (score == null) return "text-slate-400";
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
}

const CandidatesPage = async ({ params }) => {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const applicants = await getApplicantsByJobId(id);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/dashboard/jobs/${id}`}
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job
        </Link>
        <h1 className="text-2xl font-semibold">Candidates for {job.title}</h1>
        <p className="mt-1 text-slate-500">{applicants.length} applicant(s)</p>
      </div>

      <div className="rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Candidate</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Score</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Applied</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  No applicants yet.
                </td>
              </tr>
            )}

            {applicants.map((applicant) => (
              <tr
                key={applicant.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-5 py-4 font-medium text-slate-900">
                  {applicant.firstName || applicant.lastName
                    ? `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`.trim()
                    : "Unknown"}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {applicant.email ?? "—"}
                  </span>
                </td>
                <td
                  className={`px-5 py-4 font-semibold ${scoreColor(applicant.overallScore)}`}
                >
                  {applicant.overallScore != null
                    ? `${applicant.overallScore}%`
                    : "—"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_STYLES[applicant.status] ??
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {applicant.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {new Date(applicant.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <Link
                    href={`/dashboard/jobs/${id}/candidates/${applicant.id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidatesPage;
