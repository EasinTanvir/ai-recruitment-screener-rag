"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export default function JobsList({ jobs }) {
  const [keyword, setKeyword] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(keyword.toLowerCase()),
    );
  }, [jobs, keyword]);

  return (
    <div className="space-y-8">
      {/* Search */}

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          placeholder="Search jobs by title..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-slate-900"
        />
      </div>

      <p className="text-sm text-slate-500">
        {filteredJobs.length} job
        {filteredJobs.length !== 1 && "s"} available
      </p>

      {/* Jobs */}

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredJobs.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              No jobs found
            </h3>

            <p className="mt-2 text-slate-500">Try another keyword.</p>
          </div>
        )}

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="group rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-slate-900 hover:shadow-lg"
          >
            <p className="text-sm font-medium text-slate-500">
              {job.companyName}
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {job.title}
            </h2>

            <p className="mt-4 line-clamp-3 leading-7 text-slate-600">
              {job.description}
            </p>

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
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View Details
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
