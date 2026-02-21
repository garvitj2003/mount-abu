"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface VehicleDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
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
  <div className={`rounded-xl border border-[#D6D9DE] bg-white ${noPadding ? "" : "p-4"} shadow-sm`}>
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
  data,
}: VehicleDetailDrawerProps) {
  if (!data) return null;

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
                Record Detail View ({data.vehicleNumber})
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
              {/* Token Information */}
              <InfoSection title="Token Information">
                <DetailCard>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div className="space-y-0.5">
                      <p className="text-[15px] font-semibold text-[#343434]">{data.tokenNumber}</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50">Token Number</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[14px] font-medium text-[#343434]">Issuing Authority</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Issuing Authority</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[14px] font-medium text-[#343434]">APP-2025-00321</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50">Issuing Authority</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge label="Active" />
                      <p className="mt-1 text-[11px] font-medium text-[#343434] opacity-50 uppercase">Token Status</p>
                    </div>
                    <div className="col-span-2 text-center pt-2">
                      <p className="text-[14px] font-medium text-[#343434]">01 Oct 2025 – 15 Oct 2025</p>
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
                    Download Vehicla Data
                  </button>
                }
              >
                <div className="rounded-xl border border-[#D6D9DE] bg-white overflow-hidden shadow-sm">
                  <div className="relative h-[180px] w-full bg-gray-100">
                    <Image src="/dashboard/images/hero-bg/4.png" alt="Vehicle" fill className="object-cover" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[15px] font-semibold text-[#343434]">{data.vehicleNumber}</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Vehicle Number</p>
                    </div>
                    <div className="text-center space-y-0.5">
                      <div className="bg-[#059669] rounded px-2 py-0.5 inline-block">
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">Match</span>
                      </div>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">OCR Status</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[14px] font-medium text-[#343434]">Goods Carrier</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Vehicle Type</p>
                    </div>
                  </div>
                </div>
              </InfoSection>

              {/* Material Entry Details */}
              <InfoSection title="Material Entry Details">
                <DetailCard>
                  <div className="grid grid-cols-2 gap-y-6">
                    <div className="space-y-0.5">
                      <p className="text-[15px] font-semibold text-[#343434]">{data.materialType}</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Material Name</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[14px] font-medium text-[#343434]">Construction Material</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Material Category</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[15px] font-semibold text-[#343434]">200 Bags</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Total Permitted Quantity</p>
                    </div>
                    <div className="text-center space-y-0.5">
                      <p className="text-[15px] font-semibold text-[#343434]">{data.quantityEntered}</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Quantity Entered</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[15px] font-semibold text-[#343434]">150 Bags</p>
                      <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">Remaining Quantity</p>
                    </div>
                  </div>
                </DetailCard>
              </InfoSection>

              {/* Entry Proofs */}
              <InfoSection title="Entry Proofs">
                <DetailCard noPadding>
                  <div className="flex border-b border-[#D6D9DE] h-[160px]">
                    <div className="flex-1 relative bg-gray-50 border-r border-[#D6D9DE]">
                      {/* GMap Placeholder */}
                      <Image src="/dashboard/images/hero-bg/1.png" alt="Location Map" fill className="object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                           <div className="h-6 w-6 rounded-full bg-red-500 border-2 border-white shadow-md mb-1" />
                           <span className="text-[10px] font-bold text-gray-800 bg-white/80 px-1.5 rounded">Delwara Naka</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 relative bg-gray-100">
                      {/* Vehicle Image Placeholder */}
                      <Image src="/dashboard/images/hero-bg/4.png" alt="Vehicle Entry" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="text-center">
                      <p className="text-[16px] font-medium text-[#343434]">24.5926° N, 72.7156° E</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-[16px] font-medium text-[#343434]">Delwara Naka</p>
                        <p className="text-[11px] font-medium text-[#343434] opacity-50">Naka Location</p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className="text-[16px] font-medium text-[#343434]">05 Oct 2025 10:32 AM</p>
                        <p className="text-[11px] font-medium text-[#343434] opacity-50">Entry Time</p>
                      </div>
                    </div>
                  </div>
                </DetailCard>
              </InfoSection>

              {/* Dumping Photos */}
              <InfoSection title="Dumping Photos">
                <div className="grid grid-cols-3 gap-2 pb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#D6D9DE] bg-gray-100 shadow-sm">
                      <Image src="/dashboard/images/hero-bg/4.png" alt={`Dumping ${i}`} fill className="object-cover" />
                    </div>
                  ))}
                  {/* Empty grid slots to match design if needed */}
                  <div className="aspect-square rounded-xl bg-[#F5F6F7] border border-dashed border-[#D6D9DE]" />
                  <div className="aspect-square rounded-xl bg-[#F5F6F7] border border-dashed border-[#D6D9DE]" />
                </div>
              </InfoSection>
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
