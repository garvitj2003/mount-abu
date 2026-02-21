import Image from "next/image";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  limit?: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  limit = 10,
  onPageChange,
}: TablePaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-3">
        <span className="text-[12.77px] font-medium text-[#343434]">Show</span>
        <div className="flex items-center justify-between gap-2 rounded border border-[#C6CAD1] bg-white px-3 py-2">
          <span className="text-[14.9px] font-medium text-[#343434]">{limit}</span>
          <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
        </div>
        <span className="text-[12.77px] font-medium text-[#343434]">Row</span>
      </div>

      <div className="flex items-center gap-3 font-inter">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-[34px] w-[34px] items-center justify-center rounded bg-[#F5F6F7] hover:bg-gray-200 disabled:opacity-50"
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
                      className={`flex h-[35px] w-[35px] items-center justify-center rounded text-[12.77px] font-medium ${
                          currentPage === p ? "bg-[#0C83FF] text-white" : "bg-transparent text-[#343434] hover:bg-gray-50"
                      }`}
                  >
                      {p}
                  </button>
              ) : (
                  <span key={i} className="flex h-[35px] w-[35px] items-center justify-center text-[12.77px] font-medium text-[#343434]">
                      ...
                  </span>
              )
          ))}
        </div>

        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex h-[34px] w-[34px] items-center justify-center rounded border border-[#C6CAD1] bg-[#F5F6F7] hover:bg-gray-200 disabled:opacity-50"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
