import Navbar from "@/components/dashboard/Navbar";
import SidebarAuthority from "@/components/dashboard/authority/sidebar-authority";
import DashboardGuard from "@/components/dashboard/DashboardGuard";

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
            {children}
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
