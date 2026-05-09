"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useWebsiteContent";
import { validateImageAspectRatio } from "@/lib/image-utils";

type EventCreate = components["schemas"]["Body_create_event_api_events_post"];
type EventUpdate = components["schemas"]["Body_update_event_api_events__event_id__put"];
type EventResponse = components["schemas"]["EventResponse"];

interface AddEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data?: EventResponse | null;
}

const EVENT_TYPE_OPTIONS = [
  { label: "Cultural", value: "Cultural" },
  { label: "Sports", value: "Sports" },
  { label: "Religious", value: "Religious" },
  { label: "Official", value: "Official" },
  { label: "Other", value: "Other" },
];

export default function AddEventDrawer({ isOpen, onClose, data }: AddEventDrawerProps) {
  const { mutateAsync: createEvent, isPending: isCreating } = useCreateEvent();
  const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateEvent();
  
  const isPending = isCreating || isUpdating;
  const isEdit = !!data;

  const [formData, setFormData] = useState<EventCreate>({
    title: "",
    event_type: "Cultural",
    date: new Date().toISOString(),
    venue: "",
    description: "",
    status: "ACTIVE",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = await validateImageAspectRatio(file);
      if (!isValid) {
        alert("Please upload an image with a 4:3 aspect ratio.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title,
        event_type: data.event_type || "Cultural",
        date: data.date || new Date().toISOString(),
        venue: data.venue || "",
        description: data.description || "",
        status: data.status,
      });
    } else {
      setFormData({
        title: "",
        event_type: "Cultural",
        date: new Date().toISOString(),
        venue: "",
        description: "",
        status: "ACTIVE",
      });
    }
    setImageFile(null);
  }, [data, isOpen]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Please enter an event title");
      return;
    }
    
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("event_type", formData.event_type || "Cultural");
      payload.append("date", formData.date || "");
      payload.append("venue", formData.venue || "");
      payload.append("description", formData.description || "");
      payload.append("status", formData.status || "ACTIVE");
      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (isEdit && data) {
        await updateEvent({ id: data.id, data: payload });
        alert("Event updated successfully!");
      } else {
        await createEvent(payload);
        alert("Event added successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isEdit ? "update" : "add"} event`);
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
                {isEdit ? "Edit Event" : "Add New Event"}
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
                  placeholder="Mount Abu Summer Festival 2024"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Event Type</label>
                <DropdownSelect
                  options={EVENT_TYPE_OPTIONS}
                  value={formData.event_type || ""}
                  onChange={(val) => setFormData({ ...formData, event_type: val as string })}
                  className="w-full h-[44px]"
                />
              </div>

              {/* Event Date */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Event Date & Time</label>
                <input 
                  type="datetime-local"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF]"
                  value={formData.date ? new Date(new Date(formData.date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>

              {/* Venue */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Venue</label>
                <input 
                  type="text"
                  placeholder="Nakki Lake Ground, Mount Abu"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.venue || ""}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Description</label>
                <textarea 
                  placeholder="Describe the event details..."
                  className="w-full h-[100px] rounded-lg border border-[#D6D9DE] p-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40 resize-none"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#343434]">Event Image</label>
                  {isEdit && data?.image_url && (
                    <a href={data.image_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline">View Current</a>
                  )}
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-[#D6D9DE] bg-[#F5F6F7] p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Image src="/dashboard/icons/attach.svg" alt="attach" width={20} height={20} />
                    <span className="text-sm text-[#343434] opacity-60">
                      {imageFile ? imageFile.name : (isEdit && data?.image_url ? "Change Image" : "Attach Image")}
                    </span>
                  </div>
                  {imageFile && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-[11px] text-[#343434] opacity-60">Inactive events will not be visible.</p>
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
                {isPending ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Event" : "Add Event")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
