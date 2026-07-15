import Link from "next/link";
import { jobs, filterOptions } from "@/data/dummyData";
import { Search, Filter, MapPin, DollarSign } from "lucide-react";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              AI Recruiter System
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Discover top recruiting roles in a premium hiring experience.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Explore featured jobs, filter hiring priorities, and get inspired
              by modern recruiting workflows.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  Open roles
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {jobs.length}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  Recruiter focus
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  Intelligent workflows
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Discover roles
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-950">
                  Search curated job listings.
                </p>
              </div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Search className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-8 space-y-5">
              <Input placeholder="Search job title, company, location" />
              <div className="grid gap-3 sm:grid-cols-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className="inline-flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-white"
                  >
                    <span>{filter.label}</span>
                    <Filter className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Featured jobs
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                Open roles for modern recruiting teams
              </h2>
            </div>
            <Button variant="accent">Post a job</Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {job.company}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-950">
                      {job.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {job.shortDescription}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {job.employmentType}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> {job.salary}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-slate-500">{job.postedDate}</p>
                  <Link
                    href={`/job/details/${job.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Apply
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
