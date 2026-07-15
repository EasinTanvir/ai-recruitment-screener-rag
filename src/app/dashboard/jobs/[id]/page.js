import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";
import Table from "@/components/dashboard/Table";
import { jobs, jobApplications } from "@/data/dummyData";

export default function JobApplicationsPage({ params }) {
  const job = jobs.find((item) => item.id === params.id) || jobs[0];
  const applications = jobApplications
    .filter((item) => item.jobId === params.id)
    .sort((a, b) => b.score - a.score);

  const columns = [
    {
      key: "candidate",
      label: "Candidate",
      render: (item) => (
        <div className="font-semibold text-slate-950">{item.candidate}</div>
      ),
    },
    {
      key: "score",
      label: "Score",
      render: (item) => (
        <span className="font-semibold text-slate-900">{item.score}%</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: "appliedDate", label: "Applied" },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex flex-wrap gap-2">
          <Button variant="accent">Accept & notify</Button>
          <Button variant="ghost">Reject</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to jobs
            </Link>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Job overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              {job.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {job.company} · {job.location} · {job.employmentType}
            </p>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <Card className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Candidates applied</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {applications.length}
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Top score</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {applications[0]?.score ?? "—"}%
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Recent applied</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {applications[0]?.appliedDate ?? "—"}
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Candidates
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Applications sorted by score
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Action buttons do not submit; they show recruiter controls.
          </p>
        </div>
        <Table columns={columns} data={applications} />
      </div>
    </div>
  );
}
