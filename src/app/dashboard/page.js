import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { getDashboardData } from "../../../serverAction/queries/getDashboardData";

export default async function DashboardPage() {
  const { metrics, recentJobs, recentApplications } = await getDashboardData();

  return (
    <div className="space-y-8">
      <DashboardGrid
        metrics={metrics}
        recentJobs={recentJobs}
        recentApplications={recentApplications}
      />
    </div>
  );
}
