"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import TablePagination from "@/components/ui/TablePagination";
import VehicleFilterDrawer from "@/components/dashboard/authority/vehicle-entries/VehicleFilterDrawer";
import VehicleDetailDrawer from "@/components/dashboard/authority/vehicle-entries/VehicleDetailDrawer";

const ENTRIES_DATA = [
  {
    tokenNumber: "TKN-2025-014",
    hasWarning: true,
    warningText: "Dumping Pictures are not added.",
    vehicleNumber: "RJ24 AB 4587",
    naakaIncharge: "Kanhaiya Lal",
    materialType: "Cement",
    quantityEntered: "50 Bags",
    entryDate: "05 Oct 2025",
  },
  {
    tokenNumber: "TKN-2025-014",
    hasWarning: false,
    vehicleNumber: "RJ24 CD 9214",
    naakaIncharge: "Kanhaiya Lal",
    materialType: "Cement",
    quantityEntered: "40 Bags",
    entryDate: "06 Oct 2025",
  },
  {
    tokenNumber: "TKN-2025-019",
    hasWarning: false,
    vehicleNumber: "RJ38 EF 6671",
    naakaIncharge: "Bhavani Singh",
    materialType: "Sand",
    quantityEntered: "3 Ton",
    entryDate: "06 Oct 2025",
  },
  {
    tokenNumber: "TKN-2025-022",
    hasWarning: false,
    vehicleNumber: "RJ24 GH 1123",
    naakaIncharge: "Prithviraj Rathore",
    materialType: "Steel Rods",
    quantityEntered: "1.5 Ton",
    entryDate: "07 Oct 2025",
  },
  {
    tokenNumber: "TKN-2025-025",
    hasWarning: false,
    vehicleNumber: "RJ38 JK 9901",
    naakaIncharge: "Bhavani Singh",
    materialType: "Bricks",
    quantityEntered: "2,000 Units",
    entryDate: "07 Oct 2025",
  },
];

const WarningTooltip = ({ text }: { text: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute bottom-full left-1/2 z-[100] mb-2 -translate-x-1/2"
    >
      <div className="relative rounded-lg bg-[#343434] px-3 py-2 shadow-lg">
        <p className="whitespace-nowrap text-xs font-medium text-white">
          {text}
        </p>
        {/* Triangle Arrow */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-[#343434]" />
      </div>
    </motion.div>
  );
};

export default function AuthorityVehicleEntriesPage() {
  const [search, setSearch] = useState("");
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const handleEntryClick = (entry: any) => {
    setSelectedEntry(entry);
    setIsDetailDrawerOpen(true);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">Vehicle Entry Records</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            View and monitor vehicle-wise material entry details recorded at naka points against approved construction tokens.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex w-full flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">
          
          {/* Top Bar: Search and Filter */}
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

            {/* Filter Button */}
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4.66667H14M4 8H12M6.66667 11.3333H9.33333" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm font-normal text-[#343434]">Filter</span>
            </button>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b border-[#D6D9DE]">
                  {[
                    "Token Number",
                    "Vehicle Number",
                    "Naaka Incharge",
                    "Material Type",
                    "Quantity Entered",
                    "Entry Date & Time",
                  ].map((header, idx) => (
                    <th key={header} className="px-2 py-3 text-left">
                      <div className={`flex items-center gap-2 ${idx < 5 ? "border-r border-[rgba(0,0,0,0.1)]" : ""} pr-2`}>
                        <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">{header}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENTRIES_DATA.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => handleEntryClick(item)}
                          className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer"
                        >
                          {item.tokenNumber}
                        </span>
                        {item.hasWarning && (
                          <div 
                            className="relative flex items-center"
                            onMouseEnter={() => setHoveredToken(`${item.tokenNumber}-${idx}`)}
                            onMouseLeave={() => setHoveredToken(null)}
                          >
                            <Image 
                              src="/dashboard/icons/warning.svg" 
                              alt="Warning" 
                              width={15} 
                              height={13} 
                              className="cursor-help"
                            />
                            <AnimatePresence>
                              {hoveredToken === `${item.tokenNumber}-${idx}` && (
                                <WarningTooltip text={item.warningText || ""} />
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3 font-inter">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{item.vehicleNumber}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{item.naakaIncharge}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{item.materialType}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{item.quantityEntered}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{item.entryDate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <TablePagination
            currentPage={page}
            totalPages={10} // Mocked
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      </div>

      <VehicleFilterDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      />

      <VehicleDetailDrawer 
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        data={selectedEntry}
      />
    </div>
  );
}
