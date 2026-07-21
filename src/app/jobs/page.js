import JobsList from "@/components/jobs/JobsList";
import { getJobs } from "../../../serverAction/queries/jobs";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <JobsList jobs={jobs} />
      </div>
    </main>
  );
}
