"use client";

import { type components } from "@/types/api";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import DropdownSelect from "@/components/ui/DropdownSelect";

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
  onObjectionClick?: () => void;
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
  
  const totalPhases = useMemo(() => {
    return app.phase_materials && app.phase_materials.length > 0
      ? Math.max(...app.phase_materials.map(pm => pm.phase))
      : (app.inspections?.[0]?.recommended_phases || app.num_stages || 0);
  }, [app.phase_materials, app.inspections, app.num_stages]);

  const hasGeoPhotos = useMemo(() => 
    app.inspections && app.inspections.length > 0, 
  [app.inspections]);

  const workflowActions = useMemo(() => {
    if (!userRole) return [];

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
      const isPrevCompleted = prevToken?.status === "COMPLETED";
      const isBlocked = !isAlreadyGenerated && p > 1 && !isPrevCompleted;
      
      let statusText = "";
      if (isAlreadyGenerated) {
        statusText = " (Generated)";
      } else if (isBlocked) {
        statusText = " (Blocked)";
      }

      return (
        <div className={`flex w-full justify-between items-center ${isAlreadyGenerated || isBlocked ? "opacity-40 cursor-not-allowed" : ""}`}>
          <span>{option.label}</span>
          <span className="text-[10px] italic">{statusText}</span>
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
          alert(`Token for Phase ${p - 1} must be generated and completed first`);
          return;
        }
        if (prevToken.status !== "COMPLETED") {
          alert(`Token for Phase ${p - 1} must be completed (currently ${prevToken.status.toLowerCase()})`);
          return;
        }
      }

      onAction("GENERATE_TOKENS", undefined, { phase: p });
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
          <ActionButton key="obj" label="Objection" icon="/dashboard/icons/warning.svg" variant="warning" onClick={onObjectionClick} />,
          <ActionButton key="rej" label="Reject" icon="/dashboard/icons/cross-round-red.svg" variant="danger" onClick={onRejectClick} />,
          <ActionButton key="app" label="Approve" variant="success" onClick={() => onAction("APPROVE")} />
        );
      }
      if (status === "OBJECTED" && (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN")) {
        actionList.push(
          <ActionButton key="clear-app" label="Clear Objection and Approve" variant="success" onClick={() => onAction("APPROVE")} />
        );
      }
      if (status === "APPROVED" || status === "TOKEN_GENERATED") {
        if (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="obj" label="Objection" icon="/dashboard/icons/warning.svg" variant="warning" onClick={onObjectionClick} />
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
      if (status === "SUBMITTED" && (userRole === "COMMISSIONER" || userRole === "SUPERADMIN")) {
        actionList.push(
          <ActionButton key="fwd" label="Forward to Depts" variant="primary" onClick={() => onAction("FORWARD")} />
        );
      }
      if (status === "FORWARDED") {
        if (userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="obj" label="Raise Objection" icon="/dashboard/icons/warning.svg" variant="warning" onClick={onObjectionClick} />
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
        if (userRole === "COMMISSIONER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="rej" label="Reject" icon="/dashboard/icons/cross-round-red.svg" variant="danger" onClick={onRejectClick} />,
            <ActionButton key="app" label="Approve Application" variant="success" onClick={() => onAction("APPROVE")} />
          );
        }
      }
      if (status === "OBJECTED" && (userRole === "COMMISSIONER" || userRole === "SUPERADMIN")) {
        actionList.push(
          <ActionButton key="clear-app" label="Clear Objection and Approve" variant="success" onClick={() => onAction("APPROVE")} />
        );
      }
      if (status === "APPROVED" || status === "TOKEN_GENERATED") {
        if (userRole === "COMMISSIONER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="obj" label="Objection" icon="/dashboard/icons/warning.svg" variant="warning" onClick={onObjectionClick} />
          );
        }
        pushGenerateTokenButtons();
      }
    }

    return actionList;
  }, [userRole, app.status, app.type, app.num_stages, app.inspections, app.phase_materials, app.tokens, onAction, onRejectClick, onObjectionClick, hasGeoPhotos, totalPhases]);

  return (
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
  );
}
