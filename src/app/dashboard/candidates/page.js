import Link from "next/link";
import { Calendar, ChevronRight, Mail, FileText } from "lucide-react";

import StatusBadge from "@/components/shared/StatusBadge";
import { getCandidatesAction } from "../../../../serverAction/queries/getCandidatesAction";

export default async function CandidatesPage() {
  const result = await getCandidatesAction();

  const applications = result.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Applications
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          All Applications
        </h1>

        <p className="mt-2 text-slate-500">
          Review every application submitted across all jobs.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <FileText className="mx-auto mb-4 h-10 w-10 text-slate-400" />

          <h3 className="text-lg font-semibold text-slate-900">
            No applications found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Applications will appear here once candidates apply.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {applications.map((application) => (
            <Link
              key={application.applicationId}
              href={`/dashboard/candidates/${application.candidateId}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 font-semibold text-white">
                    {`${application.firstName?.[0] ?? ""}${application.lastName?.[0] ?? ""}`}
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {application.firstName} {application.lastName}
                    </h2>

                    <p className="text-sm text-slate-500">
                      Applied for{" "}
                      <span className="font-medium">
                        {application.jobTitle}
                      </span>
                    </p>
                  </div>
                </div>

                <StatusBadge status={application.status} />
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  {application.email}
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4" />
                  {new Date(application.appliedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    AI Score
                  </p>

                  <p className="text-2xl font-bold text-slate-900">
                    {application.overallScore ?? "--"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
