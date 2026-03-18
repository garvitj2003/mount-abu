"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { useDepartments } from "@/hooks/useMasterData";
import { useCreateDownload } from "@/hooks/useWebsiteContent";

type DownloadStatus = components["schemas"]["DownloadStatus"];

interface AddDownloadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOCUMENT_TYPE_OPTIONS = [
  { label: "Application Form", value: "Application Form" },
  { label: "Guidelines", value: "Guidelines" },
  { label: "Notice", value: "Notice" },
  { label: "Circular", value: "Circular" },
  { label: "Report", value: "Report" },
];

export default function AddDownloadDrawer({ isOpen, onClose }: AddDownloadDrawerProps) {
  const { data: departments = [] } = useDepartments();
  const { mutateAsync: createDownload, isPending } = useCreateDownload();
  
  const [formData, setFormData] = useState({
    document_title: "",
    document_type: "Application Form",
    department_id: null as number | null,
    status: "ACTIVE" as DownloadStatus,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const deptOptions = departments.map(d => ({
    label: d.name,
    value: d.id
  }));

  const handleSubmit = async () => {
    if (!formData.document_title.trim()) {
      alert("Please enter a document title");
      return;
    }
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
    
    const body = new FormData();
    body.append("document_title", formData.document_title);
    body.append("document_type", formData.document_type);
    if (formData.department_id) body.append("department_id", formData.department_id.toString());
    body.append("status", formData.status);
    body.append("file", selectedFile);

    try {
      await createDownload(body);
      onClose();
      // Reset form
      setFormData({
        document_title: "",
        document_type: "Application Form",
        department_id: null,
        status: "ACTIVE",
      });
      setSelectedFile(null);
      alert("Document published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish document");
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
                Add New Document
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
              
              {/* Document Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Document Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Building Permission Guidelines"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.document_title}
                  onChange={(e) => setFormData({ ...formData, document_title: e.target.value })}
                />
              </div>

              {/* Document Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Document Type</label>
                <DropdownSelect
                  options={DOCUMENT_TYPE_OPTIONS}
                  value={formData.document_type}
                  onChange={(val) => setFormData({ ...formData, document_type: val as string })}
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
                  placeholder="Departments list"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">File Upload</label>
                <div className="bg-white border-2 border-[#D6D9DE] border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3">
                  <Image src="/dashboard/icons/applications/upload-cloud.svg" alt="Upload" width={36} height={36} className="opacity-60" />
                  <div className="text-center">
                    <p className="text-[13px] font-medium text-[#343434]">Choose a file or drag & drop it here.</p>
                    <p className="text-[11px] text-[#343434] opacity-60 mt-0.5">JPG / PNG / PDF / DOC / Excel format</p>
                  </div>
                  <label className="mt-1 cursor-pointer bg-[#F5F6F7] border border-[#D6D9DE] rounded-lg px-4 py-2 text-xs font-medium text-[#343434] hover:bg-gray-200 transition-colors">
                    Browse File
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {selectedFile && (
                    <p className="text-[11px] font-medium text-[#0C83FF] mt-1">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-[11px] text-[#343434] opacity-60">Inactive documents will not be available for download.</p>
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
                disabled={isPending}
                className="h-[44px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isPending ? "Publishing..." : "Publish Document"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
