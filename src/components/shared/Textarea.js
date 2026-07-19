import React from "react";
import clsx from "clsx";

export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200",
        className,
      )}
      {...props}
    />
  );
}
