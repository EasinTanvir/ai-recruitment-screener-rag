import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Brain,
  FileSearch,
  BadgeCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="mx-auto flex  max-w-7xl items-center px-6 py-5 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            <Sparkles className="h-4 w-4" />
            AI Powered Applicant Tracking System
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-slate-950 md:text-6xl">
            Hire better candidates with intelligent resume screening.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Upload resumes, analyze candidates with AI, compare applicants, and
            make faster hiring decisions from one clean dashboard.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Browse Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-200 px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Recruiter Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-3 lg:px-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <Brain className="h-10 w-10 text-slate-900" />

            <h3 className="mt-6 text-xl font-semibold">AI Resume Analysis</h3>

            <p className="mt-3 leading-7 text-slate-600">
              Automatically evaluate resumes and identify the strongest
              candidates using structured AI assessment.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <FileSearch className="h-10 w-10 text-slate-900" />

            <h3 className="mt-6 text-xl font-semibold">
              Smart Candidate Review
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Review extracted candidate information, AI summaries, rubric
              scores, and resume insights in one place.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <BadgeCheck className="h-10 w-10 text-slate-900" />

            <h3 className="mt-6 text-xl font-semibold">Faster Hiring</h3>

            <p className="mt-3 leading-7 text-slate-600">
              Reduce manual screening and focus on interviewing the candidates
              that best match your requirements.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="rounded-[32px] bg-slate-900 px-10 py-16 text-center text-white">
          <h2 className="text-4xl font-bold">
            Ready to explore opportunities?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-300">
            Browse open positions, upload your resume, and let AI help match
            your skills with the right job.
          </p>

          <Link
            href="/jobs"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Explore Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
