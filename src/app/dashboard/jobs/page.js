import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Table from "@/components/dashboard/Table";
import StatusBadge from "@/components/shared/StatusBadge";
import { jobs } from "@/data/dummyData";

const columns = [
  {
    key: "title",
    label: "Title",
    render: (job) => (
      <div className="font-semibold text-slate-950">{job.title}</div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (job) => <StatusBadge status={job.status} />,
  },
  { key: "applicants", label: "Applicants" },
  { key: "publishedDate", label: "Published" },
  {
    key: "actions",
    label: "Actions",
    render: () => <Button variant="ghost">Manage</Button>,
  },
];

export default function JobsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Jobs
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Open roles library
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="secondary">Filter</Button>
          <Button>Post job</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <p className="text-sm text-slate-500">
              Search and refine your roles by hiring status.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              placeholder="Search roles"
            />
            <Button variant="secondary">Export</Button>
          </div>
        </div>
      </Card>

      <Table columns={columns} data={jobs} />
    </div>
  );
}
