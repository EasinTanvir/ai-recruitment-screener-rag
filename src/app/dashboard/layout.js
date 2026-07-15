import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardRouteLayout({ children }) {
  await auth.protect();
  const { sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role !== "admin") {
    redirect("/");
  }

  console.log("sessionClaims", sessionClaims);
  return <DashboardLayout>{children}</DashboardLayout>;
}
