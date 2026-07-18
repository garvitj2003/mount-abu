"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useVehicleEntryDetail } from "@/hooks/useVehicleEntries";
import { format } from "date-fns";

interface VehicleDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entryId: number | null;
}

const InfoSection = ({ title, children, rightAction }: { title: string; children: React.ReactNode; rightAction?: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-[13px] font-semibold text-[#4B9BC3]">{title}</h3>
      {rightAction}
    </div>
    {children}
  </div>
);

const DetailCard = ({ children, noPadding = false }: { children: React.ReactNode; noPadding?: boolean }) => (
  <div className={`rounded-xl border border-[#D6D9DE] bg-white ${noPadding ? "" : "p-4"} shadow-sm overflow-hidden`}>
    {children}
  </div>
);

const StatusBadge = ({ label, type = "success" }: { label: string; type?: "success" | "danger" }) => (
  <div className={`inline-flex items-center justify-center rounded px-2 py-1 ${type === "success" ? "bg-[#059669]" : "bg-[#EF4444]"}`}>
    <span className="text-[11px] font-bold text-white">{label}</span>
  </div>
);

export default function VehicleDetailDrawer({
  isOpen,
  onClose,
  entryId,
}: VehicleDetailDrawerProps) {
  const { data, isLoading } = useVehicleEntryDetail(entryId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 h-full w-full max-w-[480px] bg-white shadow-2xl font-onest flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">
                Record Detail View ({data?.vehicle_number || "..."})
              </h2>
              <div className="flex items-center gap-4">
                <button className="flex h-8 w-8 items-center justify-center hover:bg-gray-200 rounded-md transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C83FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Image src="/dashboard/icons/close.svg" alt="Close" width={18} height={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-[#343434]/60">Loading record details...</p>
                </div>
              ) : !data ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-[#343434]/60">No record details found.</p>
                </div>
              ) : (
                <>
                  {/* Token Information */}
                  <InfoSection title="Token Information">
                    <DetailCard>
                      <div className="grid grid-cols-2 gap-y-4">
                        <div className="space-y-0.5">
                          <p className="text-[15px] font-semibold text-[#343434]">{data.token_number}</p>
                          <p className="text-[11px] font-medium text-[#343434] opacity-50">Token Number</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="text-[14px] font-medium text-[#343434]">{data.issued_by || "N/A"}</p>
                          <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Issuing Authority</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[14px] font-medium text-[#343434]">{data.application_number}</p>
                          <p className="text-[11px] font-medium text-[#343434] opacity-50">Application Number</p>
                        </div>
                        <div className="text-right">
                          <StatusBadge label="Active" />
                          <p className="mt-1 text-[11px] font-medium text-[#343434] opacity-50 uppercase">Token Status</p>
                        </div>
                        <div className="col-span-2 text-center pt-2">
                          <p className="text-[14px] font-medium text-[#343434]">{data.token_validity || "N/A"}</p>
                          <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Token Validity</p>
                        </div>
                      </div>
                    </DetailCard>
                  </InfoSection>

                  {/* Vehicle Information */}
                  <InfoSection 
                    title="Vehicle Information" 
                    rightAction={
                      <button className="flex items-center gap-1.5 text-xs font-medium text-[#0C83FF] hover:underline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Vehicle Data
                      </button>
                    }
                  >
                    <div className="rounded-xl border border-[#D6D9DE] bg-white overflow-hidden shadow-sm">
                      <div className="relative h-[180px] w-full bg-gray-100">
                        {data.vehicle_image ? (
                          <Image src={data.vehicle_image} alt="Vehicle" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-50 text-xs text-[#343434]/40">No Vehicle Image</div>
                        )}
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-[15px] font-semibold text-[#343434]">{data.vehicle_number}</p>
                          <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Vehicle Number</p>
                        </div>
                        <div className="text-center space-y-0.5">
                          <div className="bg-[#059669] rounded px-2 py-0.5 inline-block">
                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Match</span>
                          </div>
                          <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">OCR Status</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="text-[14px] font-medium text-[#343434]">{data.vehicle_type || "N/A"}</p>
                          <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Vehicle Type</p>
                        </div>
                      </div>
                    </div>
                  </InfoSection>

                  {/* Material Entry Details */}
                  <InfoSection title="Material Entry Details">
                    <DetailCard>
                      <div className="space-y-6">
                        {data.material_entry_details.map((material, idx) => (
                          <div key={idx} className="grid grid-cols-2 gap-y-4 border-b border-[#D6D9DE] pb-4 last:border-0 last:pb-0">
                            <div className="space-y-0.5">
                              <p className="text-[15px] font-semibold text-[#343434]">{material.material_name || material.custom_name || "Unknown Material"}</p>
                              <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Material Name</p>
                            </div>
                            <div className="text-right space-y-0.5">
                              <p className="text-[14px] font-medium text-[#343434]">Construction Material</p>
                              <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Material Category</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[15px] font-semibold text-[#343434]">{(material as any).permitted_material_quantity ?? material.approved_quantity} {material.unit || material.custom_unit || ""}</p>
                              <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Total Permitted Quantity</p>
                            </div>
                            <div className="text-center space-y-0.5">
                              <p className="text-[15px] font-semibold text-[#343434]">{(material as any).quantity ?? material.consumed_quantity} {material.unit || material.custom_unit || ""}</p>
                              <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Quantity Entered</p>
                            </div>
                            <div className="text-right space-y-0.5">
                              <p className="text-[15px] font-semibold text-[#343434]">{(material as any).remaining_material_quantity ?? material.remaining_quantity} {material.unit || material.custom_unit || ""}</p>
                              <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Remaining Quantity</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DetailCard>
                  </InfoSection>

                  {/* Entry Proofs */}
                  <InfoSection title="Entry Proofs">
                    <DetailCard noPadding>
                      <div className="relative h-[180px] w-full bg-gray-100 border-b border-[#D6D9DE]">
                        {(() => {
                          const entryProofUrl = Array.isArray(data.entry_proof) ? data.entry_proof[0] : data.entry_proof;
                          return entryProofUrl ? (
                            <Image src={entryProofUrl} alt="Vehicle Entry Proof" fill className="object-cover" unoptimized />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gray-50 text-xs text-[#343434]/40">No Proof Image</div>
                          );
                        })()}
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="text-center">
                          <p className="text-[16px] font-medium text-[#343434]">{data.latitude && data.longitude ? `${data.latitude}° N, ${data.longitude}° E` : "Location N/A"}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="space-y-0.5">
                            <p className="text-[16px] font-medium text-[#343434]">Naka Point</p>
                            <p className="text-[11px] font-medium text-[#343434] opacity-50">Naka Location</p>
                          </div>
                          <div className="text-right space-y-0.5">
                            <p className="text-[16px] font-medium text-[#343434]">{format(new Date(data.entry_at), "dd MMM yyyy hh:mm a")}</p>
                            <p className="text-[11px] font-medium text-[#343434] opacity-50">Entry Time</p>
                          </div>
                        </div>
                      </div>
                    </DetailCard>
                  </InfoSection>

                  {/* Dumping Photos */}
                  <InfoSection title="Dumping Photos">
                    <div className="grid grid-cols-3 gap-2 pb-6">
                      {data.dumping_photos.map((photo, i) => (
                        <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-[#D6D9DE] bg-gray-100 shadow-sm">
                          <Image src={photo.access_url || ""} alt={`Dumping ${i}`} fill className="object-cover" unoptimized />
                        </div>
                      ))}
                      {data.dumping_photos.length === 0 && (
                        <div className="col-span-3 text-center py-8 bg-[#F5F6F7] rounded-xl border border-dashed border-[#D6D9DE]">
                          <p className="text-sm text-[#343434]/60">No dumping photos added.</p>
                        </div>
                      )}
                    </div>
                  </InfoSection>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button 
                onClick={onClose}
                className="h-[38px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-8 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
