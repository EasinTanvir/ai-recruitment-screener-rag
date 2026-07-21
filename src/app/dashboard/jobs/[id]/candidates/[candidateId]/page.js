// app/dashboard/jobs/[id]/candidates/[candidateId]/page.jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, FileText, RotateCcw } from "lucide-react";
import {
  getApplicantById,
  getApplicantsByJobId,
} from "../../../../../../../serverAction/queries/applications";

const ViewCandidate = async ({ params }) => {
  const { id, candidateId } = await params;
  console.log({ id, candidateId });
  const application = await getApplicantsByJobId(candidateId);

  if (!application) notFound();

  const { latestEvaluation } = application;

  return (
    <div className="space-y-8">
      <Link
        href={`/dashboard/jobs/${id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applicants
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {`${application.firstName ?? ""} ${application.lastName ?? ""}`.trim() ||
              "Unknown Candidate"}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-slate-500">
            <Mail className="h-4 w-4" />
            {application.email ?? "No email extracted"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Applied for {application.jobTitle} ·{" "}
            {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          >
            <FileText className="h-4 w-4" />
            View Resume
          </a>
          <form
            action={`/dashboard/jobs/${id}/candidates/${candidateId}/reevaluate`}
            method="POST"
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Re-evaluate
            </button>
          </form>
        </div>
      </div>

      {latestEvaluation ? (
        <>
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI Evaluation</h2>
              <span className="text-3xl font-bold text-slate-900">
                {latestEvaluation.overallScore}%
              </span>
            </div>
            <p className="mt-3 text-slate-600">{latestEvaluation.summary}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {latestEvaluation.rubrics.map((rubric) => (
              <div
                key={rubric.rubricName}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{rubric.rubricName}</h3>
                  <span className="text-sm font-semibold text-slate-700">
                    {rubric.score}/5
                  </span>
                </div>
                {rubric.scoreDescription && (
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-500">
                    {rubric.scoreDescription}
                  </p>
                )}
              </div>
            ))}
          </div>

          {application.evaluationHistory.length > 1 && (
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-3 text-sm font-medium text-slate-500">
                Evaluation History
              </h3>
              <ul className="space-y-1 text-sm">
                {application.evaluationHistory.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex justify-between text-slate-500"
                  >
                    <span>{new Date(ev.createdAt).toLocaleString()}</span>
                    <span className="font-medium">{ev.overallScore}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-slate-200 p-6 text-center text-slate-400">
          No evaluation available.
        </div>
      )}
    </div>
  );
};

export default ViewCandidate;
