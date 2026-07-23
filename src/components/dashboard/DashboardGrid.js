import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";

export default function DashboardGrid({
  metrics,
  recentJobs,
  recentApplications,
}) {
  return (
    <div className="space-y-8">
      {/* Analytics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <AnalyticsCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Tables */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Jobs */}

        <Card className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-500">Recent Jobs</p>

            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Latest Openings
            </h2>
          </div>

          {recentJobs.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              No jobs found.
            </p>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">
                        {job.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.publishedDate}
                      </p>
                    </div>

                    <StatusBadge status={job.status} />
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {job.applicants} applicant
                    {job.applicants !== 1 && "s"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Applications */}

        <Card className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Recent Applications
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Candidate Activity
            </h2>
          </div>

          {recentApplications.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              No applications found.
            </p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">
                        {application.candidate}
                      </p>

                      <p className="text-sm text-slate-500">
                        {application.job}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {application.score ?? "-"}%
                      </p>

                      <p className="text-xs text-slate-500">AI Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
