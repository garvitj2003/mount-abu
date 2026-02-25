"use client";

import { useApplication, useWorkflowAction } from "@/hooks/useApplications";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type components } from "@/types/api";
import ApplicationActionPanel from "@/components/dashboard/authority/applications/ApplicationActionPanel";
import CommentsDrawer from "@/components/dashboard/authority/applications/CommentsDrawer";

type ApplicationResponse = components["schemas"]["ApplicationResponse"];
type UserRole = components["schemas"]["UserRole"];
type WorkflowAction = components["schemas"]["WorkflowAction"];

// --- Components ---

const isImage = (doc: components["schemas"]["ApplicationDocumentResponse"]) => {
  const imageTypes = ["APPLICANT_PHOTO", "PROPERTY_PHOTOS", "SITE_INSPECTION", "GEO_TAGGED_PHOTO"];
  if (imageTypes.includes(doc.document_type)) return true;
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.access_url || doc.document_path || "");
};

const ActionButton = ({ 
  label, 
  icon, 
  onClick, 
  variant = "secondary" 
}: { 
  label: string; 
  icon?: string; 
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "warning" | "success";
}) => {
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
      className={`flex items-center justify-center gap-2.5 rounded-lg border border-solid px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 ${styles[variant]}`}
    >
      {icon && <Image src={icon} alt="" width={16} height={16} className={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'invert brightness-0' : ''} />}
      {label}
    </button>
  );
};

