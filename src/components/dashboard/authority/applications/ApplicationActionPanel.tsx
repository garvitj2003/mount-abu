"use client";

import { type components } from "@/types/api";
import Image from "next/image";
import { useMemo } from "react";

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
      className={`flex items-center justify-center gap-2.5 rounded-lg border border-solid px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 ${styles[variant]} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {icon && !loading && <Image src={icon} alt="" width={16} height={16} className={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'invert brightness-0' : ''} />}
      {loading ? "..." : label}
    </button>
  );
};

interface ApplicationActionPanelProps {
  app: ApplicationResponse;
  userRole?: UserRole;
  onAction: (action: WorkflowAction, remarks?: string) => void;
  onCommentClick?: () => void;
  onRejectClick?: () => void;
  onObjectionClick?: () => void;
  isPending?: boolean;
}

export default function ApplicationActionPanel({ 
  app, 
  userRole, 
  onAction,
  onCommentClick,
  onRejectClick,
  onObjectionClick,
  isPending = false 
}: ApplicationActionPanelProps) {
  
  const hasGeoPhotos = useMemo(() => 
    app.documents?.some(d => d.document_type === "GEO_TAGGED_PHOTO"), 
  [app.documents]);

  const workflowActions = useMemo(() => {
    if (!userRole) return [];

    const isNew = app.type === "NEW";
    const isRenovation = app.type === "RENOVATION";
    const status = app.status;

    const actionList: React.ReactNode[] = [];

    // Flow: NEW CONSTRUCTION
    if (isNew) {
      if (status === "SUBMITTED" && (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN")) {
        actionList.push(
          <ActionButton key="obj" label="Objection" icon="/dashboard/icons/warning.svg" variant="warning" onClick={onObjectionClick} />,
          <ActionButton key="rej" label="Reject" icon="/dashboard/icons/cross-round-red.svg" variant="danger" onClick={onRejectClick} />,
          <ActionButton key="app" label="Approve" variant="success" onClick={() => onAction("APPROVE")} />
        );
      }
      if (status === "APPROVED") {
        if (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="obj" label="Objection" icon="/dashboard/icons/warning.svg" variant="warning" onClick={onObjectionClick} />
          );
        }
        if ((userRole === "JEN" || userRole === "SUPERADMIN")) {
          actionList.push(
            <ActionButton 
              key="add-phase" 
              label="Add Phase" 
              icon="/dashboard/icons/applications/calendar.svg" 
              variant="primary" 
              onClick={() => {}} 
              disabled={!hasGeoPhotos}
              title={!hasGeoPhotos ? "Geo tagged photos and estimate material is not available" : ""}
            />
          );
        }
        // Assuming a flag or status for Token Generation after JEN action
        if ((userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN") && app.num_stages) {
           actionList.push(
             <ActionButton key="token" label="Generate Tokens" variant="success" onClick={() => onAction("GENERATE_TOKENS")} />
           );
        }
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
        if (userRole === "JEN") {
          actionList.push(
            <ActionButton 
              key="add-phase" 
              label="Add Phase" 
              icon="/dashboard/icons/applications/calendar.svg" 
              variant="primary" 
              onClick={() => {}} 
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
      if (status === "APPROVED") {
        if (userRole === "COMMISSIONER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="obj" label="Objection" icon="/dashboard/icons/warning.svg" variant="warning" onClick={onObjectionClick} />
          );
        }
        if (userRole === "NODAL_OFFICER" || userRole === "SUPERADMIN") {
          actionList.push(
            <ActionButton key="token" label="Generate Tokens" variant="success" onClick={() => onAction("GENERATE_TOKENS")} />
          );
        }
      }
    }

    return actionList;
  }, [userRole, app.status, app.type, app.num_stages, app.documents, onAction, onRejectClick, onObjectionClick, hasGeoPhotos]);

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
