"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { useCreateDownload, useUpdateDownload } from "@/hooks/useWebsiteContent";

type DownloadUpdate = components["schemas"]["DownloadUpdate"];
type DownloadResponse = components["schemas"]["DownloadResponse"];

interface AddDownloadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data?: DownloadResponse | null;
}

const DOCUMENT_TYPE_OPTIONS = [
  { label: "Application Forms", value: "Application Forms" },
  { label: "Reports", value: "Reports" },
  { label: "Manuals", value: "Manuals" },
  { label: "Other", value: "Other" },
];

export default function AddDownloadDrawer({ isOpen, onClose, data }: AddDownloadDrawerProps) {
  const { mutateAsync: createDownload, isPending: isCreating } = useCreateDownload();
  const { mutateAsync: updateDownload, isPending: isUpdating } = useUpdateDownload();
  
  const isPending = isCreating || isUpdating;
  const isEdit = !!data;

  const [formData, setFormData] = useState({
    document_title: "",
    document_type: "Application Forms",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (data) {
      setFormData({
        document_title: data.document_title,
        document_type: data.document_type || "Application Forms",
        description: data.description || "",
        status: data.status,
      });
      setFile(null);
    } else {
      setFormData({
        document_title: "",
        document_type: "Application Forms",
        description: "",
        status: "ACTIVE",
      });
      setFile(null);
    }
  }, [data, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.document_title.trim()) {
      alert("Please enter a document title");
      return;
    }
    
    try {
      if (isEdit && data) {
        const updateData: DownloadUpdate = {
          document_title: formData.document_title,
          document_type: formData.document_type,
          description: formData.description,
          status: formData.status,
        };
        await updateDownload({ id: data.id, data: updateData });
        alert("Download updated successfully!");
      } else {
        if (!file) {
          alert("Please select a file to upload");
          return;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("document_title", formData.document_title);
        fd.append("document_type", formData.document_type);
        fd.append("description", formData.description);
        fd.append("status", formData.status);
        
        await createDownload(fd);
        alert("Download added successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isEdit ? "update" : "add"} download`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 h-full w-full max-w-[480px] bg-white shadow-2xl font-onest flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">
                {isEdit ? "Edit Download" : "Add New Download"}
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

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Document Title</label>
                <input 
                  type="text"
                  placeholder="Marriage Certificate Form"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.document_title}
                  onChange={(e) => setFormData({ ...formData, document_title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Document Type</label>
                <DropdownSelect
                  options={DOCUMENT_TYPE_OPTIONS}
                  value={formData.document_type || ""}
                  onChange={(val) => setFormData({ ...formData, document_type: val as string })}
                  className="w-full h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Description</label>
                <textarea 
                  placeholder="Brief description of the document"
                  className="w-full h-[100px] rounded-lg border border-[#D6D9DE] p-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] resize-none placeholder:opacity-40"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {!isEdit && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Select File</label>
                  <div className="relative">
                    <input 
                      type="file"
                      className="w-full h-[44px] opacity-0 absolute inset-0 z-10 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <div className="w-full h-[44px] rounded-lg border border-dashed border-[#D6D9DE] px-3 flex items-center justify-between text-sm text-[#343434]">
                      <span className="opacity-60">{file ? file.name : "Click to upload file (PDF, Doc, Image)"}</span>
                      <Image src="/dashboard/icons/applications/file-icon.svg" alt="file" width={16} height={16} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-[11px] text-[#343434] opacity-60">Inactive downloads will not be visible.</p>
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
                {isPending ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Download" : "Add Download")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
