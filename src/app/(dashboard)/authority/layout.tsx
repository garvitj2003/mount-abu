import Navbar from "@/components/dashboard/Navbar";
import SidebarAuthority from "@/components/dashboard/authority/sidebar-authority";
import AuthInitializer from "@/components/auth/AuthInitializer";

export default function AuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#F5F6F7]">
      <AuthInitializer />
      <Navbar />
      <div className="flex">
        <SidebarAuthority />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
