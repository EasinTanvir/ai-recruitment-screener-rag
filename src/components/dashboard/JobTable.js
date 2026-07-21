"use client";

import StatusBadge from "@/components/shared/StatusBadge";
import Table from "./Table";

const columns = [
  {
    key: "title",
    label: "Title",
    render: (job) => (
      <div>
        <p className="font-semibold text-slate-950">{job.title}</p>
        <p className="text-sm text-slate-500">{job.companyName}</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (job) => <StatusBadge status={job.status} />,
  },
  {
    key: "applications",
    label: "Applicants",
    render: (job) => job.applicantCount ?? 0,
  },
  {
    key: "publishedAt",
    label: "Published",
    render: (job) =>
      job.publishedAt
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(job.publishedAt))
        : "-",
  },
];

export default function JobTable({ jobs }) {
  return (
    <Table
      columns={columns}
      data={jobs}
      rowLink={(job) => `/dashboard/jobs/${job.id}`}
    />
  );
}
