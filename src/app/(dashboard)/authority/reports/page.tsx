export default function AuthorityReportsPage() {
  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">Reports & Analytics</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            Insights and data-driven overview of municipal activities.
          </p>
        </div>
      </div>
      <div className="p-5">
        <div className="rounded-lg border border-[#D6D9DE] bg-white p-8 text-center text-gray-500">
          Reports and analytics module is coming soon.
        </div>
      </div>
    </div>
  );
}
