"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./shared/LogoutButton";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Jobs",
    href: "/jobs",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Login",
    href: "/login",
  },
];

const Navbar = async ({ isAuthenticated }) => {
  const pathname = usePathname();
  const navItems = isAuthenticated
    ? links.filter((item) => item.href !== "/login")
    : links.filter((item) => item.href !== "/dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          HireFlow<span className="text-slate-400">.</span>
        </Link>

        <div className="flex items-center ">
          <nav className="flex items-center gap-2">
            {navItems.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          {isAuthenticated && <LogoutButton />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
