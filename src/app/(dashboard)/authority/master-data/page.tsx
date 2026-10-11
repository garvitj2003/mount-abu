"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
  useComplaintCategories, 
  useWards, 
  useDepartments, 
  useRoles, 
  useMaterials,
  useAnnouncements,
  useUpdateWard,
  useUpdateDepartment,
  useUpdateRole,
  useUpdateComplaintCategory,
  useUpdateMaterial,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "@/hooks/useMasterData";
import NewCategoryDrawer from "@/components/dashboard/authority/master-data/NewCategoryDrawer";
import NewWardDrawer from "@/components/dashboard/authority/master-data/NewWardDrawer";
import NewDepartmentDrawer from "@/components/dashboard/authority/master-data/NewDepartmentDrawer";
import NewRoleDrawer from "@/components/dashboard/authority/master-data/NewRoleDrawer";
import NewMaterialDrawer from "@/components/dashboard/authority/master-data/NewMaterialDrawer";
import NewAnnouncementDrawer from "@/components/dashboard/authority/master-data/NewAnnouncementDrawer";
import MasterDataMenu from "@/components/dashboard/authority/master-data/MasterDataMenu";
import TablePagination from "@/components/ui/TablePagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { usePagination } from "@/hooks/usePagination";

type TabType = "Complaint Categories" | "Wards/Zones" | "Departments" | "Roles" | "Materials" | "Announcements";

const TABS: TabType[] = ["Complaint Categories", "Wards/Zones", "Departments", "Roles", "Materials", "Announcements"];

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
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  
  // Pagination State
  const { page, limit, setPage, setLimit } = usePagination();

   // Drawer States
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isWardDrawerOpen, setIsWardDrawerOpen] = useState(false);
  const [isDepartmentDrawerOpen, setIsDepartmentDrawerOpen] = useState(false);
  const [isRoleDrawerOpen, setIsRoleDrawerOpen] = useState(false);
  const [isMaterialDrawerOpen, setIsMaterialDrawerOpen] = useState(false);
  const [isAnnouncementDrawerOpen, setIsAnnouncementDrawerOpen] = useState(false);
  
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
  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useAnnouncements();

  // Mutations
  const { mutateAsync: updateWard } = useUpdateWard();
  const { mutateAsync: updateDept } = useUpdateDepartment();
  const { mutateAsync: updateRole } = useUpdateRole();
  const { mutateAsync: updateCategory } = useUpdateComplaintCategory();
  const { mutateAsync: updateMaterial } = useUpdateMaterial();
  const { mutateAsync: updateAnnouncement } = useUpdateAnnouncement();
  const { mutateAsync: deleteAnnouncement } = useDeleteAnnouncement();

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
      } else if (activeTab === "Announcements") {
        await updateAnnouncement({ id: item.id, data: { is_active: !item.is_active } });
      }
      alert("Status updated successfully!");

    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status.");
    } finally {
      setOpenDropdownId(null);
    }
  };

  const [deleteItemTarget, setDeleteItemTarget] = useState<any | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  const handleDelete = (item: any) => {
    setDeleteItemTarget(item);
    setOpenDropdownId(null);
  };

  const executeDeleteItem = async () => {
    if (!deleteItemTarget) return;
    try {
      setIsDeletingItem(true);
      if (activeTab === "Announcements") {
        await deleteAnnouncement(deleteItemTarget.id);
      }
      setDeleteItemTarget(null);
    } catch (error) {
      console.error("Failed to delete item", error);
      alert("Failed to delete item.");
    } finally {
      setIsDeletingItem(false);
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

  const ANNOUNCEMENT_COLUMNS: TableColumn[] = [
    { 
      header: "Title", 
      key: "title",
      render: (row: any) => <span className="text-sm font-semibold text-[#343434]">{row.title}</span>
    },
    { 
      header: "Message", 
      key: "message",
      render: (row: any) => (
        <span className="text-sm text-[#343434] max-w-md block truncate" title={row.message}>
          {row.message}
        </span>
      )
    },
    { 
      header: "Valid Till", 
      key: "valid_till",
      render: (row: any) => (
        <span className="text-sm text-[#343434]">
          {row.valid_till ? formatDate(row.valid_till) : "Ongoing (No Expiry)"}
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
      case "Announcements":
        return {
          columns: ANNOUNCEMENT_COLUMNS,
          data: announcements,
          buttonText: "Create Announcement",
          isLoading: isLoadingAnnouncements,
          onAdd: () => {
            setSelectedItem(null);
            setIsAnnouncementDrawerOpen(true);
          }
        };
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
            Manage complaint categories, wards/zones, departments, roles, materials, and announcements.
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
        <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 min-h-[400px]">
          {/* Search & Action Bar */}
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
                    onDelete={activeTab === "Announcements" ? () => handleDelete(item) : undefined}
                    onEdit={() => {
                      setSelectedItem(item);
                      if (activeTab === "Wards/Zones") setIsWardDrawerOpen(true);
                      else if (activeTab === "Departments") setIsDepartmentDrawerOpen(true);
                      else if (activeTab === "Roles") setIsRoleDrawerOpen(true);
                      else if (activeTab === "Complaint Categories") setIsCategoryDrawerOpen(true);
                      else if (activeTab === "Materials") setIsMaterialDrawerOpen(true);
                      else if (activeTab === "Announcements") setIsAnnouncementDrawerOpen(true);
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
      <NewAnnouncementDrawer
        isOpen={isAnnouncementDrawerOpen}
        onClose={() => {
          setIsAnnouncementDrawerOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
      />

      <ConfirmModal
        isOpen={deleteItemTarget !== null}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeletingItem}
        onConfirm={executeDeleteItem}
        onClose={() => setDeleteItemTarget(null)}
      />
    </div>
  );
}

