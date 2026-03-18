"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "@/hooks/useUser";
import { useWards, useComplaintCategories } from "@/hooks/useMasterData";
import { useMyComplaints } from "@/hooks/useComplaints";
import { ComplaintService } from "@/services/complaintService";
import { complaintSchema, type ComplaintFormData } from "@/lib/validations/complaint";
import { useQueryClient } from "@tanstack/react-query";

interface NewComplaintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewComplaintDrawer({
  isOpen,
  onClose,
}: NewComplaintDrawerProps) {
  const { data: user } = useUser();
  const { data: wards = [] } = useWards();
  const { data: categories = [] } = useComplaintCategories();
  const { data: pastComplaintsData } = useMyComplaints({ limit: 100 });
  const queryClient = useQueryClient();

  const pastComplaints = pastComplaintsData?.items || [];

  const [formData, setFormData] = useState<Partial<ComplaintFormData>>({
    applicant_name: "",
    applicant_mobile: "",
    location_address: "",
    description: "",
    title: "", // We'll auto-generate or map this if not explicitly in UI
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Sync user data when it loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        applicant_name: user.name || "",
        applicant_mobile: user.mobile || "",
      }));
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErrors({});
    
    // Auto-fill title if empty for schema validation
    const submissionData = {
      ...formData,
      title: formData.title || `Complaint: ${categories.find(c => c.id === formData.category_id)?.name || "General"}`,
    };

    const validation = complaintSchema.safeParse(submissionData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) newErrors[key] = messages[0];
      });
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      
      // Step 1: Create the complaint record first to get an ID
      const complaint = await ComplaintService.createComplaint(validation.data as any);
      
      // Step 2: Upload all photos directly through the backend proxy
      if (files.length > 0) {
        for (const file of files) {
          try {
            await ComplaintService.uploadMedia(complaint.id, file);
          } catch (uploadErr) {
            console.error(`Failed to upload ${file.name}`, uploadErr);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      alert("Complaint submitted successfully!");
      onClose();
      // Reset form
      setFormData({
        applicant_name: user?.name || "",
        applicant_mobile: user?.mobile || "",
        location_address: "",
        description: "",
        title: "",
      });
      setFiles([]);
    } catch (error) {
      console.error("Failed to submit complaint", error);
      const detail = (error as any)?.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      alert(`Failed to submit complaint: ${message || "Please try again."}`);
    } finally {
      setSubmitting(false);
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
                Add New Complain
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
              {/* Name & Contact */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Name</label>
                  <input 
                    type="text"
                    placeholder="Enter your name"
                    className={`w-full h-[38px] rounded-lg border ${errors.applicant_name ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40`}
                    value={formData.applicant_name}
                    onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Contact Number</label>
                  <div className="flex h-[38px] w-full items-center rounded-lg border border-[#D6D9DE] bg-[#F0F0F0] px-3 text-sm text-[#343434]">
                    +91-{formData.applicant_mobile || "—"}
                  </div>
                </div>
              </div>

              {/* Choose Category */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Choose Category</label>
                <div className="relative">
                  <select 
                    className={`w-full h-[38px] appearance-none rounded-lg border ${errors.category_id ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] bg-white`}
                    value={formData.category_id || ""}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} />
                  </div>
                </div>
              </div>

              {/* Refer to Past Complain */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Refer to Past Complain</label>
                <div className="relative">
                  <select 
                    className="w-full h-[38px] appearance-none rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] bg-white"
                  >
                    {pastComplaints.length > 0 ? (
                      <>
                        <option value="">Select Category</option>
                        {Array.from(new Set(pastComplaints.map(c => c.category_id)))
                          .map(catId => {
                            const category = categories.find(cat => cat.id === catId);
                            return <option key={catId} value={catId || 0}>{category?.name || "Unknown Category"}</option>;
                          })
                        }
                      </>
                    ) : (
                      <option value="">No past complaints</option>
                    )}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} />
                  </div>
                </div>
              </div>

              {/* Write detailed complain */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Write detailed complain</label>
                <textarea 
                  placeholder="Enter complete details of your complaint"
                  className={`w-full h-[100px] rounded-lg border ${errors.description ? "border-red-500" : "border-[#D6D9DE]"} p-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] resize-none placeholder:opacity-40`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Upload Photo */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Upload Photo</label>
                <div className="flex h-[140px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#D6D9DE] bg-white p-4">
                  <Image src="/dashboard/icons/applications/upload-cloud.svg" alt="upload" width={40} height={40} />
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-normal text-black text-center leading-tight">Choose a file or drag & drop it here.</p>
                    <p className="text-xs font-normal text-black opacity-60">JPEG, PNG formats.</p>
                  </div>
                  <label className="mt-1 flex cursor-pointer items-center justify-center rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-1.5 text-xs font-normal text-[#343434] hover:bg-gray-200 transition-colors">
                    Browse File
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                  </label>
                </div>
                {/* File Previews */}
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {files.map((file, index) => (
                      <div key={index} className="relative h-12 w-12 overflow-hidden rounded border border-[#D6D9DE]">
                        <Image src={URL.createObjectURL(file)} alt="Preview" fill className="object-cover" />
                        <button onClick={() => removeFile(index)} className="absolute right-0 top-0 bg-red-500 p-0.5 rounded-bl">
                          <Image src="/dashboard/icons/close.svg" alt="remove" width={8} height={8} className="invert brightness-0" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ward No. */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Ward No.</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select 
                      className={`w-full h-[38px] appearance-none rounded-lg border ${errors.ward_id ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] bg-white`}
                      value={formData.ward_id || ""}
                      onChange={(e) => setFormData({ ...formData, ward_id: Number(e.target.value) })}
                    >
                      <option value="">Ward List Goes Here</option>
                      {wards.map(ward => <option key={ward.id} value={ward.id}>{ward.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} />
                    </div>
                  </div>
                  <button className="h-[38px] whitespace-nowrap rounded-lg border border-[#0C83FF] bg-[#E7F3FF] px-4 text-xs font-medium text-[#0C83FF] hover:bg-[#D6E9FF] transition-colors">
                    Know Your Ward
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5 pb-4">
                <label className="text-sm font-medium text-[#343434]">Location</label>
                <input 
                  type="text"
                  placeholder="Enter location"
                  className={`w-full h-[38px] rounded-lg border ${errors.location_address ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40`}
                  value={formData.location_address}
                  onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button 
                onClick={onClose}
                className="h-[38px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="h-[38px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
