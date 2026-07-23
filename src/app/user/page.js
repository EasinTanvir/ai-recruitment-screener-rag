import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import LogoutButton from "@/components/shared/LogoutButton";
import { getCurrentUser } from "@/lib/auth";
import { getUserDashboardData } from "../../../serverAction/getUserDashboardData";

export default async function UserOverviewPage() {
  const currentUser = await getCurrentUser();

  const summary = await getUserDashboardData(currentUser.id);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Welcome Back
        </p>

        <h1 className="mt-3 text-3xl font-semibold">Hi, {currentUser.name}</h1>

        <p className="mt-3 text-slate-600">
          Track your applications and stay updated on your hiring progress.
        </p>

        <div className="mt-8 flex gap-3">
          <Button>Browse Jobs</Button>
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Total Applications</p>
          <h2 className="mt-3 text-4xl font-bold">
            {summary.totalApplications}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Under Review</p>
          <h2 className="mt-3 text-4xl font-bold">{summary.underReview}</h2>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Interview</p>
          <h2 className="mt-3 text-4xl font-bold">{summary.interview}</h2>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Accepted</p>
          <h2 className="mt-3 text-4xl font-bold">{summary.accepted}</h2>
        </Card>
      </div>
    </div>
  );
}
