import Link from "next/link";

import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";
import { getCurrentUser } from "@/lib/auth";
import { getUserApplications } from "../../../../serverAction/getUserApplications";

export default async function UserApplicationsPage() {
  const currentUser = await getCurrentUser();

  const applications = await getUserApplications(currentUser.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Applications
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          My Applications
        </h1>

        <p className="mt-2 text-slate-500">
          Track the progress of every job you've applied for.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="py-16 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No applications yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Once you apply for a job, it will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {applications.map((application) => (
            <Card key={application.applicationId} className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {application.companyName}
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    {application.jobTitle}
                  </h3>
                </div>

                <StatusBadge status={application.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs uppercase text-slate-500">Applied On</p>

                  <p className="mt-1 font-medium">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500">AI Score</p>

                  <p className="mt-1 font-medium">
                    {application.overallScore ?? "--"}
                  </p>
                </div>
              </div>

              {/* <Link
                href={`/jobs/${application.jobId}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                View Job
              </Link> */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
