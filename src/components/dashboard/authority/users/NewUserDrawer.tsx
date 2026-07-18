"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateUser, useUpdateUser } from "@/hooks/useUser";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";

type CreateUserRequest = components["schemas"]["CreateUserRequest"];
type UpdateUserRequest = components["schemas"]["UpdateUserRequest"];
type UserResponse = components["schemas"]["UserResponse"];
type UserRole = components["schemas"]["UserRole"];

interface NewUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponse | null;
}

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "Super Admin", value: "SUPERADMIN" },
  { label: "Nodal Officer", value: "NODAL_OFFICER" },
  { label: "Commissioner", value: "COMMISSIONER" },
  { label: "Naka Incharge", value: "NAKA_INCHARGE" },
  { label: "Land Dept", value: "DEPT_LAND" },
  { label: "Legal Dept", value: "DEPT_LEGAL" },
  { label: "ATP Dept", value: "DEPT_ATP" },
  { label: "Junior Engineer", value: "JEN" },
  { label: "Assistant Engineer", value: "AEN" },
  { label: "Revenue Inspector", value: "RIN" },
  { label: "Sanitation Inspector", value: "SIN" },
  { label: "Collector", value: "COLLECTOR" },
];

export default function NewUserDrawer({ isOpen, onClose, user }: NewUserDrawerProps) {
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const [showPassword, setShowPassword] = useState(false);


  const isPending = isCreating || isUpdating;
  const isEdit = !!user;

  const [formData, setFormData] = useState<CreateUserRequest>({
    name: "",
    mobile: "",
    role: "JEN", // Default role
    username: "",
    password: "",
    jurisdiction_zone: "ULB",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        username: user.username || "",
        password: "",
        jurisdiction_zone: user.jurisdiction_zone || "ULB",
      });
    } else {
      setFormData({
        name: "",
        mobile: "",
        role: "JEN",
        username: "",
        password: "",
        jurisdiction_zone: "ULB",
      });
    }
  }, [user, isOpen]);

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserRequest, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof CreateUserRequest, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile Number is required";
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Mobile must be 10 digits";

    // Username/Password are optional in schema but usually good to have validation if entered
    if (!isEdit && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 chars";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (isEdit && user) {
        const updateData: UpdateUserRequest = {
          name: formData.name,
          mobile: formData.mobile,
          username: formData.username,
          jurisdiction_zone: formData.jurisdiction_zone,
        };
        await updateUser({ userId: user.id, data: updateData });
        alert("User updated successfully!");
      } else {
        await createUser(formData);
        alert("User created successfully!");
      }
      onClose();
    } catch (error: any) {
      console.error(`Failed to ${isEdit ? "update" : "create"} user`, error);
      const detail = error?.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      alert(`Failed to ${isEdit ? "update" : "create"} user: ${message || "Please try again."}`);
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
                {isEdit ? "Edit User" : "Add New User"}
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

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Full Name</label>
                <input
                  type="text"
                  placeholder="Rajesh Kumar"
                  className={`w-full h-[44px] rounded-lg border ${errors.name ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Username</label>
                <input
                  type="text"
                  placeholder="rajesh.kumar"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.username || ""}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <p className="text-xs text-gray-500">Optional. Will be auto-generated if left blank.</p>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Mobile Number</label>
                <input
                  type="text"
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  className={`w-full h-[44px] rounded-lg border ${errors.mobile ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40`}
                  value={formData.mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, mobile: val });
                  }}
                />
                {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
              </div>

              {/* Password */}
              {!isEdit && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`w-full h-[44px] rounded-lg border pr-12 pl-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40 ${errors.password ? "border-red-500" : "border-[#D6D9DE]"
                        }`}
                      value={formData.password || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <Image
                        src={
                          showPassword
                            ? "/dashboard/icons/login/visibilityClose.svg"
                            : "/dashboard/icons/login/visibility.svg"
                        }
                        alt="Toggle Password"
                        width={22}
                        height={22}
                      />
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Role</label>
                <DropdownSelect
                  options={ROLE_OPTIONS}
                  value={formData.role}
                  onChange={(val) => setFormData({ ...formData, role: val as UserRole })}
                  className="w-full h-[44px]"
                  disabled={isEdit}
                />
                {isEdit && <p className="text-xs text-gray-400">Role cannot be changed after creation.</p>}
              </div>

              {/* Jurisdiction Zone */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Jurisdiction Zone</label>
                <div className="flex items-center gap-6 py-1">
                  {["ULB", "UIT"].map((zone) => (
                    <label key={zone} className="flex cursor-pointer items-center gap-1.5">
                      <input
                        type="radio"
                        className="hidden"
                        checked={formData.jurisdiction_zone === zone}
                        onChange={() => setFormData({ ...formData, jurisdiction_zone: zone as any })}
                      />
                      <div className="flex h-5 w-5 items-center justify-center">
                        <Image
                          src={formData.jurisdiction_zone === zone ? "/dashboard/icons/applications/radio-selected.svg" : "/dashboard/icons/applications/radio-unselected.svg"}
                          alt="radio"
                          width={20}
                          height={20}
                        />
                      </div>
                      <span className="text-sm text-black font-normal uppercase">{zone}</span>
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
                disabled={isPending}
                className="h-[44px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isPending ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update User" : "Create User")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
