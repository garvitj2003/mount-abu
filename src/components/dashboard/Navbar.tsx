"use client";

import Image from "next/image";
import { useUser } from "@/hooks/useUser";

export default function Navbar() {
  const { data: user } = useUser();

  return (
    <header className="flex h-[69px] w-full items-center border-b border-[#D6D9DE] bg-white font-onest">
      {/* Left Section - Aligned with Sidebar width */}
      <div className="flex w-[230px] items-center justify-between pl-5 pr-0">
        <div className="flex items-center gap-4">
          <Image
            src="/images/footer/logo.png"
            alt="Mount Abu Nagar Parishad"
            width={31}
            height={35}
            className="h-[35px] w-[31px] object-contain"
          />
          <div className="flex flex-col">
            <span className="text-[13px] font-medium uppercase leading-tight text-black">
              Mount abu
            </span>
            <span className="text-[13px] font-medium uppercase leading-tight text-black">
              nagar parishad
            </span>
          </div>
        </div>
        {/* Hanging Divider aligned to sidebar border (230px) */}
        <div className="h-6 w-[1px] bg-[#C6CAD1]" />
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-between px-5">
        <div /> {/* Spacer for flex-between if needed, or just items-center */}
        
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F5F6F7] py-2 pl-2 pr-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <Image
                src="/dashboard/icons/language.svg"
                alt="Language"
                width={14}
                height={14}
              />
            </div>
            <span className="text-sm text-black font-medium">Hindi</span>
            <svg
              width="8"
              height="5"
              viewBox="0 0 8 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-60"
            >
              <path
                d="M1 1L4 4L7 1"
                stroke="#343434"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-[#C6CAD1]" />

          {/* Notifications */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100">
            <Image
              src="/dashboard/icons/bell.svg"
              alt="Notifications"
              width={24}
              height={24}
            />
          </button>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-[#C6CAD1]" />

          {/* Help */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100">
            <Image
              src="/dashboard/icons/question-mark.svg"
              alt="Help"
              width={24}
              height={24}
            />
          </button>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-[#C6CAD1]" />

          {/* User Profile */}
          <div className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F5F6F7] py-2 pl-2 pr-3">
            <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-200 bg-white">
              <Image
                  src="/dashboard/icons/profile-avatar.svg"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="h-full w-full object-cover p-0.5"
              />
            </div>
            <span className="text-sm text-black font-medium">Hi, {user?.mobile || "..."}</span>
            <svg
              width="8"
              height="5"
              viewBox="0 0 8 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-60"
            >
              <path
                d="M1 1L4 4L7 1"
                stroke="#343434"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
