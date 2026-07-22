// components/layout/Footer.jsx

import Link from "next/link";
import { Mail, Globe, ExternalLink } from "lucide-react";
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              HireFlow<span className="text-slate-400">.</span>
            </Link>

            <p className="mt-4 max-w-md leading-7 text-slate-600">
              An AI-powered Applicant Tracking System that helps recruiters
              evaluate resumes, rank candidates, and make smarter hiring
              decisions faster.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="mailto:hello@hireflow.com"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
              >
                <Mail className="h-5 w-5" />
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
              >
                <Globe className="h-5 w-5" />
              </Link>

              <Link
                href="/jobs"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Navigation
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 transition hover:text-slate-900"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/jobs"
                  className="text-slate-600 transition hover:text-slate-900"
                >
                  Jobs
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-600 transition hover:text-slate-900"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Features
            </h3>

            <ul className="mt-5 space-y-3 text-slate-600">
              <li>AI Resume Analysis</li>
              <li>Candidate Assessment</li>
              <li>Resume Parsing</li>
              <li>Applicant Tracking</li>
              <li>Smart Candidate Ranking</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
