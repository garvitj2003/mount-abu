"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import { useMaterials } from "@/hooks/useMasterData";
import { useUpdateInspection } from "@/hooks/useApplications";

type ApplicationResponse = components["schemas"]["ApplicationResponse"];
type PhaseMaterialEntry = components["schemas"]["PhaseMaterialEntry"];

interface AddPhaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  app: ApplicationResponse;
  onConfirm: (num_stages: number, phase_materials: PhaseMaterialEntry[]) => Promise<void>;
  isPending?: boolean;
}

export default function AddPhaseDrawer({
  isOpen,
  onClose,
  app,
  onConfirm,
  isPending = false,
}: AddPhaseDrawerProps) {
  const { data: dbMaterials = [] } = useMaterials();
  const totalPhases = app.inspections[0]?.recommended_phases || 1;
  const [activeStage, setActiveStage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const updateInspectionMutation = useUpdateInspection();
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const wasOpenRef = useRef(false);

  const [showAddPhaseConfirm, setShowAddPhaseConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [pendingPhaseMaterials, setPendingPhaseMaterials] = useState<PhaseMaterialEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNewPhase = async () => {
    if (!app.inspections || app.inspections.length === 0) {
      alert("No inspection report found to update recommended phases.");
      return;
    }
    const newPhases = totalPhases + 1;
    setIsAddingPhase(true);
    try {
      await updateInspectionMutation.mutateAsync({
        id: app.id,
        data: {
          latitude: app.inspections[0].latitude,
          longitude: app.inspections[0].longitude,
          remarks: app.inspections[0].remarks || "Adding new phase",
          media_paths: (app.inspections[0].media_paths as string[]) || [],
          recommended_phases: newPhases,
        },
      });

      // Initialize the new phase in local state
      const applicantCustomMaterials = app.materials?.filter(m => !m.material_id) || [];
      setEstimates(prev => ({
        ...prev,
        [newPhases]: {}
      }));
      setCustomMaterials(prev => ({
        ...prev,
        [newPhases]: applicantCustomMaterials.map((mat) => ({
          id: mat.id,
          name: mat.custom_name || "",
          unit: mat.custom_unit || "Kg",
          qty: "0",
          isApplicantCustom: true,
        }))
      }));

      // Automatically switch to the newly created stage
      setActiveStage(newPhases);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || "Failed to add a new phase.";
      alert(errorMsg);
    } finally {
      setIsAddingPhase(false);
    }
  };

  // Estimates for master materials: { [stageNumber]: { [materialId]: quantity } }
  const [estimates, setEstimates] = useState<Record<number, Record<number, number>>>({});
  
  // Custom/Extra materials list: { [stageNumber]: { id: number; name: string; unit: string; qty: string; isApplicantCustom?: boolean }[] }
  const [customMaterials, setCustomMaterials] = useState<
    Record<number, { id: number; name: string; unit: string; qty: string; isApplicantCustom?: boolean }[]>
  >({});

  // State for pending custom material addition
  const [pendingCustom, setPendingCustom] = useState({ name: "", unit: "Kg", qty: "", customUnit: "" });

  // Initialize/Reset estimates and custom materials when modal opens
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      const initialEstimates: Record<number, Record<number, number>> = {};
      const initialCustom: Record<number, { id: number; name: string; unit: string; qty: string; isApplicantCustom?: boolean }[]> = {};
      
      const applicantCustomMaterials = app.materials?.filter(m => !m.material_id) || [];

      for (let s = 1; s <= totalPhases; s++) {
        initialEstimates[s] = {};
        initialCustom[s] = applicantCustomMaterials.map((mat) => ({
          id: mat.id,
          name: mat.custom_name || "",
          unit: mat.custom_unit || "Kg",
          qty: "0",
          isApplicantCustom: true,
        }));
      }

      if (app.phase_materials && app.phase_materials.length > 0) {
        app.phase_materials.forEach((pm) => {
          const ph = pm.phase;
          if (ph <= totalPhases) {
            if (pm.material_id) {
              initialEstimates[ph][pm.material_id] = pm.quantity;
            } else if (pm.custom_name) {
              const existingCustom = initialCustom[ph].find(c => c.name.toLowerCase() === pm.custom_name?.toLowerCase());
              if (existingCustom) {
                existingCustom.qty = pm.quantity.toString();
                if (pm.id) existingCustom.id = pm.id;
              } else {
                initialCustom[ph].push({
                  id: pm.id || Date.now() + Math.random(),
                  name: pm.custom_name,
                  unit: pm.custom_unit || "Kg",
                  qty: pm.quantity.toString(),
                });
              }
            }
          }
        });
      } else {
        if (app.materials) {
          app.materials.forEach(mat => {
            if (mat.material_id) {
              initialEstimates[1][mat.material_id] = mat.quantity;
            } else if (mat.custom_name) {
              const match = initialCustom[1].find(c => c.name.toLowerCase() === mat.custom_name?.toLowerCase());
              if (match) {
                match.qty = mat.quantity.toString();
              }
            }
          });
        }
      }
      setEstimates(initialEstimates);
      setCustomMaterials(initialCustom);
      setActiveStage(1);
      setSearchQuery("");
      setPendingCustom({ name: "", unit: "Kg", qty: "", customUnit: "" });
    } else if (!isOpen) {
      wasOpenRef.current = false;
    }
  }, [isOpen, app.phase_materials, app.materials, totalPhases]);

  const handleQtyChange = (stage: number, matId: number, val: string) => {
    const qty = parseInt(val) || 0;
    setEstimates(prev => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        [matId]: qty
      }
    }));
  };

  const handleAddCustomMaterial = () => {
    if (!pendingCustom.name.trim()) {
      alert("Please enter a material name.");
      return;
    }
    const qtyNum = parseInt(pendingCustom.qty);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const finalUnit = pendingCustom.unit === "Other" ? pendingCustom.customUnit || "Unit" : pendingCustom.unit;

    const newMaterial = {
      id: Date.now(),
      name: pendingCustom.name.trim(),
      unit: finalUnit,
      qty: pendingCustom.qty,
    };

    setCustomMaterials(prev => ({
      ...prev,
      [activeStage]: [...(prev[activeStage] || []), newMaterial],
    }));

    setPendingCustom({ name: "", unit: "Kg", qty: "", customUnit: "" });
  };

  const handleRemoveCustomMaterial = (stage: number, id: number) => {
    setCustomMaterials(prev => ({
      ...prev,
      [stage]: (prev[stage] || []).filter(m => m.id !== id),
    }));
  };

  const handleCustomQtyChange = (stage: number, id: number, val: string) => {
    setCustomMaterials(prev => ({
      ...prev,
      [stage]: (prev[stage] || []).map(m => m.id === id ? { ...m, qty: val } : m),
    }));
  };

  const filteredMasterMaterials = useMemo(() => {
    if (!searchQuery.trim()) return dbMaterials;
    const query = searchQuery.toLowerCase();
    return dbMaterials.filter(m => m.name.toLowerCase().includes(query));
  }, [dbMaterials, searchQuery]);

  const handleSubmit = () => {
    const phase_materials: PhaseMaterialEntry[] = [];
    const generatedPhases = new Set(app.tokens?.map(t => t.phase) || []);
    
    // 1. Collect master materials
    Object.entries(estimates).forEach(([stageStr, mats]) => {
      const stage = parseInt(stageStr);
      if (generatedPhases.has(stage)) return;
      Object.entries(mats).forEach(([matIdStr, qty]) => {
        if (qty > 0) {
          const matId = parseInt(matIdStr);
          const originalMat = dbMaterials.find(m => m.id === matId);
          if (originalMat) {
            phase_materials.push({
              phase: stage,
              material_id: matId,
              quantity: qty
            });
          }
        }
      });
    });

    // 2. Collect custom materials
    Object.entries(customMaterials).forEach(([stageStr, mats]) => {
      const stage = parseInt(stageStr);
      if (generatedPhases.has(stage)) return;
      mats.forEach((mat) => {
        const qty = parseInt(mat.qty) || 0;
        if (qty > 0) {
          phase_materials.push({
            phase: stage,
            custom_name: mat.name,
            custom_unit: mat.unit,
            quantity: qty
          });
        }
      });
    });

    if (phase_materials.length === 0) {
      alert("Please enter at least one material quantity.");
      return;
    }

    setPendingPhaseMaterials(phase_materials);
    setShowSubmitConfirm(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(totalPhases, pendingPhaseMaterials);
      setShowSubmitConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPhaseGenerated = app.tokens?.some(t => t.phase === activeStage) || false;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container: 90% Width, 90% Height */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 flex h-[90vh] w-[90vw] flex-col rounded-2xl bg-white shadow-2xl font-onest overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F4F4F4] px-6 py-4">
              <div className="flex flex-col">
                <h2 className="text-base font-bold text-[#343434]">
                  Add/Edit Phase Details
                </h2>
                <p className="text-xs text-gray-500">
                  Configure phase-wise materials allocation for APP-{app.id.toString().padStart(5, '0')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Image src="/dashboard/icons/close.svg" alt="Close" width={14} height={14} />
              </button>
            </div>

            {/* Stage Selector Sub-header */}
            <div className="border-b border-[#D6D9DE] bg-white px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <label className="text-[13px] font-semibold text-[#343434]">Active Phase:</label>
                <div className="flex gap-2">
                  {Array.from({ length: totalPhases }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStage(i + 1)}
                      className={`h-9 min-w-24 rounded-lg border px-4 text-xs font-semibold transition-colors cursor-pointer ${
                        activeStage === i + 1 
                          ? "bg-[#0C83FF] text-white border-[#0C83FF]" 
                          : "bg-white text-[#343434] border-[#D6D9DE] hover:bg-gray-50"
                      }`}
                    >
                      Phase {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isAddingPhase}
                  onClick={() => setShowAddPhaseConfirm(true)}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#0C83FF] bg-blue-50 px-4 text-xs font-semibold text-[#0C83FF] hover:bg-blue-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isAddingPhase ? "Adding..." : "+ Add New Phase"}
                </button>
              </div>
            </div>

            {/* Split Screen Body */}
            <div className="flex flex-1 overflow-hidden">
              
              {/* Left Panel: Master Materials (Takes remaining width) */}
              <div className="flex-1 flex flex-col p-6 overflow-hidden bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <p className="text-[12px] font-bold text-[#0C83FF] uppercase tracking-wider">Part 1: Master Materials</p>
                    <p className="text-xs text-gray-500">Allocate predefined system materials for Phase {activeStage}</p>
                  </div>
                  {/* Search Input for Master Materials */}
                  <input
                    type="text"
                    placeholder="Search master materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-[34px] w-[240px] rounded-lg border border-[#D6D9DE] px-3 text-sm outline-none focus:border-[#0C83FF]"
                  />
                </div>

                {/* Table container */}
                <div className="flex-1 overflow-y-auto rounded-lg border border-[#D6D9DE]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 z-10 shadow-[0_1px_0_0_#D6D9DE]">
                      <tr>
                        <th className="p-3 text-[11px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Material Name</th>
                        <th className="p-3 text-[11px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Unit</th>
                        <th className="p-3 text-[11px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Applicant Requested</th>
                        <th className="p-3 text-[11px] font-semibold text-[#333333] opacity-70 uppercase">JEN Allocated Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMasterMaterials.map((mat) => {
                        const originalReq = app.materials?.find(m => m.material_id === mat.id);
                        return (
                          <tr key={mat.id} className="border-b border-[#D6D9DE] last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="p-3 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE]">
                              {mat.name}
                            </td>
                            <td className="p-3 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE] opacity-60">
                              {mat.unit}
                            </td>
                            <td className="p-3 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE] opacity-60">
                              {originalReq ? `${originalReq.quantity} Units` : "—"}
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                value={estimates[activeStage]?.[mat.id] || ""}
                                onChange={(e) => handleQtyChange(activeStage, mat.id, e.target.value)}
                                className="w-full h-[34px] rounded-lg border border-[#D6D9DE] bg-white px-3 text-sm font-medium outline-none focus:border-[#0C83FF] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                placeholder="0"
                                disabled={isPhaseGenerated}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Panel: Custom / Extra Materials (Fixed 400px width) */}
              <div className="w-[400px] shrink-0 border-l border-[#D6D9DE] bg-[#F9FAFB] flex flex-col p-6 overflow-hidden">
                <div className="mb-4">
                  <p className="text-[12px] font-bold text-[#0C83FF] uppercase tracking-wider">Part 2: Custom Extra Materials</p>
                  <p className="text-xs text-gray-500">Add arbitrary materials not in the master list</p>
                </div>

                {/* Add Custom Material Form */}
                {isPhaseGenerated ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex flex-col gap-1">
                    <p className="text-[12px] font-bold text-yellow-800 uppercase tracking-wider">Phase is Locked</p>
                    <p className="text-xs text-yellow-700 leading-relaxed font-medium">
                      This phase is locked because its token has already been generated. Materials cannot be modified.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#D6D9DE] p-4 gap-3 flex flex-col mb-4">
                    <div>
                      <label className="text-[11px] font-semibold text-[#343434] opacity-70 uppercase block mb-1">Material Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Special Wood Panels"
                        value={pendingCustom.name}
                        onChange={(e) => setPendingCustom(prev => ({ ...prev, name: e.target.value }))}
                        className="h-[34px] w-full rounded-lg border border-[#D6D9DE] px-3 text-sm outline-none focus:border-[#0C83FF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#343434] opacity-70 uppercase block mb-1">Unit</label>
                        <select
                          value={pendingCustom.unit}
                          onChange={(e) => setPendingCustom(prev => ({ ...prev, unit: e.target.value }))}
                          className="h-[34px] w-full rounded-lg border border-[#D6D9DE] px-3 text-sm bg-white outline-none focus:border-[#0C83FF]"
                        >
                          <option value="Kg">Kg</option>
                          <option value="Bag">Bag</option>
                          <option value="Quintal">Quintal</option>
                          <option value="Metric Ton">Metric Ton</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#343434] opacity-70 uppercase block mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="Quantity"
                          value={pendingCustom.qty}
                          onChange={(e) => setPendingCustom(prev => ({ ...prev, qty: e.target.value }))}
                          className="h-[34px] w-full rounded-lg border border-[#D6D9DE] px-3 text-sm outline-none focus:border-[#0C83FF]"
                        />
                      </div>
                    </div>

                    {pendingCustom.unit === "Other" && (
                      <div>
                        <label className="text-[11px] font-semibold text-[#343434] opacity-70 uppercase block mb-1">Specify Custom Unit</label>
                        <input
                          type="text"
                          placeholder="e.g. Boxes, Litres"
                          value={pendingCustom.customUnit}
                          onChange={(e) => setPendingCustom(prev => ({ ...prev, customUnit: e.target.value }))}
                          className="h-[34px] w-full rounded-lg border border-[#D6D9DE] px-3 text-sm outline-none focus:border-[#0C83FF]"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleAddCustomMaterial}
                      className="h-[38px] w-full rounded-lg bg-[#0C83FF] text-white text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      + Add to Phase {activeStage}
                    </button>
                  </div>
                )}

                {/* Custom Materials List for Active Phase */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Custom Materials in Phase {activeStage} ({customMaterials[activeStage]?.length || 0})
                  </p>
                  
                  {(!customMaterials[activeStage] || customMaterials[activeStage].length === 0) ? (
                    <div className="h-24 flex items-center justify-center rounded-xl border border-dashed border-[#D6D9DE] text-xs text-gray-400 bg-white">
                      No custom materials added yet.
                    </div>
                  ) : (
                    customMaterials[activeStage].map((mat) => (
                      <div key={mat.id} className="flex items-center justify-between gap-4 rounded-lg border border-[#D6D9DE] bg-white p-3 hover:border-[#0C83FF] transition-colors group">
                        <div className="flex-1 flex flex-col min-w-0">
                          <span className="text-[13px] font-medium text-[#343434] truncate">{mat.name}</span>
                          <span className="text-[11px] text-gray-500">{mat.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={mat.qty}
                            onChange={(e) => handleCustomQtyChange(activeStage, mat.id, e.target.value)}
                            className="w-16 h-[28px] rounded border border-[#D6D9DE] bg-white px-2 text-xs font-semibold outline-none focus:border-[#0C83FF] text-center disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            placeholder="Qty"
                            disabled={isPhaseGenerated}
                          />
                          {!mat.isApplicantCustom && !isPhaseGenerated && (
                            <button
                              onClick={() => handleRemoveCustomMaterial(activeStage, mat.id)}
                              className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors cursor-pointer"
                            >
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#D6D9DE] p-4 bg-[#F4F4F4] flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="h-[40px] rounded-lg border border-[#D6D9DE] bg-white px-6 text-sm font-medium text-[#343434] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isPending}
                className="h-[40px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {isPending ? "Submitting..." : "Confirm & Submit All Phases"}
              </button>
            </div>
          </motion.div>

          {/* Confirmation Modals */}
          <ConfirmModal
            isOpen={showAddPhaseConfirm}
            onClose={() => setShowAddPhaseConfirm(false)}
            onConfirm={handleAddNewPhase}
            title="Add New Phase"
            message={`Are you sure you want to add a new phase to this application? This will update the recommended phases to ${totalPhases + 1}.`}
            confirmLabel="Add Phase"
            isPending={isAddingPhase}
          />

          <ConfirmModal
            isOpen={showSubmitConfirm}
            onClose={() => setShowSubmitConfirm(false)}
            onConfirm={handleFinalSubmit}
            title="Confirm Materials Submission"
            message="Are you sure you want to confirm and submit all phase material allocations?"
            confirmLabel="Confirm & Submit"
            isPending={isPending || isSubmitting}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  isPending?: boolean;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel, isPending }: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-xl bg-white shadow-2xl font-onest flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F4F4F4] p-4 px-5">
              <h2 className="text-[15px] font-bold text-[#343434]">{title}</h2>
              <button
                onClick={onClose}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image src="/dashboard/icons/close.svg" alt="Close" width={14} height={14} />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 flex flex-col gap-2">
              <h3 className="text-[16px] font-semibold text-[#343434]">Are you sure?</h3>
              <p className="text-[14px] text-[#343434] opacity-70 leading-relaxed">{message}</p>
            </div>
            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button
                onClick={onClose}
                disabled={isPending}
                className="flex-1 h-[40px] rounded-lg border border-[#D6D9DE] bg-white text-sm font-semibold text-[#343434] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isPending}
                className="flex-1 h-[40px] flex items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Confirming..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
