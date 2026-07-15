import React from "react";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";

export default function DashboardGrid({
  metrics,
  recentJobs,
  recentApplications,
  recentActivity,
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <AnalyticsCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Recent Jobs
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                Latest openings
              </h2>
            </div>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{job.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {job.publishedDate}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {job.applicants} applicants
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Recent Applications
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Candidate activity
            </h2>
          </div>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.candidate}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {application.candidate}
                    </p>
                    <p className="text-sm text-slate-500">{application.job}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {application.score}%
                    </p>
                    <p className="text-xs text-slate-500">Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Recent Activity
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Hiring updates
            </h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
