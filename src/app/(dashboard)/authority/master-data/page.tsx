"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
  useComplaintCategories, 
  useWards, 
  useDepartments, 
  useRoles, 
  useMaterials,
  useUpdateWard,
  useUpdateDepartment,
  useUpdateRole,
  useUpdateComplaintCategory
} from "@/hooks/useMasterData";
import NewCategoryDrawer from "@/components/dashboard/authority/master-data/NewCategoryDrawer";
import NewWardDrawer from "@/components/dashboard/authority/master-data/NewWardDrawer";
import NewDepartmentDrawer from "@/components/dashboard/authority/master-data/NewDepartmentDrawer";
import NewRoleDrawer from "@/components/dashboard/authority/master-data/NewRoleDrawer";
import NewMaterialDrawer from "@/components/dashboard/authority/master-data/NewMaterialDrawer";
import MasterDataMenu from "@/components/dashboard/authority/master-data/MasterDataMenu";
import TablePagination from "@/components/ui/TablePagination";

type TabType = "Complaint Categories" | "Wards/Zones" | "Departments" | "Roles" | "Materials";

const TABS: TabType[] = ["Complaint Categories", "Wards/Zones", "Departments", "Roles", "Materials"];

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
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Drawer States
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isWardDrawerOpen, setIsWardDrawerOpen] = useState(false);
  const [isDepartmentDrawerOpen, setIsDepartmentDrawerOpen] = useState(false);
  const [isRoleDrawerOpen, setIsRoleDrawerOpen] = useState(false);
  const [isMaterialDrawerOpen, setIsMaterialDrawerOpen] = useState(false);
  
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

  // Mutations
  const { mutateAsync: updateWard } = useUpdateWard();
  const { mutateAsync: updateDept } = useUpdateDepartment();
  const { mutateAsync: updateRole } = useUpdateRole();
  const { mutateAsync: updateCategory } = useUpdateComplaintCategory();

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
      const newStatus = !item.status;
      if (activeTab === "Wards/Zones") {
        await updateWard({ id: item.id, data: { status: newStatus } });
      } else if (activeTab === "Departments") {
        await updateDept({ id: item.id, data: { status: newStatus } });
      } else if (activeTab === "Roles") {
        await updateRole({ id: item.id, data: { status: newStatus } });
      } else if (activeTab === "Complaint Categories") {
        await updateCategory({ id: item.id, data: { status: newStatus } });
      }
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status.");
    }
    setOpenDropdownId(null);
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
            Manage complaint categories, wards/zones, departments, and roles.
          </p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center justify-center gap-2.5 rounded-lg bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          {buttonText}
        </button>
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
          {/* Search Bar */}
          <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search" className="w-full border-none bg-transparent p-0 text-sm text-[#343434] outline-none" />
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="flex h-64 w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
              </div>
            ) : (
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-[#D6D9DE]">
                    {columns.map((col, idx) => (
                      <th key={idx} className="px-2 py-3 text-left whitespace-nowrap">
                        <div className={`flex items-center gap-2 ${idx < columns.length - 1 ? "border-r border-[rgba(0,0,0,0.1)]" : ""} pr-2`}>
                          <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">{col.header}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                        {columns.map((col, colIdx) => (
                          <td key={colIdx} className="px-2 py-3 whitespace-nowrap">
                            {col.render ? (
                              col.render(row)
                            ) : col.key === "status" ? (
                              <div className="flex items-center gap-1.5">
                                <Image src={row.status ? "/dashboard/icons/tick-round-green.svg" : "/dashboard/icons/cross-round-red.svg"} alt="" width={14} height={14} />
                                <span className={`text-sm font-normal ${row.status ? "text-[#059669]" : "text-[#EF4444]"}`}>
                                  {row.status ? "Active" : "Inactive"}
                                </span>
                              </div>
                            ) : (
                              <span className={`text-sm ${colIdx === 0 ? "font-medium" : "font-normal text-[#343434] ${colIdx > 0 ? 'opacity-70' : ''}"}`}>
                                {row[col.key] || "—"}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={columns.length} className="px-2 py-10 text-center text-gray-400 font-medium font-onest whitespace-nowrap">No data found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          
            {openDropdownId && activeTab !== "Materials" && (
              <div 
                ref={dropdownRef}
                style={{ 
                  position: 'fixed', 
                  top: dropdownPos.top, 
                  left: dropdownPos.left,
                  zIndex: 9999 
                }}
                className="animate-in fade-in zoom-in duration-200"
              >
                {(() => {
                  const item = allData.find(i => i.id === openDropdownId);
                  if (!item) return null;
                  return (
                    <MasterDataMenu 
                      is_active={(item as any).status ?? true}
                      onDeactivate={() => handleToggleStatus(item)}
                      onEdit={() => {
                        setSelectedItem(item);
                        if (activeTab === "Wards/Zones") setIsWardDrawerOpen(true);
                        else if (activeTab === "Departments") setIsDepartmentDrawerOpen(true);
                        else if (activeTab === "Roles") setIsRoleDrawerOpen(true);
                        else if (activeTab === "Complaint Categories") setIsCategoryDrawerOpen(true);
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
    </div>
  );
}
