import Link from "next/link";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import JobTable from "@/components/dashboard/JobTable";

import { getJobs } from "../../../../serverAction/queries/jobs";
import Pagination from "@/components/shared/Pagination";

const JobsPage = async ({ searchParams }) => {
  const { page } = await searchParams;
  const getPage = Number(page ?? 1);

  const { jobs, totalPages, currentPage } = await getJobs(getPage);

  return (
    <div className="space-y-8">
      <JobTable jobs={jobs} />

      <Pagination page={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default JobsPage;
