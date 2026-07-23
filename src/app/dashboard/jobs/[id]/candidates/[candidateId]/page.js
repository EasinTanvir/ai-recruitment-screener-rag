import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  FileText,
  RotateCcw,
  Calendar,
  Briefcase,
} from "lucide-react";

import { getApplicantById } from "../../../../../../../serverAction/queries/applications";
import CandidateActions from "@/components/dashboard/CandidateActions";

const scoreColor = (score) => {
  if (score >= 80)
    return {
      text: "text-green-600",
      bg: "bg-green-50",
      label: "Excellent Match",
    };

  if (score >= 60)
    return {
      text: "text-amber-600",
      bg: "bg-amber-50",
      label: "Good Match",
    };

  return {
    text: "text-red-600",
    bg: "bg-red-50",
    label: "Low Match",
  };
};

const ViewCandidate = async ({ params }) => {
  const { id, candidateId } = await params;

  const application = await getApplicantById(candidateId);

  if (!application) notFound();

  const { latestEvaluation } = application;

  const score = latestEvaluation?.overallScore ?? 0;
  const scoreStyle = scoreColor(score);

  return (
    <div className="space-y-8">
      <Link
        href={`/dashboard/jobs/${id}/candidates`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Candidates
      </Link>

      {/* Hero */}
      <div className="rounded-2xl border bg-white p-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          <div className="flex gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white">
              {(application.firstName?.[0] ?? "") +
                (application.lastName?.[0] ?? "")}
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {`${application.firstName ?? ""} ${application.lastName ?? ""}`.trim() ||
                  "Unknown Candidate"}
              </h1>

              <div className="mt-3 space-y-2 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {application.email ?? "No email"}
                </p>

                <p className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {application.jobTitle}
                </p>

                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Applied {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </a>

                <CandidateActions
                  application={application}
                  jobId={id}
                  candidateId={candidateId}
                />
              </div>
            </div>
          </div>

          {latestEvaluation && (
            <div className={`rounded-2xl p-8 text-center ${scoreStyle.bg}`}>
              <p className="text-sm text-slate-500">AI Match Score</p>

              <h2 className={`mt-2 text-5xl font-bold ${scoreStyle.text}`}>
                {latestEvaluation.overallScore}%
              </h2>

              <p className={`mt-2 font-medium ${scoreStyle.text}`}>
                {scoreStyle.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {latestEvaluation ? (
        <>
          {/* Summary + Info */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border p-6 lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold">
                AI Candidate Assessment
              </h2>

              <p className="leading-7 text-slate-600">
                {latestEvaluation.summary}
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Candidate Information
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400">Email</p>
                  <p>{application.email}</p>
                </div>

                <div>
                  <p className="text-slate-400">Status</p>
                  <p>{application.status}</p>
                </div>

                <div>
                  <p className="text-slate-400">Applied</p>
                  <p>{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-slate-400">Evaluations</p>
                  <p>{application.evaluationHistory.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rubrics */}
          <div className="rounded-2xl border p-6">
            <h2 className="mb-6 text-xl font-semibold">Skill Assessment</h2>

            <div className="space-y-6">
              {latestEvaluation.rubrics.map((rubric) => (
                <div key={rubric.rubricName}>
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium">{rubric.rubricName}</span>

                    <span className="font-semibold">{rubric.score}/5</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{
                        width: `${(rubric.score / 5) * 100}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-500">
                    {rubric.scoreDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          {application.evaluationHistory.length > 1 && (
            <div className="rounded-2xl border p-6">
              <h2 className="mb-5 text-lg font-semibold">Evaluation History</h2>

              <div className="space-y-3">
                {application.evaluationHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <span className="text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>

                    <span className="font-semibold">{item.overallScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border p-12 text-center text-slate-400">
          No AI evaluation available.
        </div>
      )}
    </div>
  );
};

export default ViewCandidate;
