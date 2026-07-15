"use client";

import Table from "@/components/dashboard/Table";
import { applications } from "@/data/dummyData";
import StatusBadge from "@/components/shared/StatusBadge";

const columns = [
  { key: "candidate", label: "Candidate" },
  { key: "email", label: "Email" },
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
  { key: "appliedDate", label: "Last applied" },
];

export default function ApplicationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Applications
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Pipeline activity
        </h1>
      </div>

      <Table
        columns={columns}
        data={applications}
        rowLink={(item) => `/dashboard/applications/${item.id}`}
      />
    </div>
  );
}