const Header = ({ 
  app, 
  userRole, 
  onBack,
  onAction,
  onCommentClick
}: { 
  app: ApplicationResponse; 
  userRole?: UserRole; 
  onBack: () => void;
  onAction: (action: WorkflowAction, remarks?: string) => void;
  onCommentClick?: () => void;
}) => {
  const warning = useMemo(() => {
    if (userRole !== 'SUPERADMIN' && userRole !== 'JEN') return null;

    const hasGeo = app.documents?.some(d => d.document_type === 'GEO_TAGGED_PHOTO');
    const hasJen = app.num_stages !== null && app.num_stages > 0;
    
    if (!hasGeo && !hasJen) return "Missing Geo-Photos & JEN Estimates";
    if (!hasGeo) return "Missing Geo-Photos";
    if (!hasJen) return "Pending JEN Estimates";
    return null;
  }, [app, userRole]);

  return (
    <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.13)]">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
          <Image src="/dashboard/icons/applications/arrow-back.svg" alt="Back" width={24} height={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-base font-medium text-[#343434]">
            #{app.id.toString().padStart(5, '0')} (
            {warning ? (
              <span className="text-[#EF4444] font-semibold animate-pulse">{warning}</span>
            ) : (
              userRole?.replace('_', ' ').toLowerCase()
            )})
          </h1>
          <p className="text-[12px] font-normal text-[#343434] opacity-80">
            Review, verify, and approve citizen construction and renovation applications.
          </p>
        </div>
      </div>

      <ApplicationActionPanel 
        app={app} 
        userRole={userRole} 
        onAction={onAction} 
        onCommentClick={onCommentClick}
      />
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

const Sidebar = ({ app }: { app: ApplicationResponse }) => {
  return (
    <div className="flex w-[238px] flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white p-5 h-fit sticky top-[80px]">
      <h2 className="text-[12px] font-bold text-[#343434] uppercase tracking-wider">Application Details</h2>
      
      <div className="flex flex-col gap-5">
        <DetailItem label="Applicant name" value={app.applicant_name} />
        <DetailItem label="Father's name" value={app.father_name} />
        <DetailItem label="Contact Number" value={app.mobile} />
        <DetailItem label="Email" value={app.email} />
        
        <div className="h-px w-full bg-[#D6D9DE] my-1" />
        
        <DetailItem label="Current Address" value={app.current_address} />
        <DetailItem label="Construction Address" value={app.property_address} />
        
        <div className="h-px w-full bg-[#D6D9DE] my-1" />
        
        <DetailItem label="Agriculture Land" value={app.is_agriculture_land} />
        <DetailItem label="Property Usage" value={app.property_usage} />
        <DetailItem label="Type of Work" value={app.type} />
        
        <div className="h-px w-full bg-[#D6D9DE] my-1" />
        
        <DetailItem label="Location" value={app.ward_zone} />
        <DetailItem label="Department" value={app.department_id?.toString()} />
        <DetailItem label="Ward" value={app.ward_id?.toString()} />
      </div>
    </div>
  );
};

const DocumentCard = ({ doc }: { doc: components["schemas"]["ApplicationDocumentResponse"] }) => {
  const isImg = isImage(doc);
  const label = doc.document_type.replace(/_/g, " ").toLowerCase();

  return (
    <div className="flex h-[120px] flex-col gap-2 rounded-lg border border-[#D6D9DE] bg-white p-2 transition-all hover:border-[#0C83FF] cursor-pointer group">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded bg-[#F9FAFB]">
        {isImg ? (
          <Image
            src={doc.access_url || "/sample/application-main.png"}
            alt={doc.document_type}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Image
              src="/dashboard/icons/applications.svg"
              alt="PDF"
              width={32}
              height={32}
              className="opacity-40 group-hover:opacity-100 transition-opacity"
            />
            <span className="rounded bg-red-50 px-1 text-[8px] font-bold text-red-500 uppercase tracking-tighter">
              PDF
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-1">
        <p className="max-w-[100px] truncate text-[10px] font-semibold capitalize text-[#343434]">
          {label}
        </p>
        <a
          href={doc.access_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] font-semibold text-[#0C83FF] hover:underline"
        >
          View
        </a>
      </div>
    </div>
  );
};

const MainContent = ({ app }: { app: ApplicationResponse }) => {
  const attachedDocs = useMemo(() => {
    const docs = app.documents?.filter((d) => d.document_type !== "GEO_TAGGED_PHOTO") || [];
    // Sort: PDF (non-image) first, then Images
    return [...docs].sort((a, b) => {
      const aImg = isImage(a);
      const bImg = isImage(b);
      if (aImg && !bImg) return 1;
      if (!aImg && bImg) return -1;
      return 0;
    });
  }, [app.documents]);

  const geoTaggedDocs = useMemo(() => {
    return app.documents?.filter((d) => d.document_type === "GEO_TAGGED_PHOTO") || [];
  }, [app.documents]);

  return (
    <div className="flex flex-1 flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white p-5">
      {/* Work Description */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-normal text-[#343434] opacity-60 uppercase">Work Description</p>
        <p className="text-[12px] font-normal text-[#343434] leading-relaxed">
          {app.work_description || "No description provided."}
        </p>
      </div>

      {/* Attached Documents */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[12px] font-semibold text-[#4BB5AB] uppercase">Attached Documents</h3>
        <div className="grid grid-cols-4 gap-3">
          {attachedDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
          {!attachedDocs.length && (
            <p className="text-xs text-gray-400 col-span-4 italic py-4">No documents attached.</p>
          )}
        </div>
      </div>

      {/* Geo-Tagged Pictures */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[12px] font-semibold text-[#4BB5AB] uppercase">Geo-Tagged Pictures</h3>
        <div className="grid grid-cols-4 gap-3">
          {geoTaggedDocs.map((doc) => (
            <div key={doc.id} className="aspect-video relative rounded-lg border border-[#D6D9DE] overflow-hidden bg-gray-100 group cursor-pointer hover:border-[#0C83FF] transition-all">
               <Image src={doc.access_url || "/sample/application-main.png"} alt="Geo-tagged" fill unoptimized className="object-cover" />
               <div className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-sm">
                  <Image src="/dashboard/icons/applications/visibility-public.svg" alt="" width={12} height={12} />
               </div>
            </div>
          ))}
          {!geoTaggedDocs.length && (
            <p className="text-xs text-gray-400 col-span-4 italic py-4">No geo-tagged pictures available.</p>
          )}
        </div>
      </div>

      {/* Material Details */}
      <div className="flex flex-col gap-3 mt-5">
        <h3 className="text-[12px] font-bold text-[#343434] uppercase tracking-wider">Material Details</h3>
        <div className="w-full overflow-x-auto rounded-lg border border-[#D6D9DE]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D6D9DE] bg-gray-50">
                <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Material Name</th>
                <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Estimated Material</th>
                <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Estimated by JEN</th>
                <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase bg-[#E7F3FF] border-r border-[#D6D9DE]">Phase 1</th>
                <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase bg-[#FFEEB4]">Phase 2</th>
              </tr>
            </thead>
            <tbody>
              {app.materials?.map((mat) => (
                <tr key={mat.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm font-medium text-[#343434] border-r border-[#D6D9DE]">{mat.material_id} {/* Map to name later */}</td>
                  <td className="p-3 text-sm font-medium text-[#343434] border-r border-[#D6D9DE]">{mat.quantity} Units</td>
                  <td className="p-3 text-sm font-medium text-[#343434] border-r border-[#D6D9DE]">
                    <div className="rounded border border-[#D6D9DE] px-3 py-1.5 bg-white text-xs">—</div>
                  </td>
                  <td className="p-3 text-sm font-medium text-black bg-[#E7F3FF] border-r border-[#D6D9DE]">—</td>
                  <td className="p-3 text-sm font-medium text-black bg-[#FFEEB4]">—</td>
                </tr>
              ))}
              {!app.materials?.length && (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400 text-sm italic">No material requirements specified.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NotificationBanner = () => (
  <div className="flex w-full items-center justify-between rounded-lg border border-[#72B7FF] bg-[#E7F3FF] px-5 py-3 overflow-hidden">
    <p className="text-[10px] font-normal text-[#0C83FF]">
      Applicant has requested for extra material for this application
    </p>
    <button className="rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors shrink-0">
      Review Now
    </button>
  </div>
);

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: user } = useUser();
  const { data: app, isLoading, error } = useApplication(id);
  const workflowAction = useWorkflowAction();
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleAction = async (action: WorkflowAction, remarks?: string) => {
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this application?`)) return;
    
    try {
      await workflowAction.mutateAsync({ 
        id, 
        data: { action, remarks: remarks || `Action ${action} performed by ${user?.role}` } 
      });
      alert(`Application ${action.toLowerCase()}ed successfully.`);
    } catch (err) {
      console.error("Action failed", err);
      alert("Failed to perform action. Please try again.");
    }
  };

  if (isLoading) return (
    <div className="flex h-full w-full items-center justify-center bg-[#F5F6F7]">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
        <p className="text-sm font-medium text-[#343434]">Loading application details...</p>
      </div>
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

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative overflow-y-auto">
      <Header 
        app={app} 
        userRole={user?.role as UserRole} 
        onBack={() => router.back()} 
        onAction={handleAction}
        onCommentClick={() => setIsCommentsOpen(true)}
      />

      <div className="flex flex-1 gap-5 p-5">
        <Sidebar app={app} />

        <div className="flex flex-1 flex-col gap-5">
          {/* Placeholder for "Extra Material" logic */}
          {false && <NotificationBanner />}

          <MainContent app={app} />
        </div>
      </div>

      <CommentsDrawer 
        isOpen={isCommentsOpen} 
        onClose={() => setIsCommentsOpen(false)} 
        applicationId={id}
        applicationNumber={`#${app.id.toString().padStart(5, '0')}`}
      />
    </div>
  );
}
