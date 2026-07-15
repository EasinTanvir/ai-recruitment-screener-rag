import React from "react";
import clsx from "clsx";

export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-3xl bg-white p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.25)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
