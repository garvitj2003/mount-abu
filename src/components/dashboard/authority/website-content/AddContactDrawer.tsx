"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateContact } from "@/hooks/useWebsiteContent";

interface AddContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddContactDrawer({ isOpen, onClose }: AddContactDrawerProps) {
  const createContact = useCreateContact();
  const [formData, setFormData] = useState({
    office_department: "",
    contact_person: "",
    designation: "",
    phone_number: "",
    email_address: "",
    status: true,
  });

  const handleSubmit = async () => {
    if (!formData.office_department.trim() || !formData.contact_person.trim()) {
      alert("Please fill in the required fields");
      return;
    }
    
    try {
      await createContact.mutateAsync(formData);
      onClose();
      // Reset form
      setFormData({
        office_department: "",
        contact_person: "",
        designation: "",
        phone_number: "",
        email_address: "",
        status: true,
      });
    } catch (err) {
      console.error("Failed to create contact", err);
      alert("Failed to save contact. Please try again.");
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
                Add New Contact
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
              
              {/* Office / Department Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Office / Department Name</label>
                <input 
                  type="text"
                  placeholder="Engineering Department"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.office_department}
                  onChange={(e) => setFormData({ ...formData, office_department: e.target.value })}
                />
              </div>

              {/* Contact Person Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Contact Person Name</label>
                <input 
                  type="text"
                  placeholder="Shri Ramesh Kumar"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Designation</label>
                <input 
                  type="text"
                  placeholder="Chairman, Nagar Parishad"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Phone Number</label>
                <input 
                  type="text"
                  placeholder="02974-23XXXX or 98XXXXXXXX"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Email Address</label>
                <input 
                  type="email"
                  placeholder="info@mountabu.gov.in"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.email_address}
                  onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
                />
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
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
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
                Save Contact
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
