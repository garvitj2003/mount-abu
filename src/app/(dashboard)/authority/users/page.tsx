"use client";

import { useState } from "react";
import Image from "next/image";

const USERS_DATA = [
  {
    name: "Amit Sharma",
    username: "amit.sharma",
    role: "Commissioner",
    department: "ULB",
    mobile: "98XXXX4321",
    status: "Active",
  },
  {
    name: "Rajesh Patel",
    username: "rajesh.patel",
    role: "Junior Engineer",
    department: "UIT",
    mobile: "97XXXX9812",
    status: "Active",
  },
  {
    name: "Suresh Meena",
    username: "suresh.meena",
    role: "Nodal Officer",
    department: "ULB + UIT",
    mobile: "99XXXX5678",
    status: "Active",
  },
  {
    name: "Kiran Solanki",
    username: "kiran.solanki",
    role: "nagarparishad@m...",
    department: "System",
    mobile: "96XXXX2211",
    status: "Disabled",
  },
  {
    name: "Mahesh Rawat",
    username: "mahesh.rawat",
    role: "Naka Incharge",
    department: "Field",
    mobile: "95XXXX7788",
    status: "Active",
  },
];

export default function AuthorityUserManagementPage() {
  const [search, setSearch] = useState("");

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
        <button className="rounded-lg cursor-pointer bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors">
          Add New User
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">
          
          {/* Filters Row */}
          <div className="flex items-center justify-between gap-4">
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
            <div className="flex items-center gap-2">
              {/* Role Dropdown */}
              <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-normal text-[#343434]">All Role</span>
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
              </div>

              {/* Department Divider */}
              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

              {/* Department Dropdown */}
              <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-normal text-[#343434]">All Department</span>
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
              </div>

              {/* Status Divider */}
              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

              {/* Status Dropdown */}
              <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-normal text-[#343434]">All Status</span>
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
              </div>
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
                {USERS_DATA.map((user, idx) => (
                  <tr key={idx} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3">
                      <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{user.name}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{user.username}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{user.role}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{user.department}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{user.mobile}</span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1.5">
                        <Image 
                          src={user.status === "Active" ? "/dashboard/icons/tick-round-green.svg" : "/dashboard/icons/cross-round-red.svg"} 
                          alt={user.status} 
                          width={14} 
                          height={14} 
                        />
                        <span className={`text-sm font-normal ${user.status === "Active" ? "text-[#059669]" : "text-[#EF4444]"}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button className="text-[#343434] hover:bg-gray-200 rounded p-1 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            {/* Rows per page */}
            <div className="flex items-center gap-3">
              <span className="text-[12.77px] font-medium text-[#343434]">Show</span>
              <div className="flex items-center justify-between gap-2 rounded border border-[#C6CAD1] bg-white px-3 py-2">
                <span className="text-[14.9px] font-medium text-[#343434]">10</span>
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} />
              </div>
              <span className="text-[12.77px] font-medium text-[#343434]">Row</span>
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-3 font-inter">
              <button className="flex h-[34px] w-[34px] items-center justify-center rounded bg-[#F5F6F7] hover:bg-gray-200">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M5 1L1 5L5 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-1">
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-[#0C83FF] text-[12.77px] font-medium text-white">1</button>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">2</button>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">3</button>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">4</button>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">5</button>
                <span className="flex h-[35px] w-[35px] items-center justify-center text-[12.77px] font-medium text-[#343434]">...</span>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">10</button>
              </div>
              <button className="flex h-[34px] w-[34px] items-center justify-center rounded border border-[#C6CAD1] bg-[#F5F6F7] hover:bg-gray-200">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M1 1L5 5L1 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
