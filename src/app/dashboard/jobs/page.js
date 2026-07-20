import Link from "next/link";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import JobTable from "@/components/dashboard/JobTable";

import { getJobs } from "../../../../serverAction/queries/jobs";

const JobsPage = async () => {
  const jobs = await getJobs();

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

          <Link href="/dashboard/jobs/new" className="inline-flex">
            <Button>Post job</Button>
          </Link>
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

      <JobTable jobs={jobs} />
    </div>
  );
};

export default JobsPage;
