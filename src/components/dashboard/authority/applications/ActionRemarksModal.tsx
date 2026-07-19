"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import api from "@/lib/axios";

interface ActionRemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    remarks: string;
    objection_to_roles?: string[];
    role_remarks?: Record<string, string>;
    reverted_document_url?: string;
  }) => void;
  isPending?: boolean;
  type: "REJECT" | "OBJECT";
  appType?: "NEW" | "RENOVATION";
  appStatus?: string;
  userRole?: string;
  participatedRoles?: string[];
}

const ALL_ROLES = [
  { id: "CITIZEN", label: "Applicant (Citizen)" },
  { id: "JEN", label: "JEN (Junior Engineer)" },
  { id: "DEPT_LAND", label: "Land Department" },
  { id: "DEPT_LEGAL", label: "Legal Department" },
  { id: "DEPT_ATP", label: "ATP Department" },
];

export default function ActionRemarksModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  type,
  appType = "NEW",
  appStatus = "SUBMITTED",
  userRole,
  participatedRoles = [],
}: ActionRemarksModalProps) {
  const [remarks, setRemarks] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["CITIZEN"]);
  const [roleRemarks, setRoleRemarks] = useState<Record<string, string>>({});
  const [revertedFile, setRevertedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRemarks("");
      setRoleRemarks({});
      setRevertedFile(null);
      // Default selection rules
      if (appType === "NEW" && appStatus === "SUBMITTED") {
        setSelectedRoles(["CITIZEN"]);
      } else {
        setSelectedRoles(["CITIZEN"]);
      }
    }
  }, [isOpen, appType, appStatus]);

  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      if (selectedRoles.length === 1) return; // Keep at least one selected
      setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const isRoleDisabled = (roleId: string) => {
    // Rule 6.1: In New Construction at SUBMITTED state (before inspection), JEN is disabled
    if (appType === "NEW" && appStatus === "SUBMITTED" && roleId !== "CITIZEN") {
      return true;
    }

    // Rule 6.8 & 6.9: In Renovation flow for Commissioner, lower authority roles are disabled if they haven't commented or inspected
    if (appType === "RENOVATION" && userRole === "COMMISSIONER" && roleId !== "CITIZEN") {
      if (!participatedRoles.includes(roleId)) {
        return true;
      }
    }

    return false;
  };

  const handleConfirm = async () => {
    if (!remarks.trim()) {
      alert(`Please provide a reason for ${type === "REJECT" ? "rejection" : "objection"}.`);
      return;
    }

    if (type === "OBJECT" && !selectedRoles.length) {
      alert("Please select at least one role to object to.");
      return;
    }

    let revertedUrl: string | undefined = undefined;

    // Rule 6.3: Upload PDF file if provided for Citizen objection
    if (type === "OBJECT" && selectedRoles.includes("CITIZEN") && revertedFile) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", revertedFile);
        const res = await api.post("/api/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        revertedUrl = res.data?.url || res.data?.file_path;
      } catch (err) {
        console.error("Failed to upload objection reverted PDF", err);
        alert("Failed to upload PDF document. Please try again.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    onConfirm({
      remarks,
      objection_to_roles: type === "OBJECT" ? selectedRoles : undefined,
      role_remarks: type === "OBJECT" ? roleRemarks : undefined,
      reverted_document_url: revertedUrl,
    });
  };

  const isReject = type === "REJECT";
  const title = isReject ? "Reject Application" : "Raise Objection";
  const actionLabel = isReject ? "Reject" : "Raise Objection";
  const placeholder = isReject
    ? "Enter your reason to reject this application."
    : "Describe overall objection details.";

  const mainColor = isReject ? "#EF4444" : "#FFD648";
  const bgColor = isReject ? "#FEE2E2" : "#FFFBEB";
  const iconSrc = isReject ? "/dashboard/icons/cross-round-red.svg" : "/dashboard/icons/warning.svg";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl font-onest flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F4F4F4] p-4 px-5">
              <h2 className="text-[15px] font-medium text-[#343434]">{title}</h2>
              <button
                onClick={onClose}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image src="/dashboard/icons/close.svg" alt="Close" width={14} height={14} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: bgColor }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: mainColor }}>
                    <Image src={iconSrc} alt="" width={18} height={18} className={isReject ? "invert brightness-0" : ""} />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[#343434]">
                  {isReject ? "Reject Application" : "Raise Objection to Role(s)"}
                </h3>
              </div>

              {/* Multi-Role Checkboxes for Objection */}
              {!isReject && (
                <div className="flex flex-col gap-2 rounded-xl bg-[#F9FAFB] border border-[#D6D9DE] p-3.5">
                  <label className="text-xs font-bold text-[#343434] uppercase tracking-wider">
                    Select Target Roles for Objection:
                  </label>

                  <div className="flex flex-col gap-2 mt-1">
                    {ALL_ROLES.filter((r) => appType === "RENOVATION" || r.id === "CITIZEN" || r.id === "JEN").map((role) => {
                      const disabled = isRoleDisabled(role.id);
                      const checked = selectedRoles.includes(role.id);

                      return (
                        <div key={role.id} className="flex flex-col gap-1.5 border-b border-gray-100 last:border-b-0 pb-2">
                          <label
                            className={`flex items-center gap-2.5 text-xs font-medium cursor-pointer ${
                              disabled ? "opacity-40 cursor-not-allowed" : "text-[#343434]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => !disabled && toggleRole(role.id)}
                              className="size-4 rounded border-gray-300 text-[#0C83FF] focus:ring-[#0C83FF]"
                            />
                            <span>{role.label}</span>
                            {disabled && (
                              <span className="text-[10px] text-gray-400 italic">
                                {appType === "NEW" && appStatus === "SUBMITTED"
                                  ? "(Not inspected yet)"
                                  : "(Has not participated)"}
                              </span>
                            )}
                          </label>

                          {checked && selectedRoles.length > 1 && (
                            <input
                              type="text"
                              placeholder={`Specific remarks for ${role.label}...`}
                              value={roleRemarks[role.id] || ""}
                              onChange={(e) =>
                                setRoleRemarks({ ...roleRemarks, [role.id]: e.target.value })
                              }
                              className="ml-6.5 w-[calc(100%-1.625rem)] rounded-md border border-[#D6D9DE] px-2.5 py-1 text-xs text-[#343434] outline-none focus:border-[#0C83FF]"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rule 6.3: Upload "Objection Reverted Data" PDF for Applicant */}
              {!isReject && selectedRoles.includes("CITIZEN") && (
                <div className="flex flex-col gap-1.5 rounded-xl border border-[#72B7FF] bg-[#E7F3FF] p-3">
                  <label className="text-xs font-semibold text-[#0C83FF] flex items-center gap-1.5">
                    <span>📄 Attach "Objection Reverted Data" PDF (Optional for Applicant):</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setRevertedFile(e.target.files?.[0] || null)}
                    className="text-xs text-[#343434] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0C83FF] file:text-white hover:file:bg-blue-600 cursor-pointer"
                  />
                  {revertedFile && (
                    <p className="text-[10px] text-gray-600 italic">
                      Selected File: <strong className="text-[#343434]">{revertedFile.name}</strong>
                    </p>
                  )}
                </div>
              )}

              <textarea
                placeholder={placeholder}
                className="w-full h-[120px] resize-none rounded-xl border border-[#D6D9DE] p-3 text-xs text-[#343434] outline-none placeholder:opacity-40 font-normal"
                style={{ borderColor: remarks.trim() ? mainColor : "#D6D9DE" }}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button
                onClick={onClose}
                className="flex-1 h-[42px] rounded-lg border border-[#D6D9DE] bg-white text-xs font-semibold text-[#343434] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending || isUploading || !remarks.trim()}
                className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: mainColor }}
              >
                {isPending || isUploading ? "Processing..." : actionLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
