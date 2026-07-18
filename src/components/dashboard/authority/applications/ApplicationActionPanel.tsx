"use client";

import { type components } from "@/types/api";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { motion, AnimatePresence } from "motion/react";

type ApplicationResponse = components["schemas"]["ApplicationResponse"];
type UserRole = components["schemas"]["UserRole"];
type WorkflowAction = components["schemas"]["WorkflowAction"];

interface ActionButtonProps {
  label: string;
  icon?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "warning" | "success";
  loading?: boolean;
  disabled?: boolean;
  title?: string;
}

const ActionButton = ({ 
  label, 
  icon, 
  onClick, 
  variant = "secondary",
  loading = false,
  disabled = false,
  title
}: ActionButtonProps) => {
  const styles = {
    primary: "bg-[#0C83FF] text-white border-[#0C83FF]",
    secondary: "bg-[#F5F6F7] text-[#343434] border-[#D6D9DE]",
    danger: "bg-[#EF4444] text-white border-[#EF4444]",
    warning: "bg-[#FFD648] text-[#343434] border-[#FFD648]",
    success: "bg-[#059669] text-white border-[#059669]",
  };

  return (
    <button 
      onClick={onClick}
      disabled={loading || disabled}
      title={title}
      className={`flex items-center justify-center gap-2 rounded-lg border border-solid px-2.5 py-2 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 ${styles[variant]} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {icon && !loading && <Image src={icon} alt="" width={16} height={16} className={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'invert brightness-0' : ''} />}
      {loading ? "..." : label}
    </button>
  );
};

interface ApplicationActionPanelProps {
  app: ApplicationResponse;
  userRole?: UserRole;
  onAction: (action: WorkflowAction, remarks?: string, extra?: { phase?: number }) => void;
  onCommentClick?: () => void;
  onRejectClick?: () => void;
  onObjectionClick?: (role: string) => void;
  onAddPhaseClick?: () => void;
  isPending?: boolean;
}

export default function ApplicationActionPanel({ 
  app, 
  userRole, 
  onAction,
  onCommentClick,
  onRejectClick,
  onObjectionClick,
  onAddPhaseClick,
  isPending = false 
}: ApplicationActionPanelProps) {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showForwardConfirm, setShowForwardConfirm] = useState(false);
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const [pendingGeneratePhase, setPendingGeneratePhase] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const objectionOptions = useMemo(() => {
    if (app.type === "NEW") {
      return [
        { label: "Junior Engineer (JEN)", value: "JEN" },
        { label: "Applicant / Citizen", value: "CITIZEN" },
      ];
    } else {
      return [
        { label: "Land Department", value: "DEPT_LAND" },
        { label: "Legal Department", value: "DEPT_LEGAL" },
        { label: "ATP Department", value: "DEPT_ATP" },
        { label: "Junior Engineer (JEN)", value: "JEN" },
        { label: "Applicant / Citizen", value: "CITIZEN" },
      ];
    }
  }, [app.type]);
  
  const totalPhases = useMemo(() => {
    return app.phase_materials && app.phase_materials.length > 0
      ? Math.max(...app.phase_materials.map(pm => pm.phase))
      : (app.inspections?.[0]?.recommended_phases || app.num_stages || 0);
  }, [app.phase_materials, app.inspections, app.num_stages]);

  const hasGeoPhotos = useMemo(() => 
    app.inspections && app.inspections.length > 0, 
  [app.inspections]);

  const workflowActions = useMemo(() => {
    if (!userRole || userRole === "COLLECTOR") return [];

    const isNew = app.type === "NEW";
    const isRenovation = app.type === "RENOVATION";
    const status = app.status;

    const actionList: React.ReactNode[] = [];

    const options = Array.from({ length: totalPhases }).map((_, i) => ({
      label: `Phase ${i + 1}`,
      value: i + 1,
    }));

    const renderOption = (option: { label: string; value: string | number }) => {
      const p = option.value as number;
      const isAlreadyGenerated = app.tokens?.some(t => t.phase === p);
      const prevToken = app.tokens?.find(t => t.phase === p - 1);
      const isPrevCompleted = prevToken?.status === "COMPLETED" || prevToken?.status === "TERMINATED";
      const isBlocked = !isAlreadyGenerated && p > 1 && !isPrevCompleted;
      
      let statusText = "";
      let statusColor = "text-[#343434]/60";
      if (isAlreadyGenerated) {
        statusText = " (Generated)";
        statusColor = "text-[#059669] font-medium";
      } else if (isBlocked) {
        statusText = " (Blocked)";
        statusColor = "text-[#EF4444]";
      }

      return (
        <div className={`flex w-full justify-between items-center ${isAlreadyGenerated || isBlocked ? "opacity-40 cursor-not-allowed" : ""}`}>
          <span>{option.label}</span>
          <span className={`text-[10px] italic ${statusColor}`}>{statusText}</span>
        </div>
      );
    };

    const handleDropdownChange = (val: string | number) => {
      const p = val as number;
      const isAlreadyGenerated = app.tokens?.some(t => t.phase === p);
      if (isAlreadyGenerated) {
        alert(`Token already generated for Phase ${p}`);
        return;
      }
      
      if (p > 1) {
        const prevToken = app.tokens?.find(t => t.phase === p - 1);
        if (!prevToken) {
          alert(`Token for Phase ${p - 1} must be generated and completed or terminated first`);
          return;
        }
        if (prevToken.status !== "COMPLETED" && prevToken.status !== "TERMINATED") {
          alert(`Token for Phase ${p - 1} must be completed or terminated (currently ${prevToken.status.toLowerCase()})`);
          return;
        }
      }

      setPendingGeneratePhase(p);
      setShowGenerateConfirm(true);
    };

    const pushGenerateTokenButtons = () => {
      if ((userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN") && totalPhases > 0) {
        actionList.push(
          <div key="generate-token-group" className="flex items-center">
            <DropdownSelect
              options={options}
              value={null}
              onChange={handleDropdownChange}
              placeholder="Generate Token"
              className="w-48 h-[44px]"
              triggerClassName="bg-[#059669] text-white border-[#059669] hover:bg-[#047857] transition-colors"
              renderOption={renderOption}
              renderTrigger={(selectedOption, isOpen) => (
                <div className="flex w-full items-center justify-between font-semibold font-onest text-white text-sm">
                  <span className="flex items-center gap-2">
                    <Image
                      src="/dashboard/icons/applications/calendar.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="invert brightness-0"
                    />
                    Generate Token
                  </span>
                  <div className={`pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                    <Image
                      src="/dashboard/icons/applications/chevron-down.svg"
                      alt="down"
                      width={10}
                      height={6}
                      className="invert brightness-0"
                    />
                  </div>
                </div>
              )}
            />
          </div>
        );
      }
    };

    // Flow: NEW CONSTRUCTION
    if (isNew) {
      if (status === "SUBMITTED" && (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN")) {
        actionList.push(
          <div key="obj-dropdown-group" className="flex items-center">
            <DropdownSelect
              options={objectionOptions}
              value=""
              onChange={(val) => onObjectionClick?.(val as string)}
              className="h-[38px]"
              triggerClassName="bg-[#FFD648] text-[#343434] border-[#FFD648] font-medium font-onest hover:opacity-90 transition-opacity rounded-lg px-2.5 flex items-center justify-between gap-2 cursor-pointer"
              renderTrigger={(selectedOpt, isOpen) => (
                <div className="flex items-center gap-2">
                  <Image src="/dashboard/icons/warning.svg" alt="" width={16} height={16} />
                  <span>Objection</span>
                  <div className={`pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                    <Image
                      src="/dashboard/icons/applications/chevron-down.svg"
                      alt="down"
                      width={10}
                      height={6}
                      className="opacity-60"
                    />
                  </div>
                </div>
              )}
            />
          </div>,
          <ActionButton key="rej" label="Reject" icon="/dashboard/icons/cross-round-red.svg" variant="danger" onClick={onRejectClick} />,
          <ActionButton key="app" label="Approve" variant="success" onClick={() => setShowApproveConfirm(true)} />
        );
      }
      if (status === "OBJECTED" && (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN")) {
        actionList.push(
          <ActionButton key="clear-app" label="Clear Objection" variant="success" onClick={() => setShowClearConfirm(true)} />
        );
      }
      if (status === "APPROVED" || status === "TOKEN_GENERATED") {
        if (status === "APPROVED" && (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN")) {
          actionList.push(
            <div key="obj-dropdown-group" className="flex items-center">
              <DropdownSelect
                options={objectionOptions}
                value=""
                onChange={(val) => onObjectionClick?.(val as string)}
                className="h-[38px]"
                triggerClassName="bg-[#FFD648] text-[#343434] border-[#FFD648] font-medium font-onest hover:opacity-90 transition-opacity rounded-lg px-2.5 flex items-center justify-between gap-2 cursor-pointer"
                renderTrigger={(selectedOpt, isOpen) => (
                  <div className="flex items-center gap-2">
                    <Image src="/dashboard/icons/warning.svg" alt="" width={16} height={16} />
                    <span>Objection</span>
                    <div className={`pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <Image
                        src="/dashboard/icons/applications/chevron-down.svg"
                        alt="down"
                        width={10}
                        height={6}
                        className="opacity-60"
                      />
                    </div>
                  </div>
                )}
              />
            </div>,
            <ActionButton key="rej" label="Reject" icon="/dashboard/icons/cross-round-red.svg" variant="danger" onClick={onRejectClick} />
          );
        }
        if (userRole === "JEN" || userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton 
              key="add-phase" 
              label="Add/Edit Phase" 
              icon="/dashboard/icons/applications/calendar.svg" 
              variant="primary" 
              onClick={onAddPhaseClick} 
              disabled={!hasGeoPhotos}
              title={!hasGeoPhotos ? "Geo tagged photos and estimate material is not available" : ""}
            />
          );
        }
        pushGenerateTokenButtons();
      }
    }

    // Flow: RENOVATION
    if (isRenovation) {
      if (status === "SUBMITTED") {
        if (userRole === "COMMISSIONER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="fwd" label="Forward to Depts" variant="primary" onClick={() => setShowForwardConfirm(true)} />
          );
        } else if (userRole === "NODAL_OFFICER") {
          actionList.push(
            <ActionButton key="pending-comm" label="Pending Commissioner Approval" disabled variant="secondary" />
          );
        }
      }
      if (status === "FORWARDED") {
        if (userRole === "SUPERADMIN" || userRole === "COMMISSIONER") {
          actionList.push(
            <div key="obj-dropdown-group" className="flex items-center">
              <DropdownSelect
                options={objectionOptions}
                value=""
                onChange={(val) => onObjectionClick?.(val as string)}
                className="h-[38px]"
                triggerClassName="bg-[#FFD648] text-[#343434] border-[#FFD648] font-medium font-onest hover:opacity-90 transition-opacity rounded-lg px-2.5 flex items-center justify-between gap-2 cursor-pointer"
                renderTrigger={(selectedOpt, isOpen) => (
                  <div className="flex items-center gap-2">
                    <Image src="/dashboard/icons/warning.svg" alt="" width={16} height={16} />
                    <span>Raise Objection</span>
                    <div className={`pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <Image
                        src="/dashboard/icons/applications/chevron-down.svg"
                        alt="down"
                        width={10}
                        height={6}
                        className="opacity-60"
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          );
        }
        if (hasGeoPhotos && (userRole === "JEN" || userRole === "SUPERADMIN")) {
          actionList.push(
            <ActionButton 
              key="add-phase" 
              label="Add/Edit Phase" 
              icon="/dashboard/icons/applications/calendar.svg" 
              variant="primary" 
              onClick={onAddPhaseClick} 
            />
          );
        }
        if (userRole === "COMMISSIONER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="rej" label="Reject" icon="/dashboard/icons/cross-round-red.svg" variant="danger" onClick={onRejectClick} />,
            <ActionButton key="app" label="Approve Application" variant="success" onClick={() => setShowApproveConfirm(true)} />
          );
        } else if (userRole === "NODAL_OFFICER") {
          actionList.push(
            <ActionButton key="pending-comm" label="Pending Commissioner Approval" disabled variant="secondary" />
          );
        }
      }
      if (status === "OBJECTED") {
        if (userRole === "COMMISSIONER" || userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="clear-app" label="Clear Objection" variant="success" onClick={() => setShowClearConfirm(true)} />
          );
        }
      }
      if (status === "APPROVED" || status === "TOKEN_GENERATED") {
        if (status === "APPROVED" && (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN")) {
          actionList.push(
            <div key="obj-dropdown-group" className="flex items-center">
              <DropdownSelect
                options={objectionOptions}
                value=""
                onChange={(val) => onObjectionClick?.(val as string)}
                className="h-[38px]"
                triggerClassName="bg-[#FFD648] text-[#343434] border-[#FFD648] font-medium font-onest hover:opacity-90 transition-opacity rounded-lg px-2.5 flex items-center justify-between gap-2 cursor-pointer"
                renderTrigger={(selectedOpt, isOpen) => (
                  <div className="flex items-center gap-2">
                    <Image src="/dashboard/icons/warning.svg" alt="" width={16} height={16} />
                    <span>Objection</span>
                    <div className={`pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <Image
                        src="/dashboard/icons/applications/chevron-down.svg"
                        alt="down"
                        width={10}
                        height={6}
                        className="opacity-60"
                      />
                    </div>
                  </div>
                )}
              />
            </div>,
            <ActionButton key="rej" label="Reject" icon="/dashboard/icons/cross-round-red.svg" variant="danger" onClick={onRejectClick} />
          );
        }
        if (hasGeoPhotos && (userRole === "JEN" || userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN")) {
          actionList.push(
            <ActionButton 
              key="add-phase" 
              label="Add/Edit Phase" 
              icon="/dashboard/icons/applications/calendar.svg" 
              variant="primary" 
              onClick={onAddPhaseClick} 
            />
          );
        }
        pushGenerateTokenButtons();
      }
    }

    return actionList;
  }, [userRole, app.status, app.type, app.num_stages, app.inspections, app.phase_materials, app.tokens, onAction, onRejectClick, onObjectionClick, hasGeoPhotos, totalPhases, setShowGenerateConfirm, setPendingGeneratePhase, setShowClearConfirm]);

  return (
    <>
      <div className="flex items-center gap-2">
        <ActionButton 
          key="comment" 
          label="Comment" 
          icon="/dashboard/icons/comment-icon.svg" 
          variant="secondary" 
          onClick={onCommentClick} 
        />
        {workflowActions}
      </div>

      <ConfirmModal
        isOpen={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        onConfirm={() => {
          onAction("APPROVE");
          setShowApproveConfirm(false);
        }}
        title="Approve Application"
        message="Are you sure you want to approve this application?"
        confirmLabel="Approve"
      />

      <ConfirmModal
        isOpen={showForwardConfirm}
        onClose={() => setShowForwardConfirm(false)}
        onConfirm={() => {
          onAction("FORWARD");
          setShowForwardConfirm(false);
        }}
        title="Forward Application"
        message="Are you sure you want to forward this application to the departments?"
        confirmLabel="Forward"
      />

      <ConfirmModal
        isOpen={showGenerateConfirm}
        onClose={() => {
          setShowGenerateConfirm(false);
          setPendingGeneratePhase(null);
        }}
        onConfirm={() => {
          if (pendingGeneratePhase !== null) {
            onAction("GENERATE_TOKENS", undefined, { phase: pendingGeneratePhase });
          }
          setShowGenerateConfirm(false);
          setPendingGeneratePhase(null);
        }}
        title="Generate Token"
        message={`Are you sure you want to generate the token for Phase ${pendingGeneratePhase}?`}
        confirmLabel="Generate"
      />

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          onAction("CLEAR_OBJECTION");
          setShowClearConfirm(false);
        }}
        title="Clear Objection"
        message="Are you sure you want to clear this objection? The application will be restored to its pre-objection state."
        confirmLabel="Clear"
      />
    </>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel }: ConfirmModalProps) => {
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
                className="flex-1 h-[40px] rounded-lg border border-[#D6D9DE] bg-white text-sm font-semibold text-[#343434] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 h-[40px] flex items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-semibold text-white hover:bg-blue-600 transition-colors cursor-pointer"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
