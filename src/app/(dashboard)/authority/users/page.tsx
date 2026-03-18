"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useUsers } from "@/hooks/useUser";
import { useDepartments } from "@/hooks/useMasterData";
import { type components } from "@/types/api";
import NewUserDrawer from "@/components/dashboard/authority/users/NewUserDrawer";
import ResetPasswordDrawer from "@/components/dashboard/authority/users/ResetPasswordDrawer";
import UserMenu from "@/components/dashboard/authority/users/UserMenu";
import DropdownSelect from "@/components/ui/DropdownSelect";
import TablePagination from "@/components/ui/TablePagination";

type UserRole = components["schemas"]["UserRole"];
type UserResponse = components["schemas"]["UserResponse"];

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  NODAL_OFFICER: "Nodal Officer",
  COMMISSIONER: "Commissioner",
  NAKA_INCHARGE: "Naka Incharge",
  DEPT_LAND: "Land Dept",
  DEPT_LEGAL: "Legal Dept",
  DEPT_ATP: "ATP Dept",
  JEN: "Junior Engineer",
  CITIZEN: "Citizen"
};

export default function AuthorityUserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [deptFilter, setDeptFilter] = useState<string | number>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });
  const limit = 10;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // Fetch only OFFICIAL users as per requirement
  const { data: usersData, isLoading } = useUsers("OFFICIAL");
  const { data: departments } = useDepartments();

  const users = usersData || [];

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(search.toLowerCase())) ||
      user.mobile.includes(search);
    
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    
    // Note: The UserResponse currently does NOT have department_id.
    // If it did, we would filter here. For now, we can only filter by role/search.
    const matchesDept = deptFilter === "All"; 

    return matchesSearch && matchesRole && matchesDept;
  });

  // Pagination Logic
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  // Click Outside Handler
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

  const handleActionClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 189, 
      });
      setOpenDropdownId(id);
    }
  };

  // Prepare Options
  const roleOptions = [
    { label: "All Role", value: "All" },
    ...Object.entries(ROLE_LABELS).map(([key, label]) => ({ label, value: key }))
  ];

  const deptOptions = [
    { label: "All Department", value: "All" },
    ...(departments?.map((dept) => ({ label: dept.name, value: dept.id })) || [])
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" }
  ];

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">User Management</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            Create and manage system users, assign roles, and control access across municipal operations.
          </p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="rounded-lg cursor-pointer bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          Add New User
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex w-full flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">
          
          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] outline-none placeholder:text-[#343434]/60 focus:ring-0"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-2 h-9">
              {/* Role Dropdown */}
              <DropdownSelect
                options={roleOptions}
                value={roleFilter}
                onChange={(val) => {
                  setRoleFilter(val as string);
                  setPage(1);
                }}
                className="w-[140px] h-full"
              />

              {/* Department Divider */}
              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

              {/* Department Dropdown */}
              <DropdownSelect
                options={deptOptions}
                value={deptFilter}
                onChange={(val) => {
                  setDeptFilter(val);
                  setPage(1);
                }}
                className="w-[160px] h-full"
                disabled // Data missing
              />

              {/* Status Divider */}
              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

              {/* Status Dropdown */}
              <DropdownSelect
                options={statusOptions}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as string)}
                className="w-[120px] h-full"
                disabled // Field missing in API
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b border-[#D6D9DE]">
                  <th className="px-2 py-3 text-left w-[20%]">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Full Name</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left w-[15%]">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Username</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left w-[15%]">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Role</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left w-[15%]">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Department</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left w-[15%]">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Mobile Number</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left w-[15%]">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Status</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left w-[40px]"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={7} className="px-2 py-10 text-center">
                            <div className="flex justify-center items-center gap-2">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0C83FF] border-t-transparent"></div>
                                <span className="text-sm text-gray-500">Loading users...</span>
                            </div>
                        </td>
                    </tr>
                ) : paginatedUsers.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-2 py-10 text-center text-sm text-gray-500">
                            No users found.
                        </td>
                    </tr>
                ) : (
                    paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                        <td className="px-2 py-3">
                        <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{user.name}</span>
                        </td>
                        <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-70">{user.username || "—"}</span>
                        </td>
                        <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-70">
                            {ROLE_LABELS[user.role] || user.role}
                        </span>
                        </td>
                        <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-70">
                            {/* UserResponse lacks department_id currently. Placeholder logic or fetch if updated. */}
                            —
                        </span>
                        </td>
                        <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-70">{user.mobile}</span>
                        </td>
                        <td className="px-2 py-3">
                        <div className="flex items-center gap-1.5">
                            {/* API doesn't have status, assume Active for now */}
                            <Image 
                            src="/dashboard/icons/tick-round-green.svg"
                            alt="Active" 
                            width={14} 
                            height={14} 
                            />
                            <span className="text-sm font-normal text-[#059669]">
                            Active
                            </span>
                        </div>
                        </td>
                        <td className="px-2 py-3 text-center">
                        <button 
                            ref={el => { triggerRefs.current[user.id] = el }}
                            onClick={(e) => handleActionClick(e, user.id)}
                            className="text-[#343434] hover:bg-gray-200 rounded p-1 transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* User Action Menu Dropdown */}
          {openDropdownId && (
            <div 
              ref={dropdownRef}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                position: 'fixed', 
                top: dropdownPos.top, 
                left: dropdownPos.left,
                zIndex: 9999 
              }}
              className="animate-in fade-in zoom-in duration-200"
            >
              <UserMenu 
                onEdit={() => {
                  console.log("Edit user", openDropdownId);
                  setOpenDropdownId(null);
                }}
                onDelete={() => {
                  console.log("Delete user", openDropdownId);
                  setOpenDropdownId(null);
                }}
                onDeactivate={() => {
                  console.log("Deactivate user", openDropdownId);
                  setOpenDropdownId(null);
                }}
                onResetPassword={() => {
                  const user = users.find(u => u.id === openDropdownId);
                  if (user) {
                    setSelectedUser(user);
                    setIsResetPasswordOpen(true);
                  }
                  setOpenDropdownId(null);
                }}
              />
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
      
      {/* New User Drawer */}
      <NewUserDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      {/* Reset Password Drawer */}
      <ResetPasswordDrawer 
        isOpen={isResetPasswordOpen} 
        onClose={() => setIsResetPasswordOpen(false)} 
        user={selectedUser}
      />
    </div>
  );
}
