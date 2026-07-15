import React from "react";
import clsx from "clsx";

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: "bg-slate-900 text-white border-transparent hover:bg-slate-800",
    secondary: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
    ghost:
      "bg-transparent text-slate-700 border-transparent hover:bg-slate-100",
    accent: "bg-sky-500 text-white border-transparent hover:bg-sky-600",
    danger: "bg-rose-500 text-white border-transparent hover:bg-rose-600",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
