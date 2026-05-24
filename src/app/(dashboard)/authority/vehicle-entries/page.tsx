"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import TablePagination from "@/components/ui/TablePagination";
import VehicleFilterDrawer from "@/components/dashboard/authority/vehicle-entries/VehicleFilterDrawer";
import VehicleDetailDrawer from "@/components/dashboard/authority/vehicle-entries/VehicleDetailDrawer";
import { useVehicleEntries } from "@/hooks/useVehicleEntries";
import { format } from "date-fns";
import { usePagination } from "@/hooks/usePagination";

const WarningTooltip = ({ text, index }: { text: string; index: number }) => {
  const isFirstFewRows = index < 3;
  return (
    <motion.div
      initial={{ opacity: 0, y: isFirstFewRows ? -10 : 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isFirstFewRows ? -10 : 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute left-1/2 z-[100] -translate-x-1/2 ${
        isFirstFewRows ? "top-full mt-2" : "bottom-full mb-2"
      }`}
    >
      <div className="relative rounded-lg bg-[#343434] px-3 py-2 shadow-lg">
        <p className="whitespace-nowrap text-xs font-medium text-white">
          {text}
        </p>
        {/* Triangle Arrow */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 border-x-8 border-x-transparent ${
            isFirstFewRows 
              ? "bottom-full border-b-8 border-b-[#343434]" 
              : "top-full border-t-8 border-t-[#343434]"
          }`} 
        />
      </div>
    </motion.div>
  );
};

const MaterialsTooltip = ({ materials, index }: { materials: { material_name: string; quantity: number; unit: string }[], index: number }) => {
  const isFirstFewRows = index < 3;
  return (
    <motion.div
      initial={{ opacity: 0, y: isFirstFewRows ? -10 : 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isFirstFewRows ? -10 : 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute left-1/2 z-[100] -translate-x-1/2 ${
        isFirstFewRows ? "top-full mt-2" : "bottom-full mb-2"
      }`}
    >
      <div className="relative rounded-lg bg-[#343434] px-4 py-3 shadow-xl w-max max-w-[320px]">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider border-b border-white/10 pb-1 mb-1">
            Material Breakdown
          </p>
          {materials.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-white">{m.material_name}</span>
              <span className="text-xs font-bold text-[#0C83FF]">{m.quantity} {m.unit}</span>
            </div>
          ))}
        </div>
        {/* Triangle Arrow */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 border-x-8 border-x-transparent ${
            isFirstFewRows 
              ? "bottom-full border-b-8 border-b-[#343434]" 
              : "top-full border-t-8 border-t-[#343434]"
          }`} 
        />
      </div>
    </motion.div>
  );
};

export default function AuthorityVehicleEntriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<{
    token_number?: string[];
    vehicle_number?: string[];
    material_name?: string[];
    start_date?: string;
    end_date?: string;
  }>({});
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const [hoveredMaterials, setHoveredMaterials] = useState<number | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const { page, limit, setPage, setLimit } = usePagination();

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search or filters change
  const prevParams = useRef({ search: debouncedSearch, filters });
  useEffect(() => {
    if (debouncedSearch !== prevParams.current.search || JSON.stringify(filters) !== JSON.stringify(prevParams.current.filters)) {
      prevParams.current = { search: debouncedSearch, filters };
      if (page !== 1) {
        setPage(1);
      }
    }
  }, [debouncedSearch, filters, page, setPage]);

  const requestParams = useMemo(() => {
    const params: any = {
      search: debouncedSearch || undefined,
      offset: (page - 1) * limit,
      limit,
    };

    if (filters.token_number && filters.token_number.length > 0) params.token_number = filters.token_number;
    if (filters.vehicle_number && filters.vehicle_number.length > 0) params.vehicle_number = filters.vehicle_number;
    if (filters.material_name && filters.material_name.length > 0) params.material_name = filters.material_name;
    if (filters.start_date && filters.start_date !== "") params.start_date = filters.start_date;
    if (filters.end_date && filters.end_date !== "") params.end_date = filters.end_date;

    return params;
  }, [debouncedSearch, filters, page, limit]);

  const { data: entries = [], isLoading } = useVehicleEntries(requestParams);

  const handleEntryClick = (id: number) => {
    setSelectedEntryId(id);
    setIsDetailDrawerOpen(true);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        return acc + value.length;
      }
      return acc + (value && value !== "" ? 1 : 0);
    }, 0);
  }, [filters]);

  // Since API doesn't return total count, we estimate total pages
  const totalPages = useMemo(() => {
    if (entries.length < limit) return page;
    return page + 1;
  }, [entries.length, page, limit]);

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
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] outline-none placeholder:text-[#343434]/60 focus:ring-0"
              />
            </div>

            {/* Filter Button */}
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="relative flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4.66667H14M4 8H12M6.66667 11.3333H9.33333" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm font-normal text-[#343434]">Filter</span>
              {activeFiltersCount > 0 && (
                <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0C83FF] text-[10px] font-bold text-white ring-2 ring-white">
                  {activeFiltersCount}
                </div>
              )}
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
                    "Materials",
                    "Entry Date & Time",
                  ].map((header, idx) => (
                    <th key={header} className="px-2 py-3 text-left">
                      <div className={`flex items-center gap-2 ${idx < 4 ? "border-r border-[rgba(0,0,0,0.1)]" : ""} pr-2`}>
                        <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">{header}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                   <tr>
                     <td colSpan={5} className="px-2 py-8 text-center text-sm text-[#343434]/60">
                       <div className="flex justify-center items-center gap-2">
                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0C83FF] border-t-transparent"></div>
                         <span>Loading vehicle entries...</span>
                       </div>
                     </td>
                   </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-2 py-8 text-center text-sm text-[#343434]/60">
                      No vehicle entries found.
                    </td>
                  </tr>
                ) : (
                  entries.map((item, index) => (
                    <tr key={item.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <span 
                            onClick={() => handleEntryClick(item.id)}
                            className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer"
                          >
                            {item.token_number || "N/A"}
                          </span>
                          {!item.has_dumping_photos && (
                            <div 
                              className="relative flex items-center"
                              onMouseEnter={() => setHoveredToken(item.id)}
                              onMouseLeave={() => setHoveredToken(null)}
                            >
                              <Image 
                                src="/dashboard/icons/warning.svg" 
                                alt="Warning" 
                                width={15} 
                                height={13} 
                                className="cursor-pointer"
                              />
                              <AnimatePresence>
                                {hoveredToken === item.id && (
                                  <WarningTooltip text="Dumping Pictures are not added." index={index} />
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 font-inter">
                        <span className="text-sm font-normal text-[#343434] opacity-70">{item.vehicle_number}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-70">{item.naka_incharge_name}</span>
                      </td>
                      <td className="px-2 py-3">
                        <div 
                          className="relative inline-flex items-center"
                          onMouseEnter={() => setHoveredMaterials(item.id)}
                          onMouseLeave={() => setHoveredMaterials(null)}
                        >
                          <span className="text-sm font-medium text-[#0C83FF] cursor-pointer border-b border-dotted border-[#0C83FF]">
                            {item.materials.length} {item.materials.length === 1 ? "Material" : "Materials"}
                          </span>
                          <AnimatePresence>
                            {hoveredMaterials === item.id && (
                              <MaterialsTooltip materials={item.materials} index={index} />
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-70">
                          {format(new Date(item.entry_at), "dd MMM yyyy hh:mm a")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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

      <VehicleFilterDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      />

      <VehicleDetailDrawer 
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedEntryId(null);
        }}
        entryId={selectedEntryId}
      />
    </div>
  );
}
