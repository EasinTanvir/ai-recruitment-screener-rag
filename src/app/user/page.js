import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import LogoutButton from "@/components/shared/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export default async function UserOverviewPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-4xl bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Welcome back
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">
            Hi, Jamie — your application hub is ready.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Check the status of recent submissions, review recommended roles,
            and continue your career journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button>View applications</Button>
            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Active applications
            </p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">4</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Applications currently in review or interview stages.
            </p>
          </Card>
          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Saved roles
            </p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">12</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Jobs you’ve bookmarked for future follow-up.
            </p>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Application health
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                Strong
              </p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              92% match score
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-700">Resume overview</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your profile is in great shape for recruiter review across
                product and growth roles.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-700">Interview prep</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add work samples and tailor your application to stand out on the
                next stage.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
