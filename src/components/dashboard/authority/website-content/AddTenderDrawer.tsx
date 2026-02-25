"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { useDepartments } from "@/hooks/useMasterData";

type TenderCreate = components["schemas"]["TenderCreate"];
type TenderStatus = components["schemas"]["TenderStatus"];

interface AddTenderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (tender: TenderCreate, file: File | null) => void;
}

export default function AddTenderDrawer({ isOpen, onClose, onAdd }: AddTenderDrawerProps) {
  const { data: departments = [] } = useDepartments();
  
  const [formData, setFormData] = useState<TenderCreate & { description: string; reference_number: string }>({
    title: "",
    reference_number: "",
    tender_type: "Standard",
    department_id: null,
    amount: null,
    description: "",
    published_on: new Date().toISOString().split('T')[0],
    submission_deadline: "",
    status: "ACTIVE",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const deptOptions = departments.map(d => ({
    label: d.name,
    value: d.id
  }));

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert("Please enter a tender title");
      return;
    }
    onAdd?.(formData, selectedFile);
    onClose();
    // Reset form
    setFormData({
      title: "",
      reference_number: "",
      tender_type: "Standard",
      department_id: null,
      amount: null,
      description: "",
      published_on: new Date().toISOString().split('T')[0],
      submission_deadline: "",
      status: "ACTIVE",
    });
    setSelectedFile(null);
  };

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
                Add New Tender
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image
                  src="/dashboard/icons/close.svg"
                  alt="Close"
                  width={18}
                  height={18}
                />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Tender Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Tender Title</label>
                <input 
                  type="text"
                  placeholder="Construction of Drainage Line at Sunset Point"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Tender ID / Reference Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Tender ID / Reference Number</label>
                <input 
                  type="text"
                  placeholder="MAP/ENG/2025/06"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.reference_number}
                  onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                />
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Department</label>
                <DropdownSelect
                  options={deptOptions}
                  value={formData.department_id}
                  onChange={(val) => setFormData({ ...formData, department_id: val as number })}
                  className="w-full h-[44px]"
                  placeholder="Select Department"
                />
              </div>

              {/* Tender Amount */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Tender Amount</label>
                <input 
                  type="number"
                  placeholder="Amount of tender goes here"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>

              {/* Tender Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Tender Description</label>
                <textarea 
                  placeholder="Detailed scope of work, eligibility criteria..."
                  className="w-full h-[120px] resize-none rounded-lg border border-[#D6D9DE] p-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Tender Document Upload</label>
                <div className="bg-white border-2 border-[#D6D9DE] border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3">
                  <Image src="/dashboard/icons/applications/upload-cloud.svg" alt="Upload" width={36} height={36} className="opacity-60" />
                  <div className="text-center">
                    <p className="text-[13px] font-medium text-[#343434]">Choose a file or drag & drop it here.</p>
                    <p className="text-[11px] text-[#343434] opacity-60 mt-0.5">only PDF format</p>
                  </div>
                  <label className="mt-1 cursor-pointer bg-[#F5F6F7] border border-[#D6D9DE] rounded-lg px-4 py-2 text-xs font-medium text-[#343434] hover:bg-gray-200 transition-colors">
                    Browse File
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf" 
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {selectedFile && (
                    <p className="text-[11px] font-medium text-[#0C83FF] mt-1">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Publish Date</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] pr-10"
                      value={formData.published_on || ""}
                      onChange={(e) => setFormData({ ...formData, published_on: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Deadline</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] pr-10"
                      value={formData.submission_deadline || ""}
                      onChange={(e) => setFormData({ ...formData, submission_deadline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-[11px] text-[#343434] opacity-60">Inactive categories cannot be selected by citizens.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.status === "ACTIVE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "ACTIVE" : "INACTIVE" })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0C83FF]"></div>
                </label>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button 
                onClick={onClose}
                className="h-[44px] rounded-lg border border-[#D6D9DE] bg-white px-6 text-sm font-medium text-[#343434] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleSubmit}
                className="h-[44px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                Add Tender
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
