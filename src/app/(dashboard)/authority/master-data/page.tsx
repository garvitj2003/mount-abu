"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
  useComplaintCategories, 
  useWards, 
  useDepartments, 
  useRoles, 
  useMaterials,
  useSlots,
  useVehicleTypes,
  useBlackouts,
  useUpdateWard,
  useUpdateDepartment,
  useUpdateRole,
  useUpdateComplaintCategory,
  useUpdateMaterial,
  useUpdateSlot,
  useUpdateVehicleType,
  useUpdateBlackout,
} from "@/hooks/useMasterData";
import { useCapacityHeatmap } from "@/hooks/useSchedule";
import NewCategoryDrawer from "@/components/dashboard/authority/master-data/NewCategoryDrawer";
import NewWardDrawer from "@/components/dashboard/authority/master-data/NewWardDrawer";
import NewDepartmentDrawer from "@/components/dashboard/authority/master-data/NewDepartmentDrawer";
import NewRoleDrawer from "@/components/dashboard/authority/master-data/NewRoleDrawer";
import NewMaterialDrawer from "@/components/dashboard/authority/master-data/NewMaterialDrawer";
import NewSlotDrawer from "@/components/dashboard/authority/master-data/NewSlotDrawer";
import NewVehicleTypeDrawer from "@/components/dashboard/authority/master-data/NewVehicleTypeDrawer";
import NewBlackoutDrawer from "@/components/dashboard/authority/master-data/NewBlackoutDrawer";
import MasterDataMenu from "@/components/dashboard/authority/master-data/MasterDataMenu";
import TablePagination from "@/components/ui/TablePagination";
import { usePagination } from "@/hooks/usePagination";

type TabType = "Complaint Categories" | "Wards/Zones" | "Departments" | "Roles" | "Materials" | "Vehicle Scheduling";
type VehicleSchedulingSubTab = "Slots" | "Vehicle Types" | "Blackout Calendar" | "Capacity Heatmap";

const TABS: TabType[] = ["Complaint Categories", "Wards/Zones", "Departments", "Roles", "Materials", "Vehicle Scheduling"];

const VEHICLE_SCHEDULING_SUB_TABS: { key: VehicleSchedulingSubTab; label: string }[] = [
  { key: "Slots", label: "Vehicle Slots" },
  { key: "Vehicle Types", label: "Vehicle Types" },
  { key: "Blackout Calendar", label: "Blackout Calendar" },
  { key: "Capacity Heatmap", label: "Capacity Heatmap" },
];

interface TableColumn {
  header: string;
  key: string;
  width?: string;
  render?: (row: any) => React.ReactNode;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export default function AuthorityMasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Complaint Categories");
  const [vehicleSubTab, setVehicleSubTab] = useState<VehicleSchedulingSubTab>("Slots");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  
  // Pagination State
  const { page, limit, setPage, setLimit } = usePagination();

