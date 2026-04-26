"use client";

import Image from "next/image";

interface MasterDataMenuProps {
  onEdit?: () => void;
  onDeactivate?: () => void;
  onDelete?: () => void;
  is_active?: boolean;
}

export default function MasterDataMenu({
  onEdit,
  onDeactivate,
  onDelete,
  is_active = true,
}: MasterDataMenuProps) {
  return (
    <div className="flex w-[160px] flex-col gap-2 rounded-lg border border-[#D6D9DE] bg-white p-2 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] font-onest">
      {/* Edit */}
      <button 
        onClick={onEdit}
        className="flex w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-50 transition-colors text-left cursor-pointer"
      >
        <div className="relative h-5 w-5 shrink-0">
          <Image 
            src="/dashboard/icons/edit-pencil.svg" 
            alt="Edit" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="text-sm font-normal text-[#343434]">Edit</span>
      </button>

      {/* Deactivate / Activate */}
      <button 
        onClick={onDeactivate}
        className="flex w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-50 transition-colors text-left cursor-pointer"
      >
        <div className="relative h-5 w-5 shrink-0">
          <Image 
            src={is_active ? "/dashboard/icons/users/block.svg" : "/dashboard/icons/users/unblock.svg"} 
            alt={is_active ? "Deactivate" : "Activate"} 
            fill 
            className="object-contain"
          />
        </div>
        <span className="text-sm font-normal text-[#343434]">
            {is_active ? "Deactivate" : "Activate"}
        </span>
      </button>

      {/* Delete */}
      {onDelete && (
        <>
          <div className="h-[1px] w-full bg-[#D6D9DE]" />
          <button 
            onClick={onDelete}
            className="flex w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="relative h-5 w-5 shrink-0">
              <Image 
                src="/dashboard/icons/users/delete.svg" 
                alt="Delete" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="text-sm font-normal text-[#EF4444]">Delete</span>
          </button>
        </>
      )}
    </div>
  );
}
