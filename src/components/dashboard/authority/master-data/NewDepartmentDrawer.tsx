"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateDepartment, useUpdateDepartment, useJens } from "@/hooks/useMasterData";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";

type DepartmentResponse = components["schemas"]["DepartmentResponse"];

interface NewDepartmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data?: DepartmentResponse | null;
}

export default function NewDepartmentDrawer({
  isOpen,
  onClose,
  data,
}: NewDepartmentDrawerProps) {
  const { mutate: createDept, isPending: isCreating } = useCreateDepartment();
  const { mutate: updateDept, isPending: isUpdating } = useUpdateDepartment();
  const { data: jens } = useJens();
  
  const isPending = isCreating || isUpdating;
  const isEdit = !!data;

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "Municipal",
    status: true,
    jen_id: "" as string | number,
  });

  const [customType, setCustomType] = useState("");
  const [isOtherType, setIsOtherType] = useState(false);

  const TYPE_OPTIONS = [
    { label: "Municipal", value: "Municipal" },
    { label: "Planning", value: "Planning" },
    { label: "Engineering", value: "Engineering" },
    { label: "Regulatory", value: "Regulatory" },
    { label: "Other", value: "Other" },
  ];

  useEffect(() => {
    if (data) {
      const isPredefined = TYPE_OPTIONS.some(opt => opt.value === data.type);
      setFormData({
        name: data.name,
        code: data.code,
        type: isPredefined ? data.type : "Other",
        status: data.status,
        jen_id: data.jen_id || "",
      });
      if (!isPredefined) {
        setCustomType(data.type);
        setIsOtherType(true);
      } else {
        setCustomType("");
        setIsOtherType(false);
      }
    } else {
      setFormData({ name: "", code: "", type: "Municipal", status: true, jen_id: "" });
      setCustomType("");
      setIsOtherType(false);
    }
  }, [data, isOpen]);

  const handleSubmit = () => {
    if (!formData.name || !formData.code) {
      alert("Name and Code are required");
      return;
    }

    const finalType = formData.type === "Other" ? customType : formData.type;
    if (!finalType) {
      alert("Department type is required");
      return;
    }
    
    const payload = {
      ...formData,
      type: finalType,
      jen_id: formData.jen_id === "" ? null : Number(formData.jen_id),
    };

    if (isEdit && data) {
      updateDept({ id: data.id, data: payload }, {
        onSuccess: () => {
          alert("Department updated successfully!");
          onClose();
        },
        onError: (err: any) => {
          alert(err.response?.data?.detail || "Failed to update department");
        }
      });
    } else {
      createDept(payload, {
        onSuccess: () => {
          alert("Department created successfully!");
          onClose();
          setFormData({ name: "", code: "", type: "Municipal", status: true, jen_id: "" });
        },
        onError: (err: any) => {
          alert(err.response?.data?.detail || "Failed to create department");
        }
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/20 backdrop-blur-xs" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative z-10 h-full w-full max-w-[480px] bg-white shadow-2xl font-onest flex flex-col">
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">{isEdit ? "Edit Department" : "Add New Department"}</h2>
              <button onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors">
                <Image src="/dashboard/icons/close.svg" alt="Close" width={18} height={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Department Name</label>
                <input 
                  type="text"
                  placeholder="Town Planning Department"
                  className="w-full h-[38px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Department Code</label>
                <input 
                  type="text"
                  placeholder="TP, ENG"
                  className="w-full h-[38px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Department Type</label>
                  <DropdownSelect
                    options={TYPE_OPTIONS}
                    value={formData.type}
                    onChange={(val) => {
                      setFormData({ ...formData, type: val as string });
                      setIsOtherType(val === "Other");
                    }}
                    placeholder="Select Type"
                    className="w-full h-[38px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Assign to</label>
                  <DropdownSelect
                    options={jens?.map((j) => ({ label: j.name, value: j.id, role: j.role })) || []}
                    value={formData.jen_id}
                    onChange={(val) => setFormData({ ...formData, jen_id: val })}
                    placeholder="Select Official"
                    className="w-full h-[38px]"
                    renderOption={(opt: any) => (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{opt.label}</span>
                        <span className="text-[10px] font-normal opacity-50 uppercase tracking-wider">
                          {opt.role?.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  />
                </div>
              </div>

              {isOtherType && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-sm font-medium text-[#343434]">Specify Department Type</label>
                  <input 
                    type="text"
                    placeholder="Enter custom type"
                    className="w-full h-[38px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                  />
                </motion.div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-xs font-normal text-[#343434] opacity-60">Inactive departments cannot manage applications.</p>
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
                {isPending ? "Submitting..." : isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
