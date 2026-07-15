import React from "react";
import clsx from "clsx";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200",
        className,
      )}
      {...props}
    />
  );
}
