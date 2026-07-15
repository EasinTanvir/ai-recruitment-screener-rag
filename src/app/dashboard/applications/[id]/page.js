import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";
import { applications } from "@/data/dummyData";

export default function ApplicationDetails({ params }) {
  const application =
    applications.find((item) => item.id === params.id) || applications[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Link
              href="/dashboard/applications"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to applications
            </Link>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Applicant overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              {application.candidate}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{application.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={application.status} />
          <Button variant="danger">Block applicant</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm text-slate-500">Current role</p>
          <p className="mt-3 text-xl font-semibold text-slate-950">
            {application.job}
          </p>
        </Card>
        <Card className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm text-slate-500">Score</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">
            {application.score}%
          </p>
        </Card>
        <Card className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm text-slate-500">Last applied</p>
          <p className="mt-3 text-xl font-semibold text-slate-950">
            {application.appliedDate}
          </p>
        </Card>
      </div>

      <Card className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Jobs applied
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Candidate history
          </h2>
        </div>
        <div className="space-y-4">
          {application.appliedJobs.map((job) => (
            <div
              key={job.title}
              className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-950">{job.title}</p>
                <p className="mt-1 text-sm text-slate-500">{job.status}</p>
              </div>
              <StatusBadge
                status={
                  job.status === "Interview"
                    ? "Interview"
                    : job.status === "Shortlisted"
                      ? "Shortlisted"
                      : "Review"
                }
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
