// app/dashboard/jobs/[id]/page.jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, Calendar, Building2 } from "lucide-react";
import { getJobById } from "../../../../../serverAction/queries/jobs";

const STATUS_STYLES = {
  DRAFT: "bg-slate-100 text-slate-600",
  PUBLISHED: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-600",
};

const JobDetailsPage = async ({ params }) => {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/jobs"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold">{job.title}</h1>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  STATUS_STYLES[job.status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {job.status}
              </span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-slate-500">
              <Building2 className="h-4 w-4" />
              {job.companyName}
            </p>
          </div>

          <Link
            href={`/dashboard/jobs/${job.id}/candidates`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Users className="h-4 w-4" />
            View Candidates ({job.applicantCount})
          </Link>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          Published{" "}
          {job.publishedAt
            ? new Date(job.publishedAt).toLocaleDateString()
            : "—"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-6">
          <h2 className="mb-3 text-lg font-semibold">Description</h2>
          <p className="whitespace-pre-line text-slate-600">
            {job.description}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-6">
          <h2 className="mb-3 text-lg font-semibold">Requirements</h2>
          <p className="whitespace-pre-line text-slate-600">
            {job.requirements}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
