"use client";

import { useApplication } from "@/hooks/useApplications";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type components } from "@/types/api";
import CommentsDrawer from "@/components/dashboard/authority/applications/CommentsDrawer";
import ApplicationStepper from "@/components/dashboard/citizen/applications/ApplicationStepper";
import ApplicationMaterialsDrawer from "@/components/dashboard/citizen/applications/ApplicationMaterialsDrawer";

type ApplicationResponse = components["schemas"]["ApplicationResponse"];

// --- Components ---

const StatusBadge = ({ status }: { status: components["schemas"]["ApplicationStatus"] }) => {
  const config = {
    PENDING: { bg: "bg-gray-100", text: "text-gray-600", label: "Pending" },
    SUBMITTED: { bg: "bg-blue-100", text: "text-blue-600", label: "Submitted" },
    APPROVED: { bg: "bg-green-100", text: "text-green-600", label: "Approved" },
    FORWARDED: { bg: "bg-[#FFD648]", text: "text-[#343434]", label: "Under Review" },
    WITHHELD: { bg: "bg-orange-100", text: "text-orange-600", label: "Withheld" },
    OBJECTED: { bg: "bg-[#EF4444]", text: "text-white", label: "Objection" },
    REJECTED: { bg: "bg-red-100", text: "text-red-600", label: "Rejected" },
    TOKEN_GENERATED: { bg: "bg-green-600", text: "text-white", label: "Token Generated" },
    WITHDRAWN: { bg: "bg-gray-400", text: "text-white", label: "Withdrawn" },
  };

  const active = config[status] || config.PENDING;

  return (
    <div className={`flex items-center gap-1.5 rounded px-2 py-1 ${active.bg}`}>
      <span className={`text-[12px] font-medium leading-none ${active.text}`}>{active.label}</span>
    </div>
  );
};

const Header = ({ app, onBack, onCommentClick, onViewDetailsClick }: { 
  app: ApplicationResponse; 
  onBack: () => void;
  onCommentClick: () => void;
  onViewDetailsClick: () => void;
}) => {
  return (
    <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.13)]">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
          <Image src="/dashboard/icons/applications/arrow-back.svg" alt="Back" width={24} height={24} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-medium text-[#343434]">
              APP-{app.id.toString().padStart(5, '0')}
            </h1>
            <StatusBadge status={app.status === "OBJECTED" ? "FORWARDED" : app.status} />
            {app.status === "OBJECTED" && <StatusBadge status="OBJECTED" />}
          </div>
          <p className="text-[12px] font-normal text-[#343434] opacity-80">
            All your new construction and renovation applications go here.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onViewDetailsClick}
          className="flex items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2.5 text-sm font-medium text-[#343434] hover:bg-gray-100 transition-colors cursor-pointer relative"
        >
          <Image src="/dashboard/icons/applications.svg" alt="" width={16} height={16} />
          View Pictures & Material Details
          <div className="absolute -top-1 -right-1 size-3.5 rounded-full bg-[#EF4444] border-2 border-white" />
        </button>
        <button 
          onClick={onCommentClick}
          className="flex items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2.5 text-sm font-medium text-[#343434] hover:bg-gray-100 transition-colors cursor-pointer relative"
        >
          <Image src="/dashboard/icons/comment-icon.svg" alt="" width={16} height={16} />
          Comments
          <div className="absolute -top-1 -right-1 size-3.5 rounded-full bg-[#EF4444] border-2 border-white" />
        </button>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string | null | undefined | boolean }) => (
  <div className="flex flex-col gap-1 w-full">
    <p className="text-[10px] font-normal text-[#343434] opacity-60 uppercase">{label}</p>
    <p className="text-[12px] font-normal text-[#343434] leading-tight">
      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || "—")}
    </p>
  </div>
);

const DetailsCard = ({ app }: { app: ApplicationResponse }) => {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-[#D6D9DE] bg-white p-6 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-start gap-10">
        <div className="w-[200px] shrink-0">
          <p className="text-[12px] font-normal text-[#343434]">Application Details</p>
        </div>
        
        <div className="flex flex-1 flex-col gap-8">
          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-5">
            <DetailItem label="Applicant name (As per aadhar only)" value={app.applicant_name} />
            <DetailItem label="Father’s name (As per aadhar only)" value={app.father_name} />
            <DetailItem label="Contact Number" value={app.mobile} />
            <DetailItem label="Email" value={app.email} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-5">
            <DetailItem label="Is this property on agriculture land?" value={app.is_agriculture_land} />
            <DetailItem label="Property usage" value={app.property_usage} />
            <DetailItem label="Type of work" value={app.type} />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-5">
            <DetailItem label="Location" value={app.ward_zone} />
            <DetailItem label="Department" value={app.department_id?.toString()} />
            <DetailItem label="Ward" value={app.ward_id?.toString()} />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-5">
            <DetailItem label="Current Address" value={app.current_address} />
            <DetailItem label="New Construction/Renovation address" value={app.property_address} />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-5">
            <DetailItem label="Type of work" value={app.type} />
            <DetailItem label="Work Description" value={app.work_description} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CitizenApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: app, isLoading, error } = useApplication(id);
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);

  if (isLoading) return (
    <div className="flex h-full w-full items-center justify-center bg-[#F5F6F7]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
    </div>
  );

  if (error || !app) return (
    <div className="flex h-full w-full items-center justify-center bg-[#F5F6F7]">
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg font-medium text-[#EF4444]">Error loading application.</p>
        <button onClick={() => router.back()} className="rounded-lg bg-white border border-[#D6D9DE] px-4 py-2 text-sm">Go Back</button>
      </div>
    </div>
  );

  // If status is PENDING, we should probably redirect or show a different view
  // But the requirement said "not pending upon clicking on the id"
  // So I'll just render the details.

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative overflow-y-auto">
      <Header 
        app={app} 
        onBack={() => router.back()} 
        onCommentClick={() => setIsCommentsOpen(true)}
        onViewDetailsClick={() => setIsMaterialsOpen(true)}
      />

      <div className="flex flex-col gap-5 p-5">
        {app.status === "OBJECTED" && (
          <div className="flex items-center gap-2 rounded-lg border border-[#EF4444] bg-[#FDECEC] p-4">
            <Image src="/dashboard/icons/warning.svg" alt="" width={16} height={16} className="invert brightness-0 sepia-[1] saturate-[10000%] hue-rotate-[0deg]" />
            <p className="text-[12px] font-medium text-[#EF4444]">
              Maximum 3 Objection can be raised. after that your application will be rejected automatically.
            </p>
          </div>
        )}

        <ApplicationStepper status={app.status} isObjection={app.status === "OBJECTED"} />

        <DetailsCard app={app} />
      </div>

      <CommentsDrawer 
        isOpen={isCommentsOpen} 
        onClose={() => setIsCommentsOpen(false)} 
        applicationId={id}
        applicationNumber={`APP-${app.id.toString().padStart(5, '0')}`}
      />

      <ApplicationMaterialsDrawer
        isOpen={isMaterialsOpen}
        onClose={() => setIsMaterialsOpen(false)}
        app={app}
      />
    </div>
  );
}
