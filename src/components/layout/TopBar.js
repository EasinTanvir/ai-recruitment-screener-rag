import { Bell, Search, Sparkles } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="flex flex-col gap-6 border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Recruiter command center
        </h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchBar placeholder="Search dashboard" />
        <Link
          href="/dashboard/jobs/new"
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition hover:bg-slate-800"
        >
          <Sparkles className="h-4 w-4" />
          Create Job
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
