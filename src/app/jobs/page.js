import JobsList from "@/components/jobs/JobsList";

import { getJobs } from "../../../serverAction/queries/jobs";
import Pagination from "@/components/shared/Pagination";

export default async function JobsPage({ searchParams }) {
  const { page } = await searchParams;
  const getPage = Number(page ?? 1);

  const { jobs, totalPages, currentPage } = await getJobs(getPage);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <JobsList jobs={jobs} />

        <Pagination page={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}
