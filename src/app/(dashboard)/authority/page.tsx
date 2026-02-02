"use client";

import { useState } from "react";

export default function DashboardAuthorityPage() {
  const [view, setView] = useState<"empty" | "main">("empty");

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">Dashboard</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            View and track all your applications and complaints at a glance.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-md border border-[#D6D9DE] bg-white">
          <button
            onClick={() => setView("empty")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "empty"
                ? "bg-[#E7F3FF] text-[#0C83FF]"
                : "text-[#343434] hover:bg-gray-50"
            }`}
          >
            Empty Dashboard
          </button>
          <button
            onClick={() => setView("main")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "main"
                ? "bg-[#E7F3FF] text-[#0C83FF]"
                : "text-[#343434] hover:bg-gray-50"
            }`}
          >
            Main Dashboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {view === "empty" ? (
          <div className="flex h-full w-full items-center justify-center">
            {/* Empty State - As per image, it's just blank/grey background, 
                but typically an empty state has a message. 
                Since the image is just blank grey space below header: */}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#6D727A] text-sm">
            Main Dashboard Content Placeholder
          </div>
        )}
      </div>
    </div>
  );
}