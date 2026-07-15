import Link from "next/link";
import { Home, Briefcase, FileText, Users, Mail, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/emails", label: "Emails", icon: Mail },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-slate-200 bg-slate-50 px-6 py-8 xl:flex">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Recruiter HQ
        </p>
        <p className="text-2xl font-semibold tracking-tight text-slate-950">
          AI Recruiter
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-900"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
