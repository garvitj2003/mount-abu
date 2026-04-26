"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import VehicleFilterDrawer from "@/components/dashboard/authority/vehicle-entries/VehicleFilterDrawer";
import VehicleDetailDrawer from "@/components/dashboard/authority/vehicle-entries/VehicleDetailDrawer";
import TokenActionModal from "@/components/dashboard/authority/tokens/TokenActionModal";
import { useTokenDetail } from "@/hooks/useTokens";
import { type components } from "@/types/api";
import { QRCodeSVG } from "qrcode.react";

type TokenDetailResponse = components["schemas"]["TokenDetailResponse"];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    ACTIVE: "bg-[#059669]",
    COMPLETED: "bg-gray-500",
    TERMINATED: "bg-red-500",
    WITHHELD: "bg-orange-500",
    PENDING: "bg-blue-500",
  };

  return (
    <div className={`flex items-center gap-1.5 rounded ${styles[status] || "bg-gray-500"} px-2 py-1 text-white`}>
      <div className="relative size-3.5">
        <Image src="/dashboard/icons/tick-round-green.svg" alt="" fill className="invert brightness-0" />
      </div>
      <span className="text-[12px] font-medium leading-none capitalize">{status.toLowerCase()}</span>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[10px] font-normal text-[#343434] opacity-60 uppercase">{label}</p>
    <p className="text-[12px] font-normal text-[#343434] leading-tight">{value || "—"}</p>
  </div>
);

const Header = ({ 
  token, 
  onBack,
  onHold,
  onTerminate
}: { 
  token: TokenDetailResponse; 
  onBack: () => void;
  onHold: () => void;
  onTerminate: () => void;
}) => {
  const dateRange = token.valid_from && token.valid_till 
    ? `${new Date(token.valid_from).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} - ${new Date(token.valid_till).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
    : "—";

  return (
    <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.13)]">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
          <Image src="/dashboard/icons/applications/arrow-back.svg" alt="Back" width={24} height={24} />
        </button>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-medium text-[#343434]">{token.token_number}</h1>
            <StatusBadge status={token.status} />
          </div>
          <p className="text-[12px] font-normal text-[#343434] opacity-80">{dateRange}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onHold}
          className="flex items-center gap-2.5 rounded-lg border border-[#FFD648] bg-[#FFD648] px-4 py-2.5 text-sm font-medium text-[#343434] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Image src="/dashboard/icons/timer-round.svg" alt="" width={16} height={16} />
          Hold Token
        </button>
        <button 
          onClick={onTerminate}
          className="flex items-center gap-2.5 rounded-lg border border-[#EF4444] bg-[#EF4444] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Image src="/dashboard/icons/close.svg" alt="" width={16} height={16} className="invert brightness-0" />
          Terminate Token
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ token }: { token: TokenDetailResponse }) => (
  <div className="flex w-[238px] flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white p-4 h-fit sticky top-[80px]">
    {/* QR Code */}
    <div className="relative aspect-square w-full rounded border border-[#D6D9DE] p-4 bg-white flex items-center justify-center">
      <QRCodeSVG 
        value={token.transport_code} 
        size={180}
        level="H"
        includeMargin={false}
      />
    </div>

    <div className="flex flex-col gap-4">
      <DetailItem label="Application Number" value={token.application_number} />
      <DetailItem label="Applicant Name" value={token.applicant_name} />
      <DetailItem label="Property Address" value={token.property_address} />
      
      <div className="flex gap-4">
        <DetailItem label="Property Usage" value={token.property_usage} />
        <DetailItem label="Type of Work" value={token.application_type} />
      </div>

      <div className="h-px w-full bg-[#D6D9DE] my-1" />
      
      <p className="text-[12px] font-medium text-[#498AA9]">Authority & System Information</p>
      
      <DetailItem label="Issued By" value={token.authority.issued_by} />
      <DetailItem label="Issued On" value={token.authority.issued_on ? new Date(token.authority.issued_on).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"} />
      <DetailItem label="Token Generated From" value={token.authority.token_generated_from} />
    </div>
  </div>
);

const TableRow = ({ 
  entry, onClick 
}: { 
  entry: components["schemas"]["VehicleEntryResponse"]; 
  onClick: () => void 
}) => (
  <tr className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
    <td className="p-3 text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-2">
        {entry.vehicle_number}
      </div>
    </td>
    <td className="p-3 text-sm font-normal text-[#343434]">
      {entry.material_name || "—"}
    </td>
    <td className="p-3 text-sm font-normal text-[#343434]">—</td>
    <td className="p-3 text-sm font-normal text-[#343434]">
      {entry.quantity_entered} {entry.material_unit}
    </td>
    <td className="p-3 text-sm font-normal text-[#343434] opacity-70">
      {new Date(entry.entry_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </td>
  </tr>
);

export default function TokenDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const transportCode = params.id as string;
  const [activeTab, setActiveTab] = useState<"Vehicle Entries" | "Material Summary">("Vehicle Entries");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  
  const { data: token, isLoading, error } = useTokenDetail(transportCode);

  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: "HOLD" | "TERMINATE" }>({
    isOpen: false,
    type: "HOLD",
  });

  const handleEntryClick = (id: number) => {
    setSelectedEntryId(id);
    setIsDetailDrawerOpen(true);
  };

  const handleTokenAction = (remarks: string) => {
    console.log(`Action: ${modalConfig.type}, Reason: ${remarks}`);
    alert(`Token ${modalConfig.type === "HOLD" ? "held" : "terminated"} successfully.`);
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  if (isLoading) return (
    <div className="flex h-full w-full items-center justify-center bg-[#F5F6F7]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
    </div>
  );

  if (error || !token) return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#F5F6F7]">
      <p className="text-lg font-medium text-[#EF4444]">Error loading token details.</p>
      <button onClick={() => router.back()} className="rounded-lg bg-white border border-[#D6D9DE] px-4 py-2 text-sm">Go Back</button>
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative overflow-y-auto">
      <Header 
        token={token} 
        onBack={() => router.back()} 
        onHold={() => setModalConfig({ isOpen: true, type: "HOLD" })}
        onTerminate={() => setModalConfig({ isOpen: true, type: "TERMINATE" })}
      />

      <div className="flex flex-1 gap-5 p-5">
        <Sidebar token={token} />

        <div className="flex flex-1 flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white overflow-hidden">
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

          <div className="flex flex-col gap-4 p-5">
            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] outline-none placeholder:text-[#343434]/60 focus:ring-0" 
                />
              </div>
              
              <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-3 py-2 text-sm font-medium text-[#343434] cursor-pointer"
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
                      {["Vehicle Number", "Material Type", "Naaka Incharge", "Quantity Entered", "Entry Date & Time"].map((h) => (
                        <th key={h} className="p-3 text-left">
                          <span className="text-[11px] font-semibold uppercase text-[#333333] opacity-70">{h}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {token.vehicle_entries
                      .filter(entry => 
                        !search || 
                        entry.vehicle_number?.toLowerCase().includes(search.toLowerCase()) ||
                        entry.material_name?.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((entry, idx) => (
                        <TableRow 
                          key={idx}
                          entry={entry}
                          onClick={() => handleEntryClick(entry.id)}
                        />
                      ))}
                    {token.vehicle_entries.length === 0 && (
                      <tr><td colSpan={5} className="p-10 text-center text-sm opacity-50 italic">No vehicle entries recorded yet.</td></tr>
                    )}
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
                    {token.materials.map((m, i) => (
                      <tr key={i} className="border-b border-[#D6D9DE]">
                        <td className="p-3 text-sm font-medium text-[#343434]">{m.material_name} ({m.unit})</td>
                        <td className="p-3 text-sm text-[#343434]">{m.approved_quantity}</td>
                        <td className="p-3 text-sm text-[#343434]">{m.consumed_quantity}</td>
                        <td className="p-3 text-sm font-semibold text-[#059669]">{m.remaining_quantity}</td>
                      </tr>
                    ))}
                    {token.materials.length === 0 && (
                      <tr><td colSpan={4} className="p-10 text-center text-sm opacity-50 italic">No material data available.</td></tr>
                    )}
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
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedEntryId(null);
        }}
        entryId={selectedEntryId}
      />

      <TokenActionModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleTokenAction}
      />
    </div>
  );
}
