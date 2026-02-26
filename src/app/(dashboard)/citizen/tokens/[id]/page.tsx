"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useApplication } from "@/hooks/useApplications";
import VehicleFilterDrawer from "@/components/dashboard/authority/vehicle-entries/VehicleFilterDrawer";
import VehicleDetailDrawer from "@/components/dashboard/authority/vehicle-entries/VehicleDetailDrawer";

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => (
  <div className="flex items-center gap-1.5 rounded bg-[#059669] px-2 py-1 text-white">
    <div className="relative size-3.5">
      <Image src="/dashboard/icons/tick-round-green.svg" alt="" fill className="invert brightness-0" />
    </div>
    <span className="text-[12px] font-medium leading-none">{status}</span>
  </div>
);

const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[10px] font-normal text-[#343434] opacity-60 uppercase">{label}</p>
    <p className="text-[12px] font-normal text-[#343434] leading-tight">{value || "—"}</p>
  </div>
);

const Header = ({ 
  id, 
  onBack,
  validity
}: { 
  id: string; 
  onBack: () => void;
  validity?: string;
}) => (
  <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.13)]">
    <div className="flex items-center gap-2">
      <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
        <Image src="/dashboard/icons/applications/arrow-back.svg" alt="Back" width={24} height={24} />
      </button>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-medium text-[#343434]">{id}</h1>
          <StatusBadge status="Active" />
        </div>
        <p className="text-[12px] font-normal text-[#343434] opacity-80">{validity || "01 Oct 2025 - 15 Oct 2025"}</p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2.5 rounded-lg border border-[#498AA9] bg-[#E9F1F5] px-4 py-2.5 text-sm font-medium text-[#247297] hover:opacity-90 transition-opacity cursor-pointer">
        <Image src="/dashboard/icons/applications/step-upload.svg" alt="" width={18} height={18} />
        Share
      </button>
      <button className="flex items-center gap-2.5 rounded-lg border border-[#72B7FF] bg-[#E7F3FF] px-4 py-2.5 text-sm font-medium text-[#0C83FF] hover:opacity-90 transition-opacity cursor-pointer">
        <Image src="/dashboard/icons/applications/download.svg" alt="" width={16} height={16} />
        Download Token
      </button>
    </div>
  </div>
);

const Sidebar = ({ app }: { app: any }) => (
  <div className="flex w-[238px] flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white p-4 h-fit sticky top-[80px]">
    {/* QR Code Placeholder */}
    <div className="relative aspect-square w-full rounded border border-[#D6D9DE] p-2 bg-white">
      <Image src="/sample/application-main.png" alt="QR Code" fill unoptimized className="object-contain p-2" />
    </div>

    <div className="flex flex-col gap-4">
      <DetailItem label="Application Number" value={`APP-${app?.id.toString().padStart(5, '0')}`} />
      <DetailItem label="Applicant Name" value={app?.applicant_name} />
      <DetailItem label="Property Address" value={app?.property_address} />
      
      <div className="flex gap-4">
        <DetailItem label="Property Usage" value={app?.property_usage} />
        <DetailItem label="Type of Work" value={app?.type} />
      </div>

      <div className="h-px w-full bg-[#D6D9DE] my-1" />
      
      <p className="text-[12px] font-medium text-[#498AA9]">Authority & System Information</p>
      
      <DetailItem label="Issued By" value="Nodal Officer (Ward 3)" />
      <DetailItem label="Issued On" value="01 Oct 2025" />
      <DetailItem label="Token Generated From" value="Approved Application" />
    </div>
  </div>
);

const TableRow = ({ 
  vehicle, material, qty, time, remaining, onClick 
}: { 
  vehicle: string; material: string; qty: string; time: string; remaining: string; onClick: () => void 
}) => (
  <tr className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
    <td className="p-3 text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer" onClick={onClick}>
      {vehicle}
    </td>
    <td className="p-3 text-sm font-normal text-[#343434]">{material}</td>
    <td className="p-3 text-sm font-normal text-[#343434]">{qty}</td>
    <td className="p-3 text-sm font-normal text-[#343434] opacity-70">{time}</td>
    <td className="p-3 text-sm font-normal text-[#343434]">{remaining}</td>
  </tr>
);

export default function CitizenTokenDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Vehicle Entries" | "Material Summary">("Vehicle Entries");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  
  // For now using application hook to get context, ideally there would be a token hook
  const { data: app } = useApplication(1); // Placeholder ID

  const handleEntryClick = (entry: any) => {
    setSelectedEntry(entry);
    setIsDetailDrawerOpen(true);
  };

  const MOCK_ENTRIES = [
    { vehicleNumber: "RJ24 AB 4587", materialType: "Cement", quantityEntered: "50 Bags", entryDate: "05 Oct 2025, 10:32 AM", match: true, remaining: "150 Bags" },
    { vehicleNumber: "RJ24 CD 9214", materialType: "Cement", quantityEntered: "40 Bags", entryDate: "06 Oct 2025, 09:15 AM", match: true, remaining: "110 Bags" },
    { vehicleNumber: "RJ38 EF 6671", materialType: "Sand", quantityEntered: "3 Ton", entryDate: "06 Oct 2025, 02:05 PM", match: false, remaining: "7 Ton" },
    { vehicleNumber: "RJ24 GH 1123", materialType: "Steel Rods", quantityEntered: "1.5 Ton", entryDate: "07 Oct 2025, 11:40 AM", match: true, remaining: "0 Ton" },
    { vehicleNumber: "RJ38 JK 9901", materialType: "Bricks", quantityEntered: "2,000 Units", entryDate: "07 Oct 2025, 04:10 PM", match: true, remaining: "3,000 Units" },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative overflow-y-auto">
      <Header 
        id="TKN-2025-014" 
        onBack={() => router.back()} 
      />

      <div className="flex flex-1 gap-5 p-5">
        <Sidebar app={app} />

        <div className="flex flex-1 flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white overflow-hidden h-fit">
          {/* Tabs */}
          <div className="flex items-center border-b border-[#D6D9DE] bg-white px-5 shadow-sm">
            {["Vehicle Entries", "Material Summary"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative px-4 py-4 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab ? "text-[#0C83FF]" : "text-[#343434] opacity-60 hover:opacity-100"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-t-lg bg-[#0C83FF]" />
                )}
              </button>
            ))}
          </div>

          {/* Warning Banner */}
          <div className="flex items-center gap-2 bg-[#FFD648] px-5 py-2">
            <Image src="/dashboard/icons/warning.svg" alt="" width={16} height={16} />
            <p className="text-[10px] font-medium text-[#343434]">
              Warning: Without uploading the required geo-tagged dumping photo, the next vehicle entry will be disabled.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-5">
            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="text" placeholder="Search" className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] outline-none placeholder:text-[#343434]/60 focus:ring-0" />
              </div>
              
              <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-3 py-2 text-sm font-medium text-[#343434] cursor-pointer hover:bg-gray-100"
              >
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="" width={14} height={14} className="rotate-90 opacity-60" />
                Filter
              </button>
            </div>

            {/* Content based on Tab */}
            {activeTab === "Vehicle Entries" ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#D6D9DE] bg-gray-50/50">
                      {["Vehicle Number", "Material Type", "Quantity Entered", "Entry Date & Time", "Remaining Quantity"].map((h) => (
                        <th key={h} className="p-3 text-left">
                          <span className="text-[11px] font-semibold uppercase text-[#333333] opacity-70">{h}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ENTRIES.map((entry, idx) => (
                      <TableRow 
                        key={idx}
                        vehicle={entry.vehicleNumber}
                        material={entry.materialType}
                        qty={entry.quantityEntered}
                        time={entry.entryDate}
                        remaining={entry.remaining}
                        onClick={() => handleEntryClick(entry)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#D6D9DE] bg-gray-50/50">
                      {["Material Name", "Permitted Quantity", "Consumed Quantity", "Remaining Quantity"].map((h) => (
                        <th key={h} className="p-3 text-left">
                          <span className="text-[11px] font-semibold uppercase text-[#333333] opacity-70">{h}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Cement", permitted: "500 Bags", consumed: "90 Bags", remaining: "410 Bags" },
                      { name: "Sand", permitted: "10 Ton", consumed: "3 Ton", remaining: "7 Ton" },
                      { name: "Steel Rods", permitted: "5 Ton", consumed: "1.5 Ton", remaining: "3.5 Ton" },
                    ].map((m, i) => (
                      <tr key={i} className="border-b border-[#D6D9DE]">
                        <td className="p-3 text-sm font-medium text-[#343434]">{m.name}</td>
                        <td className="p-3 text-sm text-[#343434]">{m.permitted}</td>
                        <td className="p-3 text-sm text-[#343434]">{m.consumed}</td>
                        <td className="p-3 text-sm font-semibold text-[#059669]">{m.remaining}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <VehicleFilterDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      />

      <VehicleDetailDrawer 
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        data={selectedEntry}
      />
    </div>
  );
}
