import React from "react";
import clsx from "clsx";

const colorMap = {
  Published: "bg-emerald-100 text-emerald-700",
  Live: "bg-sky-100 text-sky-700",
  Draft: "bg-slate-100 text-slate-800",
  Interview: "bg-amber-100 text-amber-700",
  Shortlisted: "bg-violet-100 text-violet-700",
  Review: "bg-slate-100 text-slate-700",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        colorMap[status] || "bg-slate-100 text-slate-700",
        className,
      )}
    >
      {status}
    </span>
  );
}
