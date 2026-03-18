"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import { useMaterials } from "@/hooks/useMasterData";

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
  // Only fetch materials when drawer is open
  const { data: masterMaterials = [] } = useMaterials({ enabled: isOpen });
  
  // Total phases is fixed to what comes from the application response
  const totalPhases = app.num_stages || 1;
  const [activeStage, setActiveStage] = useState(1);
  
  // State to store JEN's estimates: { [stageNumber]: { [materialId]: quantity } }
  const [estimates, setEstimates] = useState<Record<number, Record<number, number>>>({});

  // Initialize/Reset estimates when drawer opens or app data changes
  useEffect(() => {
    if (isOpen && app.materials) {
      const initialEstimates: Record<number, Record<number, number>> = {};
      for (let s = 1; s <= totalPhases; s++) {
        initialEstimates[s] = {};
        app.materials.forEach(mat => {
          // Initialize Stage 1 with full requested qty, others with 0
          initialEstimates[s][mat.material_id] = s === 1 ? mat.quantity : 0;
        });
      }
      setEstimates(initialEstimates);
      setActiveStage(1);
    }
  }, [isOpen, app.materials, totalPhases]);

  const handleQtyChange = (stage: number, materialId: number, val: string) => {
    const qty = parseInt(val) || 0;
    setEstimates(prev => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        [materialId]: qty
      }
    }));
  };

  const handleSubmit = async () => {
    const phase_materials: PhaseMaterialEntry[] = [];
    
    Object.entries(estimates).forEach(([stageStr, mats]) => {
      const stage = parseInt(stageStr);
      Object.entries(mats).forEach(([matIdStr, qty]) => {
        if (qty > 0) {
          phase_materials.push({
            phase: stage,
            material_id: parseInt(matIdStr),
            quantity: qty
          });
        }
      });
    });

    if (phase_materials.length === 0) {
      alert("Please enter at least one material quantity.");
      return;
    }

    // Pass the fixed totalPhases as num_stages
    await onConfirm(totalPhases, phase_materials);
  };

  const getMaterialName = (id: number) => {
    const mat = masterMaterials.find(m => m.id === id);
    return mat ? `${mat.name} (${mat.unit})` : `Material ${id}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 h-full w-full max-w-[540px] bg-white shadow-2xl font-onest flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F4F4F4] px-5 py-4">
              <h2 className="text-[14px] font-medium text-[#343434]">
                Add Phase Details
              </h2>
              <button
                onClick={onClose}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image src="/dashboard/icons/close.svg" alt="Close" width={14} height={14} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Editing Phase Selection */}
              <div className="space-y-3 border-b border-[#D6D9DE] pb-5">
                <label className="text-[13px] font-medium text-[#343434]">Select Phase to Edit</label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: totalPhases }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStage(i + 1)}
                      className={`h-10 min-w-24 rounded-lg border px-4 text-sm font-medium transition-colors ${
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

              {/* Active Phase Details */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#343434]">Estimating for Phase {activeStage}</label>
                  <div className="rounded-lg border border-[#D6D9DE] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#D6D9DE] bg-gray-50">
                          <th className="p-3 text-[11px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Material Name</th>
                          <th className="p-3 text-[11px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Applicant Requested</th>
                          <th className="p-3 text-[11px] font-semibold text-[#333333] opacity-70 uppercase">JEN Estimate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {app.materials?.map((mat) => (
                          <tr key={mat.material_id} className="border-b border-[#D6D9DE] last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="p-3 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE]">
                              {getMaterialName(mat.material_id)}
                            </td>
                            <td className="p-3 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE] opacity-60">
                              {mat.quantity} Units
                            </td>
                            <td className="p-3">
                              <input 
                                type="number" 
                                value={estimates[activeStage]?.[mat.material_id] ?? 0}
                                onChange={(e) => handleQtyChange(activeStage, mat.material_id, e.target.value)}
                                className="w-full h-[34px] rounded-lg border border-[#D6D9DE] bg-white px-3 text-sm font-medium outline-none focus:border-[#0C83FF]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {totalPhases > 1 && (
                <div className="rounded-lg bg-[#F0F7FF] p-4 border border-[#E0E7FF] space-y-3 shadow-sm">
                  <p className="text-[12px] font-bold text-[#0C83FF] uppercase tracking-wider">Overall Distribution Summary</p>
                  <div className="grid grid-cols-1 gap-2">
                    {app.materials?.map(mat => {
                      const totalEstimated = Object.values(estimates).reduce((acc, curr) => acc + (curr[mat.material_id] || 0), 0);
                      const isOver = totalEstimated > mat.quantity;
                      return (
                        <div key={mat.material_id} className="flex items-center justify-between text-[12px]">
                          <span className="text-[#343434] font-medium">{getMaterialName(mat.material_id)}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isOver ? "text-red-500" : "text-[#059669]"}`}>
                              {totalEstimated}
                            </span>
                            <span className="text-gray-400">/</span>
                            <span className="text-[#343434] opacity-60">{mat.quantity}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="border-t border-[#D6D9DE] p-4 bg-white flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="h-[44px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isPending}
                className="h-[44px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {isPending ? "Submitting..." : "Confirm & Submit All Phases"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
