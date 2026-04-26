"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateMaterial } from "@/hooks/useMasterData";
import { type components } from "@/types/api";

type MaterialResponse = components["schemas"]["MaterialResponse"];

interface NewMaterialDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data?: MaterialResponse | null;
}

const UNITS = ["Bags", "Tons", "Cubic Meters", "Units", "Kilograms", "Liters"];

export default function NewMaterialDrawer({
  isOpen,
  onClose,
  data,
}: NewMaterialDrawerProps) {
  const { mutate: createMaterial, isPending } = useCreateMaterial();
  
  const isEdit = !!data;

  const [formData, setFormData] = useState({
    name: "",
    unit: "Bags",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        unit: data.unit,
      });
    } else {
      setFormData({ name: "", unit: "Bags" });
    }
  }, [data, isOpen]);

  const handleSubmit = () => {
    if (isEdit) {
      alert("Material editing is not supported yet.");
      return;
    }

    if (!formData.name) {
      alert("Material Name is required");
      return;
    }
    createMaterial(formData, {
      onSuccess: () => {
        alert("Material created successfully!");
        onClose();
        setFormData({ name: "", unit: "Bags" });
      },
      onError: (err: any) => {
        alert(err.response?.data?.detail || "Failed to create material");
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
              <h2 className="text-[15px] font-medium text-[#343434]">{isEdit ? "Edit Material" : "Add New Material"}</h2>
              <button onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors">
                <Image src="/dashboard/icons/close.svg" alt="Close" width={18} height={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Material Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Portland Cement"
                  className="w-full h-[38px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isEdit}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Unit of Measure</label>
                <div className="relative">
                  <select 
                    className="w-full h-[38px] appearance-none rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] bg-white disabled:bg-gray-50"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    disabled={isEdit}
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} />
                  </div>
                </div>
              </div>
              {isEdit && <p className="text-xs text-amber-600">Note: Materials cannot be edited once created in the current version.</p>}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white mt-auto">
              <button onClick={onClose} className="h-[38px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors">Close</button>
              {!isEdit && (
                <button onClick={handleSubmit} disabled={isPending} className="h-[38px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50">
                  {isPending ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
