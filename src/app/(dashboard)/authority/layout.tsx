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
      <div className="min-h-screen w-full bg-[#F5F6F7]">
        <Navbar />
        <div className="flex">
          <SidebarAuthority />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
