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
      <DashboardGrid
        metrics={dashboardMetrics}
        recentJobs={recentJobs}
        recentApplications={recentApplications}
        recentActivity={recentActivity}
      />
    </div>
  );
}
