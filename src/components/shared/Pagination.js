// components/shared/Pagination.jsx

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages }) {
  if (totalPages <= 1) return null;

  const searchParams = useSearchParams();

  const createPageLink = (newPage) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", newPage);

    return `?${params.toString()}`;
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <Link
        href={createPageLink(page - 1)}
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
          page === 1 ? "pointer-events-none opacity-40" : "hover:bg-slate-100"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {Array.from({ length: totalPages }).map((_, index) => {
        const current = index + 1;

        return (
          <Link
            key={current}
            href={createPageLink(current)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition ${
              current === page
                ? "bg-slate-900 text-white"
                : "border hover:bg-slate-100"
            }`}
          >
            {current}
          </Link>
        );
      })}

      <Link
        href={createPageLink(page + 1)}
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
          page === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-slate-100"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
