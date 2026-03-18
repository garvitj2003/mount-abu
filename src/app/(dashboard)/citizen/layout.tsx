import Navbar from "@/components/dashboard/Navbar";
import SidebarCitizen from "@/components/dashboard/citizen/sidebar-citizen";
import DashboardGuard from "@/components/dashboard/DashboardGuard";

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
            {children}
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
