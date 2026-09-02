"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateVehicleType, useUpdateVehicleType } from "@/hooks/useMasterData";
import { type VehicleTypeResponse } from "@/services/masterDataService";

interface NewVehicleTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data?: VehicleTypeResponse | null;
}

export default function NewVehicleTypeDrawer({
  isOpen,
  onClose,
  data,
}: NewVehicleTypeDrawerProps) {
  const { mutate: createVehicleType, isPending: isCreating } = useCreateVehicleType();
  const { mutate: updateVehicleType, isPending: isUpdating } = useUpdateVehicleType();

  const isPending = isCreating || isUpdating;
  const isEdit = !!data;

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    is_active: true,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        code: data.code,
        is_active: data.is_active,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        is_active: true,
      });
    }
  }, [data, isOpen]);

  const handleNameChange = (name: string) => {
    const updated: any = { name };
    if (!isEdit) {
      // Auto-generate code from name
      updated.code = name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "_")
        .replace(/_+/g, "_")
        .slice(0, 30);
    }
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Vehicle Type Name is required");
      return;
    }
    if (!formData.code.trim()) {
      alert("Vehicle Type Code is required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      is_active: formData.is_active,
    };

    if (isEdit && data) {
      updateVehicleType(
        { id: data.id, data: payload },
        {
          onSuccess: () => {
            alert("Vehicle type updated successfully!");
            onClose();
          },
          onError: (err: any) => {
            alert(err.response?.data?.detail || "Failed to update vehicle type");
          },
        }
      );
    } else {
      createVehicleType(payload, {
        onSuccess: () => {
          alert("Vehicle type created successfully!");
          onClose();
          setFormData({ name: "", code: "", is_active: true });
        },
        onError: (err: any) => {
          alert(err.response?.data?.detail || "Failed to create vehicle type");
        },
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[460px] flex-col bg-white shadow-2xl font-onest"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] px-6 py-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-semibold text-[#343434]">
                  {isEdit ? "Edit Vehicle Type" : "Add Vehicle Type"}
                </h2>
                <p className="text-xs text-[#343434] opacity-70">
                  Manage categories of construction and transit vehicles.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <Image src="/dashboard/icons/applications/close.svg" alt="Close" width={20} height={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {/* Vehicle Type Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#343434]">
                  Vehicle Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pickup (4 Wheeler)"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="rounded-lg border border-[#D6D9DE] px-3.5 py-2.5 text-xs text-[#343434] outline-none focus:border-[#0C83FF]"
                />
              </div>

              {/* Code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#343434]">
                  Unique Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. PICKUP_4W"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="rounded-lg border border-[#D6D9DE] px-3.5 py-2.5 text-xs text-[#343434] outline-none focus:border-[#0C83FF]"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between border-t border-[#D6D9DE] pt-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#343434]">Active Status</span>
                  <span className="text-[11px] text-gray-500">Show in citizen vehicle scheduling dropdown</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    formData.is_active ? "bg-[#0C83FF]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                      formData.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#D6D9DE] p-4 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={onClose}
                className="rounded-lg border border-[#D6D9DE] bg-white px-4 py-2 text-xs font-medium text-[#343434] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-[#0C83FF] px-5 py-2 text-xs font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isPending && <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {isEdit ? "Update Vehicle Type" : "Save Vehicle Type"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
