import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: TablePaginationProps) {
  const [showLimitDropdown, setShowLimitDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLimitDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const limitOptions = [10, 20, 50];

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-3">
        <span className="text-[12.77px] font-medium text-[#343434]">Show</span>
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setShowLimitDropdown(!showLimitDropdown)}
            className="flex items-center justify-between gap-2 rounded border border-[#C6CAD1] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-[14.9px] font-medium text-[#343434]">{limit}</span>
            <Image 
              src="/dashboard/icons/applications/chevron-down.svg" 
              alt="down" 
              width={10} 
              height={6} 
              className={`opacity-60 transition-transform ${showLimitDropdown ? "rotate-180" : ""}`} 
            />
          </div>
          {showLimitDropdown && (
            <div className="absolute bottom-full left-0 z-50 mb-1 w-full rounded border border-[#C6CAD1] bg-white shadow-lg animate-in fade-in slide-in-from-bottom-1 duration-200">
              {limitOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onLimitChange?.(option);
                    setShowLimitDropdown(false);
                  }}
                  className={`px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-100 ${limit === option ? "bg-gray-50 font-semibold text-[#0C83FF]" : "text-[#343434]"}`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="text-[12.77px] font-medium text-[#343434]">Row</span>
      </div>

      <div className="flex items-center gap-3 font-inter">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-[34px] w-[34px] items-center justify-center rounded bg-[#F5F6F7] hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M5 1L1 5L5 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, i) => (
              typeof p === 'number' ? (
                  <button
                      key={i}
                      onClick={() => onPageChange(p)}
                      className={`flex h-[35px] w-[35px] items-center justify-center rounded text-[12.77px] font-medium transition-all ${
                          currentPage === p ? "bg-[#0C83FF] text-white shadow-sm" : "bg-transparent text-[#343434] hover:bg-gray-100"
                      }`}
                  >
                      {p}
                  </button>
              ) : (
                  <span key={i} className="flex h-[35px] w-[35px] items-center justify-center text-[12.77px] font-medium text-[#343434] opacity-40">
                      ...
                  </span>
              )
          ))}
        </div>

        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="flex h-[34px] w-[34px] items-center justify-center rounded border border-[#C6CAD1] bg-[#F5F6F7] hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
