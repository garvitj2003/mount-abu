import Navbar from "@/components/dashboard/Navbar";

export default function AuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#F5F6F7]">
      <Navbar />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
