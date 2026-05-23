"use client";

import Image from "next/image";
import { useMemo } from "react";
import { type components } from "@/types/api";

type ApplicationResponse = components["schemas"]["ApplicationResponse"];

interface Step {
  id: number;
  label: string;
  role: string;
  date?: string;
  status: "completed" | "active" | "pending" | "objection";
}

interface ApplicationStepperProps {
  app: ApplicationResponse;
}

export default function ApplicationStepper({ app }: ApplicationStepperProps) {
  const steps: Step[] = useMemo(() => {
    const isNew = app.type === "NEW";
    const status = app.status;
    const isObjection = status === "OBJECTED";
    const inspectionDone = app.inspections.length > 0;

    let s: Omit<Step, "id" | "status">[] = [];

    if (isNew) {
      s = [
        { label: "Submitted", role: "Applicant" },
        { label: "Approval", role: "Nodal Officer" },
        { label: "Inspection", role: "JEN" },
        { label: "Token Generated", role: "Nodal Officer" },
      ];
    } else {
      s = [
        { label: "Submitted", role: "Applicant" },
        { label: "Forward to Dept", role: "Commissioner" },
        { label: "Dept Comments", role: "JEN/ATP/LEGAL/LAND" },
        { label: "Approval", role: "Commissioner" },
        { label: "Inspection", role: "JEN" },
        { label: "Token Generated", role: "Nodal Officer" },
      ];
    }

    const finalSteps: Step[] = s.map((step, idx) => ({
      ...step,
      id: idx + 1,
      status: "pending",
    }));

    let currentIndex = 0;

    if (isNew) {
      // NEW: Submitted -> Approval -> Inspection -> Token Generated
      if (status === "SUBMITTED") currentIndex = 1;
      else if (status === "APPROVED") {
        currentIndex = inspectionDone ? 3 : 2;
      } else if (status === "TOKEN_GENERATED") {
        currentIndex = 4;
      } else if (isObjection) {
        // If it was already approved once, it might be at inspection
        // Default to Approval step for NEW
        currentIndex = 1;
      }
    } else {
      // RENOVATION: Submitted -> Forward to Dept -> Dept Comments -> Approval -> Inspection -> Token Generated
      if (status === "SUBMITTED") currentIndex = 1;
      else if (status === "FORWARDED") {
        const hasDeptComments = app.comments.some(
          (c) => c.comment_type !== "GENERAL" && c.commenter_name !== app.applicant_name
        );
        currentIndex = hasDeptComments ? 3 : 2;
      } else if (status === "APPROVED") {
        currentIndex = inspectionDone ? 5 : 4;
      } else if (status === "TOKEN_GENERATED") {
        currentIndex = 6;
      } else if (isObjection) {
        // Default to 'Forward to Dept' step for RENOVATION
        currentIndex = 1;
      }
    }

    for (let i = 0; i < finalSteps.length; i++) {
      if (i < currentIndex) {
        finalSteps[i].status = "completed";
      } else if (i === currentIndex) {
        if (isObjection) {
          finalSteps[i].status = "objection";
        } else {
          finalSteps[i].status = "active";
        }
      }
    }

    // Special case for Token Generated: everything is completed
    if (status === "TOKEN_GENERATED") {
      finalSteps.forEach(step => step.status = "completed");
    }

    return finalSteps;
  }, [app]);

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const totalGaps = steps.length - 1;
  const progressWidth = totalGaps > 0 ? (completedCount / totalGaps) * 100 : 100;

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white p-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] overflow-x-auto no-scrollbar">
      <div className="relative flex min-w-[900px] items-start justify-between px-10">
        {/* Connection Lines */}
        <div className="absolute top-[18px] left-[60px] right-[60px] h-[2px] bg-[#D6D9DE]" />
        <div
          className="absolute top-[18px] left-[60px] h-[2px] bg-[#0C83FF] transition-all duration-500"
          style={{ width: `calc(${Math.min(progressWidth, 100)}% - 120px)` }}
        />

        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 text-center w-[120px]">
            {/* Circle Icon */}
            <div className={`flex size-9 items-center justify-center rounded-full border-2 transition-colors ${step.status === 'completed' ? 'border-[#0C83FF] bg-[#0C83FF]' :
              step.status === 'active' ? 'border-[#0C83FF] bg-white' :
                step.status === 'objection' ? 'border-[#FFD648] bg-[#FFD648]' :
                  'border-[#D6D9DE] bg-[#D6D9DE]'
              }`}>
              {step.status === 'completed' ? (
                <Image src="/dashboard/icons/tick-round-green.svg" alt="" width={20} height={20} className="invert brightness-0" />
              ) : step.status === 'objection' ? (
                <Image src="/dashboard/icons/timer-round.svg" alt="" width={20} height={20} />
              ) : step.status === 'active' ? (
                <div className="size-3 rounded-full bg-[#0C83FF]" />
              ) : (
                <div className="size-3 rounded-full bg-[#9CA3AF]" />
              )}
            </div>

            {/* Label & Info */}
            <div className="flex flex-col gap-1">
              <p className={`text-[12px] font-semibold leading-tight ${step.status === 'pending' ? 'text-[#9CA3AF]' : 'text-[#343434]'
                }`}>
                {step.label}
              </p>
              <p className="text-[11px] font-normal text-[#9CA3AF]">
                {step.role}
              </p>
              {step.status === 'objection' && (
                <p className="text-[9px] font-bold text-[#9C832C] uppercase animate-pulse">
                  IN PROGRESS(OBJECTION)
                </p>
              )}
              {step.date && (
                <p className="text-[10px] font-normal text-[#9CA3AF]">
                  {step.date}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {app.status === "OBJECTED" && (
        <p className="text-[10px] font-normal text-[#EF4444] text-center mt-2">
          Maximum 3 Objection can be raised. after that your application will be rejected automatically.
        </p>
      )}
    </div>
  );
}
