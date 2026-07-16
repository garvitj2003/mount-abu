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
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | "all">("all");

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

  const inspectionPhotos = useMemo(() => {
    return app.inspections?.flatMap(ins =>
      (ins.access_urls || []).map(url => ({
        url,
        remarks: ins.remarks,
        inspector: ins.inspector_name,
        date: ins.inspected_at
      }))
    ) || [];
  }, [app.inspections]);

  const mergedMaterialsToDisplay = useMemo(() => {
    const list: {
      key: string;
      material_id?: number | null;
      name: string;
      unit: string;
      isCustom: boolean;
      requestedQty: number;
    }[] = [];

    app.materials?.forEach((mat) => {
      const isCustom = !mat.material_id;
      const name = isCustom ? mat.custom_name || "" : mat.material_name || "";
      const unit = isCustom ? mat.custom_unit || "" : mat.unit || "";
      const key = isCustom ? `custom-${name.toLowerCase()}` : `master-${mat.material_id}`;
      
      const exists = list.some(item => item.key === key);
      if (!exists) {
        list.push({
          key,
          material_id: mat.material_id,
          name,
          unit,
          isCustom,
          requestedQty: mat.quantity,
        });
      } else {
        const existingItem = list.find(item => item.key === key);
        if (existingItem) {
          existingItem.requestedQty += mat.quantity;
        }
      }
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
        <h3 className="text-[12px] font-semibold text-[#4BB5AB] uppercase">Geo-Tagged Pictures (from Inspection)</h3>
        <div className="grid grid-cols-4 gap-3">
          {inspectionPhotos.map((photo, idx) => (
            <a
              key={idx}
              href={photo.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-video relative rounded-lg border border-[#D6D9DE] overflow-hidden bg-gray-100 group cursor-pointer hover:border-[#0C83FF] transition-all block"
            >
              <Image
                src={photo.url || "/sample/application-main.png"}
                alt="Geo-tagged"
                fill
                unoptimized
                className="object-cover"
              />

              <div className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-sm">
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
            </a>
          ))}
          {!inspectionPhotos.length && (
            <p className="text-xs text-gray-400 col-span-4 italic py-4">No inspection pictures available.</p>
          )}
        </div>
      </div>

      {/* Material Details */}
      <div className="flex flex-col gap-3 mt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-bold text-[#343434] uppercase tracking-wider">Material Details</h3>
          
          {/* Phase Filter Dropdown */}
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
                <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Estimated Material</th>
                <th className="p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Estimated by JEN</th>
                {Array.from({ length: numStagesToDisplay })
                  .map((_, i) => i + 1)
                  .filter((p) => selectedPhaseFilter === "all" || selectedPhaseFilter === p)
                  .map((p) => (
                    <th
                      key={p}
                      className={`p-3 text-[12px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE] last:border-r-0 ${[
                        "bg-[#E7F3FF]", // Phase 1
                        "bg-[#FFEEB4]", // Phase 2
                        "bg-[#E6F7F5]", // Phase 3
                        "bg-[#FFF1F0]", // Phase 4
                        "bg-[#F0F7FF]", // Phase 5
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
                      {item.name} {item.unit && `(${item.unit})`}
                      {item.isCustom && <span className="ml-2 rounded bg-orange-50 px-1.5 py-0.5 text-[9px] font-medium text-orange-600 border border-orange-200">Custom</span>}
                    </td>
                    <td className="p-3 text-sm font-medium text-[#343434] border-r border-[#D6D9DE]">
                      {item.requestedQty > 0 ? `${item.requestedQty} Units` : "—"}
                    </td>
                    <td className="p-3 text-sm font-medium text-[#343434] border-r border-[#D6D9DE]">
                      <div className={`rounded border px-3 py-1.5 text-xs font-bold ${jenTotal > 0 ? "bg-white border-[#D6D9DE] text-[#0C83FF]" : "bg-gray-50 border-transparent text-gray-400"
                        }`}>
                        {jenTotal > 0 ? `${jenTotal} Units` : "—"}
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
                            {phaseQty !== undefined ? `${phaseQty} Units` : "—"}
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
