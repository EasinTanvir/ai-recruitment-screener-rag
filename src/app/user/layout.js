"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/user", label: "Overview" },
  { href: "/user/applications", label: "Applications" },
  { href: "/user/setting", label: "Settings" },
];

export default function UserLayout({ children }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-4xl bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Candidate panel
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                Candidate dashboard
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Manage your applications, view progress updates, and adjust your
                profile settings.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 rounded-3xl bg-slate-50 p-4">
              {tabs.map((tab) => {
                const isActive =
                  tab.href === "/user"
                    ? pathname === "/user"
                    : pathname.startsWith(tab.href);

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
