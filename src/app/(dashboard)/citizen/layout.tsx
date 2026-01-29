import Navbar from "@/components/dashboard/Navbar";
import SidebarCitizen from "@/components/dashboard/citizen/sidebar-citizen";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#F5F6F7]">
      <Navbar />
      <div className="flex">
        <SidebarCitizen />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
