import Navbar from "@/components/dashboard/Navbar";
import SidebarAuthority from "@/components/dashboard/authority/sidebar-authority";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import { Suspense } from "react";

export default function AuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="flex h-screen w-full flex-col bg-[#F5F6F7]">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <SidebarAuthority />
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
