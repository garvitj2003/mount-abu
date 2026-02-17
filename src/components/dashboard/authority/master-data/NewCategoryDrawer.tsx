"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateComplaintCategory } from "@/hooks/useMasterData";

interface NewCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewCategoryDrawer({
  isOpen,
  onClose,
}: NewCategoryDrawerProps) {
  const { mutate: createCategory, isPending } = useCreateComplaintCategory();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
  });

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Name is required");
      return;
    }
    createCategory(formData, {
      onSuccess: () => {
        alert("Category created successfully!");
        onClose();
        setFormData({ name: "", description: "", status: true });
      },
      onError: (err: any) => {
        alert(err.response?.data?.detail || "Failed to create category");
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/20 backdrop-blur-xs" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative z-10 h-full w-full max-w-[480px] bg-white shadow-2xl font-onest flex flex-col">
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">Add New Category</h2>
              <button onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors">
                <Image src="/dashboard/icons/close.svg" alt="Close" width={18} height={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Complaint Category Name</label>
                <input 
                  type="text"
                  placeholder="Illegal Construction"
                  className="w-full h-[38px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Category Description</label>
                <textarea 
                  placeholder="Brief description of the complaint category"
                  className="w-full h-[100px] rounded-lg border border-[#D6D9DE] p-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] resize-none placeholder:opacity-40"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-xs font-normal text-[#343434] opacity-60">Inactive categories cannot be selected by citizens.</p>
                </div>
                <label className="relative flex cursor-pointer items-center">
                  <input type="checkbox" className="peer hidden" checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} />
                  <div className="h-5 w-5 flex items-center justify-center transition-opacity">
                    {formData.status ? <Image src="/dashboard/icons/select-tick.svg" alt="checked" width={20} height={20} /> : <div className="h-5 w-5 rounded border border-[#D6D9DE] bg-white" />}
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white mt-auto">
              <button onClick={onClose} className="h-[38px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors">Close</button>
              <button onClick={handleSubmit} disabled={isPending} className="h-[38px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50">
                {isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
