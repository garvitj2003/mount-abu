"use client";

import Image from "next/image";
import { useMemo } from "react";
import { type components } from "@/types/api";

type ApplicationStatus = components["schemas"]["ApplicationStatus"];

interface Step {
  id: number;
  label: string;
  role: string;
  date?: string;
  status: "completed" | "active" | "pending" | "objection";
}

interface ApplicationStepperProps {
  status: ApplicationStatus;
  isObjection?: boolean;
}

export default function ApplicationStepper({ status, isObjection }: ApplicationStepperProps) {
  const steps: Step[] = useMemo(() => {
    const s: Step[] = [
      { id: 1, label: "Submitted", role: "Applicant", status: "pending" },
      { id: 2, label: "Land Verification", role: "Land Officer", status: "pending" },
      { id: 3, label: "Legal Check", role: "Legal Department", status: "pending" },
      { id: 4, label: "ATP Review", role: "ATP Authority", status: "pending" },
      { id: 5, label: "JEN Approval", role: "JEN", status: "pending" },
      { id: 6, label: "Nodal Officer approval", role: "Nodal Officer", status: "pending" },
      { id: 7, label: "Token Generated", role: "System", status: "pending" },
    ];

    // Status mapping logic
    let currentIndex = 0;
    if (status === "SUBMITTED") currentIndex = 1;
    else if (status === "FORWARDED") currentIndex = 3; // Simplified for now
    else if (status === "APPROVED") currentIndex = 6;
    else if (status === "TOKEN_GENERATED") currentIndex = 7;
    else if (status === "OBJECTED") {
        currentIndex = 5; // Usually at Nodal or Jenkins stage
        s[5].status = "objection";
    }

    for (let i = 0; i < s.length; i++) {
      if (i < currentIndex) s[i].status = "completed";
      else if (i === currentIndex && s[i].status !== "objection") s[i].status = "active";
    }

    return s;
  }, [status, isObjection]);

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white p-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] overflow-x-auto no-scrollbar">
      <div className="relative flex min-w-[900px] items-start justify-between px-10">
        {/* Connection Lines */}
        <div className="absolute top-[18px] left-[60px] right-[60px] h-[2px] bg-[#D6D9DE]" />
        <div 
          className="absolute top-[18px] left-[60px] h-[2px] bg-[#0C83FF] transition-all duration-500" 
          style={{ width: `${(steps.filter(s => s.status === 'completed').length / (steps.length - 1)) * 85}%` }}
        />

        {steps.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 text-center w-[120px]">
            {/* Circle Icon */}
            <div className={`flex size-9 items-center justify-center rounded-full border-2 transition-colors ${
              step.status === 'completed' ? 'border-[#0C83FF] bg-[#0C83FF]' :
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
              <p className={`text-[12px] font-semibold leading-tight ${
                step.status === 'pending' ? 'text-[#9CA3AF]' : 'text-[#343434]'
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

      {isObjection && (
        <p className="text-[10px] font-normal text-[#EF4444] text-center mt-2">
          Maximum 3 Objection can be raised. after that your application will be rejected automatically.
        </p>
      )}
    </div>
  );
}
