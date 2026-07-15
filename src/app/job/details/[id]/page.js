import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, DollarSign } from "lucide-react";
import { jobs } from "@/data/dummyData";
import Button from "@/components/shared/Button";
import StatusBadge from "@/components/shared/StatusBadge";

function Section({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
        {children}
      </div>
    </section>
  );
}

export default function JobDetailsPage({ params }) {
  const job = jobs.find((item) => item.id === params.id) || jobs[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6 rounded-4xl bg-white p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">{job.company}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <MapPin className="h-4 w-4" /> {job.location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <Briefcase className="h-4 w-4" /> {job.employmentType}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <DollarSign className="h-4 w-4" /> {job.salary}
                </span>
              </div>
            </div>
            <StatusBadge status={job.status} />
          </div>

          <div className="space-y-6">
            <Section title="Role description">
              <p>{job.description}</p>
            </Section>

            <Section title="Responsibilities">
              <ul className="list-disc space-y-2 pl-5">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Requirements">
              <ul className="list-disc space-y-2 pl-5">
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Benefits">
              <ul className="list-disc space-y-2 pl-5">
                {job.benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-3">
              <p className="text-sm text-slate-500">Hiring overview</p>
              <p className="text-2xl font-semibold text-slate-950">
                {job.applicants} applicants
              </p>
              <p className="text-sm text-slate-500">
                Published {job.publishedDate}
              </p>
            </div>
            <Button className="mt-6 w-full">Apply now</Button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Tags
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
