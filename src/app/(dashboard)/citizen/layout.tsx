import Navbar from "@/components/dashboard/Navbar";
import SidebarCitizen from "@/components/dashboard/citizen/sidebar-citizen";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import { Suspense } from "react";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="flex h-screen w-full flex-col bg-[#F5F6F7]">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <SidebarCitizen />
          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
              </div>
            }>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
