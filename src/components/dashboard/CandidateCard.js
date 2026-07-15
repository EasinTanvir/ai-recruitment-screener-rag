import React from "react";
import StatusBadge from "@/components/shared/StatusBadge";
import Button from "@/components/shared/Button";

export default function CandidateCard({ candidate }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-lg font-semibold text-slate-900">
            {candidate.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950">
              {candidate.name}
            </h3>
            <p className="text-sm text-slate-500">{candidate.role}</p>
          </div>
        </div>
        <StatusBadge status={candidate.score > 85 ? "Shortlisted" : "Review"} />
      </div>

      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <p>
          {candidate.experience} experience · {candidate.applications}{" "}
          applications
        </p>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <Button variant="secondary" className="mt-6 w-full">
        View profile
      </Button>
    </div>
  );
}
