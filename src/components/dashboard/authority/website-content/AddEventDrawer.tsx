"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";

type EventCreate = components["schemas"]["EventCreate"];
type TenderStatus = components["schemas"]["TenderStatus"]; // Reusing status enum

interface AddEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (event: EventCreate, file: File | null) => void;
}

export default function AddEventDrawer({ isOpen, onClose, onAdd }: AddEventDrawerProps) {
  const [formData, setFormData] = useState<EventCreate & { description: string }>({
    title: "",
    event_type: "Public Program",
    description: "",
    venue: "",
    date: new Date().toISOString().split('T')[0],
    status: "ACTIVE",
  });

  const [eventTime, setEventTime] = useState("08:00");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert("Please enter an event title");
      return;
    }
    
    // Combine date and time for backend if necessary, or send as is
    onAdd?.(formData, selectedFile);
    onClose();
    
    // Reset form
    setFormData({
      title: "",
      event_type: "Public Program",
      description: "",
      venue: "",
      date: new Date().toISOString().split('T')[0],
      status: "ACTIVE",
    });
    setEventTime("08:00");
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
                Add New Event
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
              
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Event Title</label>
                <input 
                  type="text"
                  placeholder="Public Awareness Program on Water Conservation"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Event Type</label>
                <div className="relative">
                  <select 
                    className="w-full h-[44px] appearance-none rounded-lg border border-[#D6D9DE] bg-white px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF]"
                    value={formData.event_type || ""}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  >
                    <option value="Public Program">Public Program</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Awareness">Awareness</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Event Description</label>
                <textarea 
                  placeholder="Detailed description of the event, objectives"
                  className="w-full h-[120px] resize-none rounded-lg border border-[#D6D9DE] p-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Venue */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Venue</label>
                <input 
                  type="text"
                  placeholder="Municipal Town Hall, Nakki Lake"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.venue || ""}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>

              {/* Attach Poster */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Attach Poster</label>
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
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {selectedFile && (
                    <p className="text-[11px] font-medium text-[#0C83FF] mt-1">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Event Date</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF]"
                      value={formData.date?.split('T')[0] || ""}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Event Time</label>
                  <div className="relative">
                    <input 
                      type="time"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF]"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#343434]">Status</label>
                <div className="flex flex-col gap-3">
                  {["ACTIVE", "COMPLETED", "CANCELLED"].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="status" 
                        className="hidden"
                        checked={formData.status === s}
                        onChange={() => setFormData({ ...formData, status: s as TenderStatus })}
                      />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.status === s ? "border-[#0C83FF]" : "border-[#D6D9DE]"}`}>
                        {formData.status === s && <div className="w-2.5 h-2.5 rounded-full bg-[#0C83FF]" />}
                      </div>
                      <span className="text-[13px] text-[#343434] font-normal capitalize">{s.toLowerCase()}</span>
                    </label>
                  ))}
                </div>
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
                Add Event
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
