import DashboardGrid from "@/components/dashboard/DashboardGrid";
import {
  dashboardMetrics,
  recentJobs,
  recentApplications,
  recentActivity,
} from "@/data/dummyData";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl bg-gradient-to-r from-slate-950 to-slate-800 px-8 py-8 text-white shadow-2xl shadow-slate-950/10">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
            Recruiter dashboard
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Monitor hiring workflows with clarity.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Visualize pipeline health, candidate momentum, and role performance
            in a premium hiring workspace.
          </p>
        </div>
      </div>

      <DashboardGrid
        metrics={dashboardMetrics}
        recentJobs={recentJobs}
        recentApplications={recentApplications}
        recentActivity={recentActivity}
      />
    </div>
  );
}
