import React from "react";
import Card from "@/components/shared/Card";

export default function AnalyticsCard({ title, value, note, color }) {
  return (
    <Card className="rounded-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div
          className={`inline-flex rounded-3xl px-4 py-3 text-sm font-semibold ${color}`}
        >
          {title.split(" ")[0]}
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{note}</p>
    </Card>
  );
}
