"use client";

import { useAddComment, useApplication, useWorkflowAction, useAddPhaseMaterials } from "@/hooks/useApplications";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { type components } from "@/types/api";
import ApplicationActionPanel from "@/components/dashboard/authority/applications/ApplicationActionPanel";
import CommentsDrawer from "@/components/dashboard/authority/applications/CommentsDrawer";
import ActionRemarksModal from "@/components/dashboard/authority/applications/ActionRemarksModal";
import AddPhaseDrawer from "@/components/dashboard/authority/applications/AddPhaseDrawer";

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
  onCommentClick,
  onRejectClick,
  onObjectionClick,
  onAddPhaseClick
}: {
  app: ApplicationResponse;
  userRole?: UserRole;
  onBack: () => void;
  onAction: (action: WorkflowAction, remarks?: string) => void;
  onCommentClick?: () => void;
  onRejectClick?: () => void;
  onObjectionClick?: (role: string) => void;
  onAddPhaseClick?: () => void;
}) => {
  const warning = useMemo(() => {
    if (userRole !== 'SUPERADMIN' && userRole !== 'JEN') return null;

    const noInspection = app.inspections.length == 0;
    const noEstimates = app.phase_materials.length == 0;

    if (noInspection) return "Missing Geo-Photos & JEN Estimates";
    if (noEstimates) return "Pending JEN Estimates";
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
        onRejectClick={onRejectClick}
        onObjectionClick={onObjectionClick}
        onAddPhaseClick={onAddPhaseClick}
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

const StatusBadge = ({ status }: { status: components["schemas"]["ApplicationStatus"] }) => {
  let bgColor = "";
  let textColor = "";
  let label = status.replace("_", " ");

  switch (status) {
    case "PENDING":
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      break;
    case "SUBMITTED":
      bgColor = "bg-[#FFEEB4]";
      textColor = "text-[#9C832C]";
      label = "Under Review";
      break;
    case "FORWARDED":
      bgColor = "bg-[#FFEEB4]";
      textColor = "text-[#9C832C]";
      label = "Pending Dep Review";
      break;
    case "APPROVED":
    case "TOKEN_GENERATED":
      bgColor = "bg-[#99D4C2]";
      textColor = "text-[#04694A]";
      label = status === "TOKEN_GENERATED" ? "Token Issued" : "Approved";
      break;
    case "OBJECTED":
      bgColor = "bg-orange-100";
      textColor = "text-orange-700";
      label = "Objection";
      break;
    case "REJECTED":
      bgColor = "bg-[#F8B2B2]";
      textColor = "text-[#922929]";
      break;
    case "WITHHELD":
      bgColor = "bg-purple-100";
      textColor = "text-purple-700";
      break;
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded px-2 py-1 w-fit ${bgColor}`}
    >
      <span className={`text-[11px] font-normal capitalize ${textColor}`}>{label.toLowerCase()}</span>
    </div>
  );
};

const Sidebar = ({ app }: { app: ApplicationResponse }) => {
  return (
    <div className="flex w-[238px] flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white p-5 h-fit sticky top-[80px]">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[12px] font-bold text-[#343434] uppercase tracking-wider">Application Details</h2>
        <StatusBadge status={app.status} />
      </div>

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
        {app.organization_name && <DetailItem label="Organization Name" value={app.organization_name} />}
        <DetailItem label="Type of Work" value={app.type.toLowerCase() === "new" ? 'New Construction' : app.type.toLowerCase() === "renovation" ? 'Repair & Renovation' : ''} />
        <DetailItem label="Jurisdiction" value={app.jurisdiction_zone === "ULB" ? "Urban" : app.jurisdiction_zone === "UIT" ? "Rural" : "—"} />
        <DetailItem label="Contractor Name" value={app.contractor_name} />
        <DetailItem label="Existing Structure" value={app.existing_structure} />
        <DetailItem label="Proposed Construction Floor" value={app.construction_floor} />

        <div className="h-px w-full bg-[#D6D9DE] my-1" />

        <DetailItem label="Location" value={app.ward_zone} />
        <DetailItem label="Department" value={app.department_id?.toString()} />
        <DetailItem label="Ward" value={app.ward_id?.toString()} />
      </div>
    </div>
  );
};

const ImageViewerModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: { url: string; title?: string; subtitle?: string }[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
      if (e.key === "ArrowRight") onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onIndexChange, onClose]);

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/90 backdrop-blur-xs p-6"
    >
      {/* Top Bar: Title & Close Button */}
      <div className="flex w-full items-center justify-between z-20">
        <div className="text-white/80 text-xs font-semibold">
          {currentImage.title || "Image Viewer"}
        </div>
        <button
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div onClick={(e) => e.stopPropagation()} className="relative flex max-h-[70vh] max-w-[85vw] flex-col items-center justify-center my-auto">
        <img
          src={currentImage.url}
          alt={currentImage.title || "Preview"}
          className="max-h-[70vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
        />
      </div>

      {/* Fixed Bottom Toolbar: Prev/Next & Counter */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="z-20 flex flex-col items-center gap-2"
      >
        {currentImage.subtitle && (
          <p className="text-[11px] text-white/70 italic text-center max-w-md line-clamp-1">
            {currentImage.subtitle}
          </p>
        )}

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 shadow-xl">
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white hover:bg-white/30 text-xs font-medium transition-all cursor-pointer"
              title="Previous Image (Left Arrow)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Previous
            </button>
          )}

          <span className="text-xs font-semibold text-white px-2">
            {currentIndex + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white hover:bg-white/30 text-xs font-medium transition-all cursor-pointer"
              title="Next Image (Right Arrow)"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentCard = ({
  doc,
  onViewImage,
}: {
  doc: components["schemas"]["ApplicationDocumentResponse"];
  onViewImage?: () => void;
}) => {
  const isImg = isImage(doc);
  const label = doc.document_type.replace(/_/g, " ").toLowerCase();

  return (
    <div
      onClick={() => {
        if (isImg && onViewImage) {
          onViewImage();
        }
      }}
      className="flex h-[120px] flex-col gap-2 rounded-lg border border-[#D6D9DE] bg-white p-2 transition-all hover:border-[#0C83FF] cursor-pointer group"
    >
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
        {isImg && onViewImage ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewImage();
            }}
            className="text-[10px] font-semibold text-[#0C83FF] hover:underline cursor-pointer"
          >
            View
          </button>
        ) : (
          <a
            href={doc.access_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] font-semibold text-[#0C83FF] hover:underline"
          >
            View
          </a>
        )}
      </div>
    </div>
  );
};

const MainContent = ({ app }: { app: ApplicationResponse }) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | "all">("all");
  const [viewerConfig, setViewerConfig] = useState<{
    isOpen: boolean;
    index: number;
    list: { url: string; title?: string; subtitle?: string }[];
  }>({
    isOpen: false,
    index: 0,
    list: [],
  });

  const numStagesToDisplay = useMemo(() => {
    if (app.phase_materials && app.phase_materials.length > 0) {
      return Math.max(...app.phase_materials.map(pm => pm.phase));
    }
    return app.inspections?.[0]?.recommended_phases || app.num_stages || 0;
  }, [app.phase_materials, app.inspections, app.num_stages]);

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

  const attachedDocImages = useMemo(() => {
    return attachedDocs
      .filter((d) => isImage(d))
      .map((d) => ({
        url: d.access_url || d.document_path || "",
        title: d.document_type.replace(/_/g, " "),
        subtitle: d.document_name || undefined,
      }));
  }, [attachedDocs]);

  const inspectionPhotos = useMemo(() => {
    return app.inspections?.flatMap(ins =>
      (ins.access_urls || []).map(url => ({
        url,
        remarks: ins.remarks,
        inspector: ins.inspector_name || `Inspector #${ins.inspected_by}`,
        date: ins.inspected_at
      }))
    ) || [];
  }, [app.inspections]);

  const inspectionPhotoList = useMemo(() => {
    return inspectionPhotos.map((photo) => ({
      url: photo.url || "",
      title: photo.remarks || "Site Photo",
      subtitle: `By ${photo.inspector} on ${new Date(photo.date).toLocaleDateString()}`,
    }));
  }, [inspectionPhotos]);

  const hasInspections = useMemo(() => {
    return (app.inspections && app.inspections.length > 0) || inspectionPhotos.length > 0;
  }, [app.inspections, inspectionPhotos]);

  const hasTokens = useMemo(() => {
    return (app.tokens && app.tokens.length > 0) || (app.phase_materials && app.phase_materials.length > 0);
  }, [app.tokens, app.phase_materials]);

  const [activeTab, setActiveTab] = useState<"work" | "inspection" | "tokens">("work");

  const mergedMaterialsToDisplay = useMemo(() => {
    const list: {
      key: string;
      material_id?: number | null;
      name: string;
      unit: string;
      isCustom: boolean;
      requestedQty: number;
    }[] = [];

    app.materials?.forEach((m) => {
      const isCustom = !m.material_id;
      const name = isCustom ? m.custom_name || "" : m.material_name || "";
      const unit = isCustom ? m.custom_unit || "" : m.unit || "";
      const key = isCustom ? `custom-${name.toLowerCase()}` : `master-${m.material_id}`;

      list.push({
        key,
        material_id: m.material_id,
        name,
        unit,
        isCustom,
        requestedQty: m.quantity,
      });
    });

    app.phase_materials?.forEach((pm) => {
      const isCustom = !pm.material_id;
      const key = isCustom ? `custom-${(pm.custom_name || "").toLowerCase()}` : `master-${pm.material_id}`;

      const exists = list.some(item => item.key === key);
      if (!exists) {
        const name = isCustom ? pm.custom_name || "" : pm.material_name || "";
        const unit = isCustom ? pm.custom_unit || "" : pm.unit || "";
        list.push({
          key,
          material_id: pm.material_id,
          name,
          unit,
          isCustom,
          requestedQty: 0,
        });
      }
    });

    return list;
  }, [app.materials, app.phase_materials]);

  return (
    <div className="flex flex-1 flex-col gap-5 rounded-lg border border-[#D6D9DE] bg-white p-5">
      {/* Tabs Header */}
      <div className="flex items-center gap-2.5 border-b border-[#D6D9DE] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("work")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "work"
              ? "bg-[#0C83FF] text-white shadow-xs font-bold"
              : "bg-[#F3F4F6] text-[#343434] hover:bg-[#E5E7EB] hover:text-black"
          }`}
        >
          Work Description & Materials
        </button>

        <button
          type="button"
          onClick={() => hasInspections && setActiveTab("inspection")}
          disabled={!hasInspections}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            !hasInspections
              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
              : activeTab === "inspection"
              ? "bg-[#0C83FF] text-white shadow-xs cursor-pointer font-bold"
              : "bg-[#F3F4F6] text-[#343434] hover:bg-[#E5E7EB] hover:text-black cursor-pointer"
          }`}
        >
          Inspection
        </button>

        <button
          type="button"
          onClick={() => hasTokens && setActiveTab("tokens")}
          disabled={!hasTokens}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            !hasTokens
              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
              : activeTab === "tokens"
              ? "bg-[#0C83FF] text-white shadow-xs cursor-pointer font-bold"
              : "bg-[#F3F4F6] text-[#343434] hover:bg-[#E5E7EB] hover:text-black cursor-pointer"
          }`}
        >
          Tokens
        </button>
      </div>

      {/* Tab 1: Work Description */}
      {activeTab === "work" && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-normal text-[#343434] opacity-60 uppercase">Work Description</p>
            <p className="text-[12px] font-normal text-[#343434] leading-relaxed">
              {app.work_description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-[#4BB5AB] uppercase">Attached Documents</h3>
            <div className="grid grid-cols-4 gap-3">
              {attachedDocs.map((doc) => {
                const imgIdx = attachedDocImages.findIndex(img => img.url === (doc.access_url || doc.document_path));
                return (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onViewImage={imgIdx !== -1 ? () => setViewerConfig({ isOpen: true, index: imgIdx, list: attachedDocImages }) : undefined}
                  />
                );
              })}
              {!attachedDocs.length && (
                <p className="text-xs text-gray-400 col-span-4 italic py-4">No documents attached.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-bold text-[#343434] uppercase tracking-wider">Material Details</h3>

              {numStagesToDisplay > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#343434] font-medium font-onest">Filter by Phase:</label>
                  <div className="relative h-[30px] w-[140px]">
                    <select
                      value={selectedPhaseFilter}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedPhaseFilter(val === "all" ? "all" : parseInt(val));
                      }}
                      className="h-full w-full appearance-none rounded-lg border border-[#D6D9DE] bg-white px-3 py-1 pr-8 text-xs text-[#343434] outline-none focus:border-[#0C83FF] font-onest"
                    >
                      <option value="all">All Phases</option>
                      {Array.from({ length: numStagesToDisplay }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Phase {i + 1}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={8} height={5} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full overflow-x-auto rounded-lg border border-[#D6D9DE]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D6D9DE] bg-gray-50">
                    <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Material Name</th>
                    <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Requested Material</th>
                    <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Estimated by JEN</th>
                    {Array.from({ length: numStagesToDisplay })
                      .map((_, i) => i + 1)
                      .filter((p) => selectedPhaseFilter === "all" || selectedPhaseFilter === p)
                      .map((p) => (
                        <th
                          key={p}
                          className={`p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE] last:border-r-0 ${[
                            "bg-[#E7F3FF]",
                            "bg-[#FFEEB4]",
                            "bg-[#E6F7F5]",
                            "bg-[#FFF1F0]",
                            "bg-[#F0F7FF]",
                          ][(p - 1) % 5]
                            }`}
                        >
                          Phase {p}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {mergedMaterialsToDisplay.map((item) => {
                    const jenTotal = app.phase_materials
                      ?.filter(pm => {
                        if (item.isCustom) {
                          return !pm.material_id && pm.custom_name?.toLowerCase() === item.name.toLowerCase();
                        } else {
                          return pm.material_id === item.material_id;
                        }
                      })
                      .reduce((acc, curr) => acc + curr.quantity, 0) || 0;

                    return (
                      <tr key={item.key} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm font-medium text-[#343434] border-r border-[#D6D9DE]">
                          {item.name}
                          {item.isCustom && <span className="ml-2 rounded bg-orange-50 px-1.5 py-0.5 text-[9px] font-medium text-orange-600 border border-orange-200">Custom</span>}
                        </td>
                        <td className="p-3 text-sm font-medium text-[#343434] border-r border-[#D6D9DE]">
                          {item.requestedQty > 0 ? `${item.requestedQty} ${item.unit && item.unit}` : "—"}
                        </td>
                        <td className="p-3 text-sm font-medium text-[#343434] border-r border-[#D6D9DE]">
                          <div className={`rounded border px-3 py-1.5 text-xs font-bold ${jenTotal > 0 ? "bg-white border-[#D6D9DE] text-[#0C83FF]" : "bg-gray-50 border-transparent text-gray-400"
                            }`}>
                            {jenTotal > 0 ? `${jenTotal} ${item.unit}` : "—"}
                          </div>
                        </td>
                        {Array.from({ length: numStagesToDisplay })
                          .map((_, i) => i + 1)
                          .filter((p) => selectedPhaseFilter === "all" || selectedPhaseFilter === p)
                          .map((phaseNum) => {
                            const phaseQty = app.phase_materials?.find(pm => {
                              if (item.isCustom) {
                                return !pm.material_id && pm.custom_name?.toLowerCase() === item.name.toLowerCase() && pm.phase === phaseNum;
                              } else {
                                return pm.material_id === item.material_id && pm.phase === phaseNum;
                              }
                            })?.quantity;

                            return (
                              <td
                                key={phaseNum}
                                className={`p-3 text-sm font-medium text-black border-r border-[#D6D9DE] last:border-r-0 ${[
                                  "bg-[#E7F3FF]",
                                  "bg-[#FFEEB4]",
                                  "bg-[#E6F7F5]",
                                  "bg-[#FFF1F0]",
                                  "bg-[#F0F7FF]",
                                ][(phaseNum - 1) % 5]
                                  }`}
                              >
                                {phaseQty !== undefined ? `${phaseQty} ${item.unit}` : "—"}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
                  {!mergedMaterialsToDisplay.length && (
                    <tr>
                      <td
                        colSpan={3 + (selectedPhaseFilter === "all" ? numStagesToDisplay : 1)}
                        className="p-10 text-center text-gray-400 text-sm italic"
                      >
                        No material requirements specified.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Inspection */}
      {activeTab === "inspection" && (
        <div className="flex flex-col gap-6">
          {app.inspections && app.inspections.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-[#343434] uppercase tracking-wider">Site Inspection Reports</h3>
              <div className="grid grid-cols-1 gap-4">
                {app.inspections.map((insp) => (
                  <div key={insp.id} className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-full bg-[#E7F3FF] text-[#0C83FF]">
                          <Image src="/dashboard/icons/applications/visibility-public.svg" alt="" width={14} height={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#343434]">{insp.inspector_name || `Inspector #${insp.inspected_by}`}</p>
                          <p className="text-[10px] text-gray-500 font-medium">Field Inspector / JEN</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#343434]">
                          Recommended Phases: <strong className="text-[#0C83FF] font-bold">{insp.recommended_phases || "—"}</strong>
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(insp.inspected_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {insp.remarks && (
                      <div className="rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] p-3 text-xs text-[#343434]">
                        <span className="font-semibold text-gray-500 block text-[10px] uppercase tracking-wider mb-1">Inspector Remarks</span>
                        <p className="leading-relaxed">{insp.remarks}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#343434] uppercase tracking-wider">Geo-Tagged Site Photos</h3>
            <div className="grid grid-cols-4 gap-3">
              {inspectionPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setViewerConfig({ isOpen: true, index: idx, list: inspectionPhotoList })}
                  className="aspect-video relative rounded-lg border border-[#D6D9DE] overflow-hidden bg-gray-100 group cursor-pointer hover:border-[#0C83FF] transition-all block"
                >
                  <Image
                    src={photo.url || "/sample/application-main.png"}
                    alt="Geo-tagged"
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <div className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-xs">
                    <Image
                      src="/dashboard/icons/applications/visibility-public.svg"
                      alt=""
                      width={12}
                      height={12}
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                    <p className="text-[8px] text-white font-medium line-clamp-2">
                      {photo.remarks}
                    </p>

                    <p className="text-[7px] text-white/70 italic">
                      By {photo.inspector} on{" "}
                      {new Date(photo.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {!inspectionPhotos.length && (
                <p className="text-xs text-gray-400 col-span-4 italic py-4">No site photos uploaded.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tokens */}
      {activeTab === "tokens" && (
        <div className="flex flex-col gap-5">
          <h3 className="text-[12px] font-bold text-[#343434] uppercase tracking-wider">Application Tokens & Phases</h3>

          {app.tokens && app.tokens.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {app.tokens.map((token) => (
                <div key={token.token_number} className="rounded-lg border border-[#D6D9DE] bg-[#F9FAFB] p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-[#D6D9DE] pb-2">
                    <div>
                      <p className="text-xs font-bold text-[#343434]">{token.token_number}</p>
                      <p className="text-[10px] text-gray-500 font-medium">Phase {token.phase}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white ${
                      token.status === "ACTIVE" ? "bg-[#059669]" :
                      token.status === "WITHHELD" ? "bg-orange-500" : "bg-gray-500"
                    }`}>
                      {token.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 text-[10px] block">Valid Till</span>
                      <span className="font-semibold text-[#343434]">
                        {token.valid_till ? new Date(token.valid_till).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">Remaining Qty</span>
                      <span className="font-semibold text-[#0C83FF]">{token.remaining_quantity_pct ?? 100}%</span>
                    </div>
                  </div>

                  <a
                    href={`/authority/tokens/${token.transport_code}`}
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#0C83FF] bg-white py-1.5 text-xs font-medium text-[#0C83FF] hover:bg-[#E7F3FF] transition-colors"
                  >
                    View Token Details →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#D6D9DE] bg-gray-50 p-6 text-center text-xs text-gray-500 italic">
              Phase materials estimates are registered, but tokens have not been generated yet.
            </div>
          )}
        </div>
      )}

      {/* Image Viewer Lightbox Modal */}
      <ImageViewerModal
        isOpen={viewerConfig.isOpen}
        onClose={() => setViewerConfig((prev) => ({ ...prev, isOpen: false }))}
        images={viewerConfig.list}
        currentIndex={viewerConfig.index}
        onIndexChange={(idx) => setViewerConfig((prev) => ({ ...prev, index: idx }))}
      />
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: user } = useUser();

  const handleBack = () => {
    const paramsString = searchParams.toString();
    if (paramsString) {
      router.push(`/authority/applications?${paramsString}`);
    } else {
      router.push("/authority/applications");
    }
  };
  const { data: app, isLoading, error } = useApplication(id);
  const workflowAction = useWorkflowAction();
  const addPhaseMaterials = useAddPhaseMaterials();
  const { mutateAsync: addComment } = useAddComment();

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("comment") === "true") {
      setIsCommentsOpen(true);
    }
  }, [searchParams]);

  const [remarksModal, setRemarksModal] = useState<{ isOpen: boolean; type: "REJECT" | "OBJECT" }>({
    isOpen: false,
    type: "REJECT",
  });
  const [objectionRedirectRole, setObjectionRedirectRole] = useState<string>("");
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false);

  const handleAction = async (
    action: WorkflowAction,
    remarks?: string,
    extra?: { phase?: number; num_stages?: number; phase_materials?: components["schemas"]["PhaseMaterialEntry"][] }
  ) => {
    try {
      // 1. Call Workflow Action API
      await workflowAction.mutateAsync({
        id,
        data: {
          action,
          remarks: remarks || `Action ${action} performed by ${user?.role}`,
          ...extra
        }
      });

      // 2. If it's an Objection, also call the Comment API
      if (action === "OBJECT" && remarks) {
        await addComment({
          id,
          data: {
            comment: remarks,
            comment_type: "OBJECTION_COMMENT" as any, // Cast as user instructed
          }
        });
      }

      alert(`Application ${action === "OBJECT" ? "objection raised" : action.toLowerCase() + "ed"} successfully.`);
    } catch (err: any) {
      console.error("Action failed", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || "Failed to perform action. Please try again.";
      alert(errorMsg);
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
        <button onClick={handleBack} className="rounded-lg bg-white border border-[#D6D9DE] px-4 py-2 text-sm">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative overflow-y-auto">
      <Header
        app={app}
        userRole={user?.role as UserRole}
        onBack={handleBack}
        onAction={handleAction}
        onCommentClick={() => setIsCommentsOpen(true)}
        onRejectClick={() => setRemarksModal({ isOpen: true, type: "REJECT" })}
        onObjectionClick={(role) => {
          setObjectionRedirectRole(role);
          setRemarksModal({ isOpen: true, type: "OBJECT" });
        }}
        onAddPhaseClick={() => setIsAddPhaseOpen(true)}
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
        userRole={user?.role}
      />

      <ActionRemarksModal
        isOpen={remarksModal.isOpen}
        type={remarksModal.type}
        onClose={() => setRemarksModal({ ...remarksModal, isOpen: false })}
        onConfirm={async (remarks) => {
          await handleAction(remarksModal.type, remarks, { objection_to_role: objectionRedirectRole } as any);
          setRemarksModal({ ...remarksModal, isOpen: false });
        }}
        isPending={workflowAction.isPending}
      />

      <AddPhaseDrawer
        isOpen={isAddPhaseOpen}
        onClose={() => setIsAddPhaseOpen(false)}
        app={app}
        onConfirm={async (num_stages, phase_materials) => {
          try {
            // 1. Add Phase Materials via new API
            await addPhaseMaterials.mutateAsync({
              id,
              data: phase_materials
            });

            setIsAddPhaseOpen(false);
          } catch (err: any) {
            console.error("Phase submission failed", err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.message || "Failed to submit phase details. Please try again.";
            alert(errorMsg);
          }
        }}
        isPending={addPhaseMaterials.isPending}
      />
    </div>
  );
}
