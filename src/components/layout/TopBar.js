import { Bell, Search, Sparkles } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className=" w-full flex   justify-end gap-6 border-b border-slate-200  px-6 py-5 backdrop-blur-xl ">
      <Link
        href="/dashboard/jobs/new"
        type="button"
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition hover:bg-slate-800"
      >
        <Sparkles className="h-4 w-4" />
        Create Jobs
      </Link>
    </div>
  );
}
