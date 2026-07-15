import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { auth } from "@clerk/nextjs/server";
export default async function DashboardRouteLayout({ children }) {
  await auth.protect();
  return <DashboardLayout>{children}</DashboardLayout>;
}
