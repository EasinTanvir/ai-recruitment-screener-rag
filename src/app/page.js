import Link from "next/link";

import Card from "@/components/shared/Card";
import { getJobs } from "../../serverAction/queries/jobs";

export default async function HomePage() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="group flex flex-col">
                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {job.companyName}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {job.title}
                  </h3>

                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
                    {job.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {job.publishedAt
                      ? new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(job.publishedAt))
                      : "Draft"}
                  </p>

                  <Link
                    href={`/job/details/${job.id}`}
                    className="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Apply Now
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
