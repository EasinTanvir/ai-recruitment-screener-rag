import React from "react";
import StatusBadge from "@/components/shared/StatusBadge";
import Button from "@/components/shared/Button";

export default function JobCard({ job }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={job.status} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {job.employmentType}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {job.company} · {job.location}
            </p>
          </div>
        </div>
        <Button variant="secondary" className="whitespace-nowrap">
          View details
        </Button>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        {job.shortDescription}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{job.salary}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>{job.postedDate}</span>
      </div>
    </div>
  );
}
