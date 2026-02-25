"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { useDepartments } from "@/hooks/useMasterData";
import { useCreateTender } from "@/hooks/useWebsiteContent";

type TenderCreate = components["schemas"]["TenderCreate"];
type TenderStatus = components["schemas"]["TenderStatus"];

interface AddTenderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TENDER_TYPE_OPTIONS = [
  { label: "Standard", value: "Standard" },
  { label: "Limited", value: "Limited" },
  { label: "Expression of Interest", value: "Limited" },
];

export default function AddTenderDrawer({ isOpen, onClose }: AddTenderDrawerProps) {
  const { data: departments = [] } = useDepartments();
  const { mutateAsync: createTender, isPending } = useCreateTender();
  
  const [formData, setFormData] = useState<TenderCreate>({
    title: "",
    tender_type: "Standard",
    department_id: null,
    amount: null,
    published_on: new Date().toISOString(),
    submission_deadline: null,
    status: "ACTIVE",
  });

  const deptOptions = departments.map(d => ({
    label: d.name,
    value: d.id
  }));

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a tender title");
      return;
    }
    
    try {
      await createTender(formData);
      onClose();
      // Reset form
      setFormData({
        title: "",
        tender_type: "Standard",
        department_id: null,
        amount: null,
        published_on: new Date().toISOString(),
        submission_deadline: null,
        status: "ACTIVE",
      });
      alert("Tender added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add tender");
    }
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

              {/* Tender Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Tender Type</label>
                <DropdownSelect
                  options={TENDER_TYPE_OPTIONS}
                  value={formData.tender_type || ""}
                  onChange={(val) => setFormData({ ...formData, tender_type: val as string })}
                  className="w-full h-[44px]"
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

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Publish Date</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] pr-10"
                      value={formData.published_on?.split('T')[0] || ""}
                      onChange={(e) => setFormData({ ...formData, published_on: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Deadline</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] pr-10"
                      value={formData.submission_deadline?.split('T')[0] || ""}
                      onChange={(e) => setFormData({ ...formData, submission_deadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-[11px] text-[#343434] opacity-60">Inactive tenders will not be visible.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.status === "ACTIVE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "ACTIVE" : "CLOSED" })}
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
                disabled={isPending}
                className="h-[44px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add Tender"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
