import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";
import { getJobById } from "../../../../../serverAction/queries/jobs";

const JobDetailsPage = async ({ params }) => {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/jobs"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <h1 className="text-3xl font-semibold">{job.title}</h1>

          <p className="mt-2 text-slate-500">{job.companyName}</p>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>

            <div className="whitespace-pre-wrap text-slate-600">
              {job.description}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-xl font-semibold">Requirements</h2>

            <div className="whitespace-pre-wrap text-slate-600">
              {job.requirements}
            </div>
          </Card>
        </div>

        <Card className="h-fit space-y-6">
          <div>
            <p className="text-sm text-slate-500">Company</p>

            <p className="mt-2 font-semibold">{job.companyName}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>

            <div className="mt-2">
              <StatusBadge status={job.status} />
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Published</p>

            <p className="mt-2">
              {job.publishedAt
                ? new Date(job.publishedAt).toLocaleDateString()
                : "Draft"}
            </p>
          </div>

          <Button variant="danger">Delete Job</Button>
        </Card>
      </div>
    </div>
  );
};

export default JobDetailsPage;
