import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-8xl">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <main className="px-6 py-8 lg:px-10 xl:px-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