   // Drawer States
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isWardDrawerOpen, setIsWardDrawerOpen] = useState(false);
  const [isDepartmentDrawerOpen, setIsDepartmentDrawerOpen] = useState(false);
  const [isRoleDrawerOpen, setIsRoleDrawerOpen] = useState(false);
  const [isMaterialDrawerOpen, setIsMaterialDrawerOpen] = useState(false);
  const [isSlotDrawerOpen, setIsSlotDrawerOpen] = useState(false);
  const [isVehicleTypeDrawerOpen, setIsVehicleTypeDrawerOpen] = useState(false);
  const [isBlackoutDrawerOpen, setIsBlackoutDrawerOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // Hooks
  const { data: categories = [], isLoading: isLoadingCategories } = useComplaintCategories();
  const { data: wards = [], isLoading: isLoadingWards } = useWards();
  const { data: departments = [], isLoading: isLoadingDepts } = useDepartments();
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
  const { data: materials = [], isLoading: isLoadingMaterials } = useMaterials();
  const { data: slots = [], isLoading: isLoadingSlots } = useSlots();
  const { data: vehicleTypes = [], isLoading: isLoadingVehicleTypes } = useVehicleTypes();
  const { data: blackouts = [], isLoading: isLoadingBlackouts } = useBlackouts();
  const { data: heatmapData, isLoading: isLoadingHeatmap } = useCapacityHeatmap();

  // Mutations
  const { mutateAsync: updateWard } = useUpdateWard();
  const { mutateAsync: updateDept } = useUpdateDepartment();
  const { mutateAsync: updateRole } = useUpdateRole();
  const { mutateAsync: updateCategory } = useUpdateComplaintCategory();
  const { mutateAsync: updateMaterial } = useUpdateMaterial();
  const { mutateAsync: updateSlot } = useUpdateSlot();
  const { mutateAsync: updateVehicleType } = useUpdateVehicleType();
  const { mutateAsync: updateBlackout } = useUpdateBlackout();

  const handleActionClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 160, 
      });
      setOpenDropdownId(id);
    }
  };

  const handleToggleStatus = async (item: any) => {
    try {
      if (activeTab === "Wards/Zones") {
        await updateWard({ id: item.id, data: { status: !item.status } });
      } else if (activeTab === "Departments") {
        await updateDept({ id: item.id, data: { status: !item.status } });
      } else if (activeTab === "Roles") {
        await updateRole({ id: item.id, data: { status: !item.status } });
      } else if (activeTab === "Complaint Categories") {
        await updateCategory({ id: item.id, data: { status: !item.status } });
      } else if (activeTab === "Materials") {
        await updateMaterial({ id: item.id, data: { status: !item.status } });
      } else if (activeTab === "Vehicle Scheduling") {
        if (vehicleSubTab === "Slots") {
          await updateSlot({ id: item.id, data: { is_active: !item.is_active } });
        } else if (vehicleSubTab === "Vehicle Types") {
          await updateVehicleType({ id: item.id, data: { is_active: !item.is_active } });
        } else if (vehicleSubTab === "Blackout Calendar") {
          await updateBlackout({ id: item.id, data: { is_active: !item.is_active } });
        }
      }
      alert("Status updated successfully!");

    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status.");
    } finally {
      setOpenDropdownId(null);
    }
  };



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId !== null && triggerRefs.current[openDropdownId]?.contains(event.target as Node)) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    const handleScroll = () => setOpenDropdownId(null);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [openDropdownId]);

  const ACTION_COLUMN: TableColumn = {
    header: "",
    key: "actions",
    render: (row: any) => (
      <button 
        ref={el => { triggerRefs.current[row.id] = el }}
        onClick={(e) => handleActionClick(e, row.id)}
        className="text-[#343434] hover:bg-gray-200 rounded p-1 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    )
  };

  const CATEGORY_COLUMNS: TableColumn[] = useMemo(() => [
    { 
      header: "Code", 
      key: "code",
      render: (row: any) => <span className="text-sm font-medium text-[#343434]">CMP-{row.id.toString().padStart(3, '0')}</span>
    },
    { header: "Name", key: "name" },
    { 
      header: "Department", 
      key: "department_id",
      render: (row: any) => {
        const dept = departments.find(d => d.id === row.department_id);
        return <span className="text-sm">{dept?.name || "—"}</span>;
      }
    },
    { header: "Description", key: "description" },
    { header: "Status", key: "status" },
    { 
      header: "Created by", 
      key: "created_by",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{row.created_by?.name || "System"}</span>
    },
    { 
      header: "Created On", 
      key: "created_at",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{formatDate(row.created_at)}</span>
    },
    ACTION_COLUMN
  ], [departments, ACTION_COLUMN]);

  const WARD_COLUMNS: TableColumn[] = [
    { header: "Code", key: "code" },
    { header: "Ward / Zone Name", key: "name" },
    { header: "Type", key: "type" },
    { header: "Status", key: "status" },
    { 
      header: "Created by", 
      key: "created_by",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{row.created_by?.name || "System"}</span>
    },
    { 
      header: "Created On", 
      key: "created_at",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{formatDate(row.created_at)}</span>
    },
    ACTION_COLUMN
  ];

  const DEPARTMENT_COLUMNS: TableColumn[] = [
    { header: "Code", key: "code" },
    { header: "Department Name", key: "name" },
    { header: "Type", key: "type" },
    { header: "Status", key: "status" },
    { 
      header: "Created by", 
      key: "created_by",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{row.created_by?.name || "System"}</span>
    },
    { 
      header: "Created On", 
      key: "created_at",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{formatDate(row.created_at)}</span>
    },
    ACTION_COLUMN
  ];

  const ROLE_COLUMNS: TableColumn[] = [
    { header: "Code", key: "code" },
    { header: "Role Name", key: "name" },
    { header: "Status", key: "status" },
    { 
      header: "Created by", 
      key: "created_by",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{row.created_by?.name || "System"}</span>
    },
    { 
      header: "Created On", 
      key: "created_at",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{formatDate(row.created_at)}</span>
    },
    ACTION_COLUMN
  ];

  const MATERIAL_COLUMNS: TableColumn[] = [
    { 
      header: "Code", 
      key: "code",
      render: (row: any) => <span className="text-sm font-medium text-[#343434]">MAT-{row.id.toString().padStart(3, '0')}</span>
    },
    { header: "Material Name", key: "name" },
    { header: "Unit", key: "unit" },
    { header: "Status", key: "status" },
    { 
      header: "Created by", 
      key: "created_by",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{row.created_by?.name || "System"}</span>
    },
    { 
      header: "Created On", 
      key: "created_at",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{formatDate(row.created_at)}</span>
    },
    ACTION_COLUMN
  ];

  const SLOT_COLUMNS: TableColumn[] = [
    { 
      header: "Code", 
      key: "code",
      render: (row: any) => <span className="text-sm font-medium text-[#343434]">SLOT-{row.id.toString().padStart(3, '0')}</span>
    },
    { header: "Slot Name", key: "name" },
    { 
      header: "Window Timing", 
      key: "timing",
      render: (row: any) => (
        <span className="inline-flex items-center gap-1 rounded bg-[#EBF3FC] px-2 py-0.5 text-xs font-semibold text-[#0C83FF]">
          {row.start_time} - {row.end_time}
        </span>
      )
    },
    { 
      header: "Operational Days", 
      key: "applicable_days",
      render: (row: any) => (
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {(row.applicable_days || "MON,TUE,WED,THU,FRI,SAT,SUN").split(",").map((d: string) => (
            <span key={d} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700">
              {d.trim()}
            </span>
          ))}
        </div>
      )
    },
    { 
      header: "Grace Window", 
      key: "grace_period_minutes",
      render: (row: any) => <span className="text-xs font-medium text-gray-700">±{row.grace_period_minutes ?? 30} mins</span>
    },
    { 
      header: "Daily Capacity", 
      key: "max_capacity",
      render: (row: any) => <span className="text-sm font-semibold text-[#343434]">{row.max_capacity} Vehicles</span>
    },
    { 
      header: "Status", 
      key: "is_active",
      render: (row: any) => (
        <div className="flex items-center gap-1.5">
          <Image src={row.is_active ? "/dashboard/icons/tick-round-green.svg" : "/dashboard/icons/cross-round-red.svg"} alt="" width={14} height={14} />
          <span className={`text-sm font-normal ${row.is_active ? "text-[#059669]" : "text-[#EF4444]"}`}>
            {row.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      )
    },
    { 
      header: "Created On", 
      key: "created_at",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{formatDate(row.created_at)}</span>
    },
    ACTION_COLUMN
  ];

  const VEHICLE_TYPE_COLUMNS: TableColumn[] = [
    { 
      header: "Code", 
      key: "code",
      render: (row: any) => <span className="text-xs font-semibold font-mono text-[#343434] bg-gray-100 px-2 py-0.5 rounded">{row.code}</span>
    },
    { header: "Vehicle Type Name", key: "name" },
    { 
      header: "Status", 
      key: "is_active",
      render: (row: any) => (
        <div className="flex items-center gap-1.5">
          <Image src={row.is_active ? "/dashboard/icons/tick-round-green.svg" : "/dashboard/icons/cross-round-red.svg"} alt="" width={14} height={14} />
          <span className={`text-sm font-normal ${row.is_active ? "text-[#059669]" : "text-[#EF4444]"}`}>
            {row.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      )
    },
    { 
      header: "Created On", 
      key: "created_at",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{formatDate(row.created_at)}</span>
    },
    ACTION_COLUMN
  ];

  const BLACKOUT_COLUMNS: TableColumn[] = [
    { 
      header: "Blackout Date", 
      key: "blackout_date",
      render: (row: any) => <span className="text-sm font-semibold text-[#343434] font-mono">{formatDate(row.blackout_date)}</span>
    },
    { header: "Reason / Event", key: "reason" },
    { 
      header: "Scope", 
      key: "is_full_day",
      render: (row: any) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          row.is_full_day ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}>
          {row.is_full_day ? "Full Day Closed" : `Slot Only: ${row.slot_name || "Specific"}`}
        </span>
      )
    },
    { 
      header: "Status", 
      key: "is_active",
      render: (row: any) => (
        <div className="flex items-center gap-1.5">
          <Image src={row.is_active ? "/dashboard/icons/tick-round-green.svg" : "/dashboard/icons/cross-round-red.svg"} alt="" width={14} height={14} />
          <span className={`text-sm font-normal ${row.is_active ? "text-[#059669]" : "text-[#EF4444]"}`}>
            {row.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      )
    },
    { 
      header: "Created On", 
      key: "created_at",
      render: (row: any) => <span className="text-sm font-normal text-[#343434] opacity-70">{formatDate(row.created_at)}</span>
    },
    ACTION_COLUMN
  ];


  useEffect(() => {
    const activeTabIdx = TABS.indexOf(activeTab);
    const activeTabElement = tabsRef.current[activeTabIdx];
    if (activeTabElement) {
      setIndicatorStyle({
        width: activeTabElement.offsetWidth,
        left: activeTabElement.offsetLeft,
      });
    }
  }, [activeTab]);

  const getTabData = () => {
    switch (activeTab) {
      case "Complaint Categories":
        return { 
          columns: CATEGORY_COLUMNS, 
          data: categories, 
          buttonText: "Add New Category",
          isLoading: isLoadingCategories,
          onAdd: () => {
            setSelectedItem(null);
            setIsCategoryDrawerOpen(true);
          }
        };
      case "Wards/Zones":
        return { 
          columns: WARD_COLUMNS, 
          data: wards, 
          buttonText: "New Ward/Zone",
          isLoading: isLoadingWards,
          onAdd: () => {
            setSelectedItem(null);
            setIsWardDrawerOpen(true);
          }
        };
      case "Departments":
        return { 
          columns: DEPARTMENT_COLUMNS, 
          data: departments, 
          buttonText: "New Department",
          isLoading: isLoadingDepts,
          onAdd: () => {
            setSelectedItem(null);
            setIsDepartmentDrawerOpen(true);
          }
        };
      case "Roles":
        return { 
          columns: ROLE_COLUMNS, 
          data: roles, 
          buttonText: "New Role",
          isLoading: isLoadingRoles,
          onAdd: () => {
            setSelectedItem(null);
            setIsRoleDrawerOpen(true);
          }
        };
      case "Materials":
        return { 
          columns: MATERIAL_COLUMNS, 
          data: materials, 
          buttonText: "New Material",
          isLoading: isLoadingMaterials,
          onAdd: () => {
            setSelectedItem(null);
            setIsMaterialDrawerOpen(true);
          }
        };
      case "Vehicle Scheduling":
        if (vehicleSubTab === "Slots") {
          return {
            columns: SLOT_COLUMNS,
            data: slots,
            buttonText: "New Vehicle Slot",
            isLoading: isLoadingSlots,
            onAdd: () => {
              setSelectedItem(null);
              setIsSlotDrawerOpen(true);
            }
          };
        } else if (vehicleSubTab === "Vehicle Types") {
          return {
            columns: VEHICLE_TYPE_COLUMNS,
            data: vehicleTypes,
            buttonText: "New Vehicle Type",
            isLoading: isLoadingVehicleTypes,
            onAdd: () => {
              setSelectedItem(null);
              setIsVehicleTypeDrawerOpen(true);
            }
          };
        } else if (vehicleSubTab === "Blackout Calendar") {
          return {
            columns: BLACKOUT_COLUMNS,
            data: blackouts,
            buttonText: "Add Blackout / Holiday",
            isLoading: isLoadingBlackouts,
            onAdd: () => {
              setSelectedItem(null);
              setIsBlackoutDrawerOpen(true);
            }
          };
        } else {
          // Capacity Heatmap
          return {
            columns: [],
            data: heatmapData?.days || [],
            buttonText: "",
            isLoading: isLoadingHeatmap,
            onAdd: () => {}
          };
        }
      default:
        return { columns: [], data: [], buttonText: "", isLoading: false, onAdd: () => {} };
    }
  };



  const { columns, data: allData, buttonText, onAdd, isLoading } = getTabData();

  const totalPages = Math.ceil(allData.length / limit);
  const data = allData.slice((page - 1) * limit, page * limit);

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-base font-medium text-[#343434]">Master Data Management</h1>
          <p className="text-xs font-normal text-[#343434]">
            Manage complaint categories, wards/zones, departments, vehicle scheduling, and roles.
          </p>
        </div>
        {buttonText && (
          <button 
            onClick={onAdd}
            className="flex items-center justify-center gap-2.5 rounded-lg bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="relative flex items-center gap-[6px] bg-white px-5 py-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.13)]">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            ref={(el) => { tabsRef.current[idx] = el; }}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
              setOpenDropdownId(null);
            }}
            className={`flex items-center justify-center gap-2.5 px-3 py-2 text-sm transition-colors whitespace-nowrap ${
              activeTab === tab ? "font-semibold text-[#0C83FF]" : "font-normal text-[#343434]"
            }`}
          >
            {tab}
          </button>
        ))}
        {/* Active Tab Indicator */}
        <div 
          className="absolute bottom-0 h-1.5 rounded-t-lg bg-[#0C83FF] transition-all duration-300"
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        {/* Sub-tab Pill Switch for Vehicle Scheduling */}
        {activeTab === "Vehicle Scheduling" && (
          <div className="mb-4 flex items-center gap-1.5 p-1 bg-black/[0.04] rounded-2xl w-fit border border-black/[0.06] shadow-inner">
            {VEHICLE_SCHEDULING_SUB_TABS.map((sub) => {
              const isSelected = vehicleSubTab === sub.key;
              return (
                <button
                  key={sub.key}
                  type="button"
                  onClick={() => {
                    setVehicleSubTab(sub.key);
                    setPage(1);
                    setOpenDropdownId(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#1D1D1F] shadow-sm border border-black/[0.06]"
                      : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 min-h-[400px]">
          {activeTab === "Vehicle Scheduling" && vehicleSubTab === "Capacity Heatmap" ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-[#D6D9DE] pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#343434]">14-Day Live Slot Utilization Gauge & Heatmap</h3>
                  <p className="text-xs text-[#343434] opacity-70">
                    Real-time tracking of booked vehicle transit slots vs total daily throughput capacity across all operational time windows.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-emerald-500"></span> Low Load (&lt;40%)</span>
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-amber-500"></span> Moderate (40-75%)</span>
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-rose-500"></span> High / Full (&gt;75%)</span>
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-gray-400"></span> Blackout</span>
                </div>
              </div>


              {isLoadingHeatmap ? (
                <div className="flex h-72 w-full flex-col items-center justify-center gap-3">
                  <div className="size-8 animate-spin rounded-full border-3 border-[#0C83FF] border-t-transparent"></div>
                  <span className="text-xs font-medium text-[#86868B]">Calculating live capacity projections...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {heatmapData?.days.map((day) => {
                    const isBlackout = day.is_full_blackout;
                    const isHigh = day.overall_load_percentage >= 75;
                    const isMed = day.overall_load_percentage >= 40;

                    const cardBg = isBlackout
                      ? "bg-neutral-50/80 border-neutral-200/80"
                      : isHigh
                      ? "bg-gradient-to-b from-rose-50/50 to-white border-rose-200/80"
                      : isMed
                      ? "bg-gradient-to-b from-amber-50/40 to-white border-amber-200/80"
                      : "bg-gradient-to-b from-emerald-50/30 to-white border-emerald-200/70";

                    const badgeStyle = isBlackout
                      ? "bg-neutral-200 text-neutral-700"
                      : isHigh
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : isMed
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200";

                    const progressColor = isHigh
                      ? "bg-rose-500"
                      : isMed
                      ? "bg-amber-500"
                      : "bg-emerald-500";

                    return (
                      <div
                        key={day.date}
                        className={`rounded-2xl border p-4.5 flex flex-col justify-between gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${cardBg}`}
                      >
                        {/* Day & Date Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">{day.day_name}</p>
                            <p className="text-base font-bold tracking-tight text-[#1D1D1F] mt-0.5">
                              {formatDate(day.date)}
                            </p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-tight ${badgeStyle}`}>
                            {isBlackout ? "CLOSED" : `${day.overall_load_percentage}% LOAD`}
                          </span>
                        </div>

                        {isBlackout ? (
                          <div className="rounded-xl bg-red-100/60 border border-red-200/80 p-3 text-xs text-red-800 flex items-start gap-2">
                            <span className="text-sm">🚫</span>
                            <div>
                              <p className="font-semibold">Transit Suspended</p>
                              <p className="text-[11px] opacity-90 mt-0.5">{day.blackout_reason || "Scheduled maintenance/holiday"}</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Capacity Bar */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between text-xs font-medium">
                                <span className="text-[#515154]">
                                  Booked: <strong className="text-[#1D1D1F]">{day.total_booked}</strong> / {day.total_capacity}
                                </span>
                                <span className="font-semibold text-emerald-700">
                                  {day.total_available} Available
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-black/[0.06] overflow-hidden p-0.5">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                  style={{ width: `${Math.min(100, day.overall_load_percentage)}%` }}
                                />
                              </div>
                            </div>

                            {/* Slot List */}
                            <div className="rounded-xl bg-white/80 border border-black/[0.04] p-2 flex flex-col gap-1 shadow-sm">
                              {day.slots.map((s) => (
                                <div key={s.slot_id} className="flex items-center justify-between text-[11px] py-0.5 px-1">
                                  <span className="font-medium text-[#1D1D1F] truncate max-w-[130px]">{s.name}</span>
                                  <span className="font-mono text-[#86868B] font-semibold">{s.booked_count}/{s.max_capacity}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Apple-style Search & Action Bar */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex w-full max-w-xs items-center gap-2.5 rounded-full border border-black/[0.08] bg-neutral-100/70 px-3.5 py-2 transition-all focus-within:border-[#0C83FF] focus-within:bg-white focus-within:shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-50">
                    <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#1D1D1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 14L11.1 11.1" stroke="#1D1D1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder={`Search ${activeTab.toLowerCase()}...`}
                    className="w-full border-none bg-transparent p-0 text-xs text-[#1D1D1F] placeholder:text-[#86868B] outline-none"
                  />
                </div>
                <div className="text-xs text-[#86868B] font-medium">
                  Showing <strong className="text-[#1D1D1F]">{allData.length}</strong> total records
                </div>
              </div>

              {/* Table Container */}
              <div className="w-full overflow-x-auto rounded-2xl border border-black/[0.05]">
                {isLoading ? (
                  <div className="flex h-64 w-full flex-col items-center justify-center gap-3">
                    <div className="size-8 animate-spin rounded-full border-3 border-[#0C83FF] border-t-transparent"></div>
                    <span className="text-xs font-medium text-[#86868B]">Loading data...</span>
                  </div>
                ) : (
                  <table className="w-full min-w-[900px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-black/[0.06] bg-neutral-50/70">
                        {columns.map((col, idx) => (
                          <th key={idx} className="px-4 py-3.5 text-left whitespace-nowrap">
                            <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                              {col.header}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {data.length > 0 ? (
                        data.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                            {columns.map((col, colIdx) => (
                              <td key={colIdx} className="px-4 py-3.5 whitespace-nowrap">
                                {col.render ? (
                                  col.render(row)
                                ) : col.key === "status" ? (
                                  <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                    {row.status ? "Active" : "Inactive"}
                                  </div>
                                ) : (
                                  <span className={`text-xs ${colIdx === 0 ? "font-semibold text-[#1D1D1F]" : "text-[#515154]"}`}>
                                    {row[col.key] || "—"}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={columns.length} className="px-4 py-12 text-center text-xs text-[#86868B] font-medium">
                            No records found for {activeTab}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {openDropdownId && (
                <div 
                  ref={dropdownRef}
                  style={{ 
                    position: 'fixed', 
                    top: dropdownPos.top, 
                    left: dropdownPos.left,
                    zIndex: 9999 
                  }}
                  className="animate-in fade-in zoom-in-95 duration-150"
                >
                  {(() => {
                    const item = (allData as any[]).find((i: any) => i.id === openDropdownId);
                    if (!item) return null;

                    return (
                      <MasterDataMenu 
                        is_active={(item as any).is_active ?? (item as any).status ?? true}
                        onDeactivate={() => handleToggleStatus(item)}
                        onEdit={() => {
                          setSelectedItem(item);
                          if (activeTab === "Wards/Zones") setIsWardDrawerOpen(true);
                          else if (activeTab === "Departments") setIsDepartmentDrawerOpen(true);
                          else if (activeTab === "Roles") setIsRoleDrawerOpen(true);
                          else if (activeTab === "Complaint Categories") setIsCategoryDrawerOpen(true);
                          else if (activeTab === "Materials") setIsMaterialDrawerOpen(true);
                          else if (activeTab === "Vehicle Scheduling") {
                            if (vehicleSubTab === "Slots") setIsSlotDrawerOpen(true);
                            else if (vehicleSubTab === "Vehicle Types") setIsVehicleTypeDrawerOpen(true);
                            else if (vehicleSubTab === "Blackout Calendar") setIsBlackoutDrawerOpen(true);
                          }
                          setOpenDropdownId(null);
                        }}

                      />
                    );
                  })()}
                </div>
              )}

              {/* Pagination */}
              <TablePagination
                currentPage={page}
                totalPages={totalPages}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            </>
          )}
        </div>
      </div>


      <NewCategoryDrawer 
        isOpen={isCategoryDrawerOpen} 
        onClose={() => {
          setIsCategoryDrawerOpen(false);
          setSelectedItem(null);
        }} 
        data={selectedItem}
      />
      <NewWardDrawer 
        isOpen={isWardDrawerOpen} 
        onClose={() => {
          setIsWardDrawerOpen(false);
          setSelectedItem(null);
        }} 
        data={selectedItem}
      />
      <NewDepartmentDrawer 
        isOpen={isDepartmentDrawerOpen} 
        onClose={() => {
          setIsDepartmentDrawerOpen(false);
          setSelectedItem(null);
        }} 
        data={selectedItem}
      />
      <NewRoleDrawer 
        isOpen={isRoleDrawerOpen} 
        onClose={() => {
          setIsRoleDrawerOpen(false);
          setSelectedItem(null);
        }} 
        data={selectedItem}
      />
      <NewMaterialDrawer 
        isOpen={isMaterialDrawerOpen} 
        onClose={() => {
          setIsMaterialDrawerOpen(false);
          setSelectedItem(null);
        }} 
        data={selectedItem}
      />
      <NewSlotDrawer 
        isOpen={isSlotDrawerOpen} 
        onClose={() => {
          setIsSlotDrawerOpen(false);
          setSelectedItem(null);
        }} 
        data={selectedItem}
      />
      <NewVehicleTypeDrawer 
        isOpen={isVehicleTypeDrawerOpen} 
        onClose={() => {
          setIsVehicleTypeDrawerOpen(false);
          setSelectedItem(null);
        }} 
        data={selectedItem}
      />
      <NewBlackoutDrawer
        isOpen={isBlackoutDrawerOpen}
        onClose={() => {
          setIsBlackoutDrawerOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
      />

    </div>
  );
}

