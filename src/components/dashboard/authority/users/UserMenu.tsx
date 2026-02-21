"use client";

import Image from "next/image";

interface UserMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDeactivate?: () => void;
  onResetPassword?: () => void;
}

export default function UserMenu({
  onEdit,
  onDelete,
  onDeactivate,
  onResetPassword,
}: UserMenuProps) {
  return (
    <div className="flex w-[189px] flex-col gap-2 rounded-lg border border-[#D6D9DE] bg-white p-2 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] font-onest">
      {/* Edit */}
      <button 
        onClick={onEdit}
        className="flex w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="relative h-6 w-6 shrink-0">
          <Image 
            src="/dashboard/icons/edit-pencil.svg" 
            alt="Edit" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="text-sm font-normal text-[#343434]">Edit</span>
      </button>

      {/* Delete */}
      <button 
        onClick={onDelete}
        className="flex w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="relative h-6 w-6 shrink-0">
          <Image 
            src="/dashboard/icons/users/delete.svg" 
            alt="Delete" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="text-sm font-normal text-[#EF4444]">Delete</span>
      </button>

      {/* Deactivate User */}
      <button 
        onClick={onDeactivate}
        className="flex w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="relative h-6 w-6 shrink-0">
          <Image 
            src="/dashboard/icons/users/block.svg" 
            alt="Deactivate" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="text-sm font-normal text-[#343434]">Deactivate User</span>
      </button>

      {/* Divider */}
      <div className="h-[1px] w-full bg-[#D6D9DE]" />

      {/* Reset Password */}
      <button 
        onClick={onResetPassword}
        className="flex w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="relative h-6 w-6 shrink-0">
          <Image 
            src="/dashboard/icons/users/reset-password.svg" 
            alt="Reset Password" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="text-sm font-normal text-[#8E70C1]">Reset Password</span>
      </button>
    </div>
  );
}
