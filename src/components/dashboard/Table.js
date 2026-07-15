"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Table({ columns, data, rowLink }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 font-semibold text-slate-500"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const href = rowLink?.(row);

            return (
              <tr
                key={row.id ?? index}
                className={`transition ${
                  href ? "cursor-pointer hover:bg-slate-50" : ""
                } ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                onClick={(event) => {
                  if (!href) return;
                  const tag = event.target.tagName;
                  if (
                    ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT"].includes(tag)
                  ) {
                    return;
                  }
                  router.push(href);
                }}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
