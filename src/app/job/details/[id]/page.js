import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Button from "@/components/shared/Button";
import StatusBadge from "@/components/shared/StatusBadge";
import { getJobById } from "../../../../../serverAction/queries/jobs";

function Section({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>

      <div className="mt-4 text-sm leading-7 whitespace-pre-wrap text-slate-600">
        {children}
      </div>
    </section>
  );
}

export default async function JobDetailsPage({ params }) {
  const { id } = await params;

  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm text-slate-500">{job.companyName}</p>

              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                {job.title}
              </h1>
            </div>

            <StatusBadge status={job.status} />
          </div>

          <Section title="Job Description">{job.description}</Section>

          <Section title="Requirements">{job.requirements}</Section>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Company</p>

            <p className="mt-2 text-lg font-semibold text-slate-950">
              {job.companyName}
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-slate-500">Status</p>

                <div className="mt-2">
                  <StatusBadge status={job.status} />
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Applicants</p>

                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {job.applicants.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Published</p>

                <p className="mt-2 font-medium text-slate-900">
                  {job.publishedAt
                    ? new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(job.publishedAt))
                    : "Draft"}
                </p>
              </div>
            </div>

            <Button className="mt-8 w-full">Apply Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
