import Link from "next/link";
import { Briefcase, Calendar, Mail, Phone, ChevronRight } from "lucide-react";

import StatusBadge from "@/components/shared/StatusBadge";

export default function CandidateCard({ candidate }) {
  const initials = `${candidate.firstName?.[0] || ""}${
    candidate.lastName?.[0] || ""
  }`;

  const fullName = `${candidate.firstName} ${candidate.lastName}`;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      {/* Header */}

      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
            {initials}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">{fullName}</h3>

            <p className="mt-1 text-sm text-slate-500">
              {candidate.latestJobTitle || "No recent application"}
            </p>
          </div>
        </div>

        <StatusBadge status={candidate.status} />
      </div>

      {/* Contact */}

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center gap-3 text-slate-600">
          <Mail size={16} />
          <span className="truncate">{candidate.email}</span>
        </div>

        {candidate.phone && (
          <div className="flex items-center gap-3 text-slate-600">
            <Phone size={16} />
            <span>{candidate.phone}</span>
          </div>
        )}
      </div>

      {/* Stats */}

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Applications
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {candidate.totalApplications}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            AI Score
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {candidate.score ?? "--"}
          </p>
        </div>
      </div>

      {/* Meta */}

      <div className="mt-6 space-y-3 text-sm text-slate-600">
        {candidate.experience && (
          <div className="flex items-center gap-3">
            <Briefcase size={16} />
            <span>{candidate.experience} experience</span>
          </div>
        )}

        {candidate.appliedAt && (
          <div className="flex items-center gap-3">
            <Calendar size={16} />
            <span>{new Date(candidate.appliedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Skills */}

      {candidate.skills?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {candidate.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {skill}
            </span>
          ))}

          {candidate.skills.length > 4 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              +{candidate.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}

      <Link
        href={`/dashboard/candidates/${candidate.id}`}
        className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
      >
        <span>View Candidate</span>

        <ChevronRight size={18} />
      </Link>
    </div>
  );
}
