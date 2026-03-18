"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { logoutAction } from "@/app/actions/auth";
import ProfileDrawer from "./ProfileDrawer";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isAuthority = pathname?.startsWith("/authority");
  const displayName = isAuthority ? user?.name : user?.mobile;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is outside BOTH the dropdown and the button that opens it, close it
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const handleScroll = () => setIsDropdownOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 12,
        left: rect.right - 195,
      });
      setIsDropdownOpen(true);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

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
          <div 
            ref={triggerRef}
            onClick={handleProfileClick}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F5F6F7] py-2 pl-2 pr-3 hover:bg-gray-200 transition-colors"
          >
            <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-200 bg-white">
              <Image
                  src="/dashboard/icons/profile-avatar.svg"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="h-full w-full object-cover p-0.5"
              />
            </div>
            <span className="text-sm text-black font-medium">Hi, {displayName || "..."}</span>
            <svg
              width="8"
              height="5"
              viewBox="0 0 8 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`opacity-60 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
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

      {/* Profile Dropdown */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          style={{ 
            position: 'fixed', 
            top: dropdownPos.top, 
            left: dropdownPos.left,
            minWidth: '195px' 
          }}
          className="z-[9999] flex w-max flex-col gap-2 rounded-lg border border-[#D6D9DE] bg-white p-2 shadow-[0px_6px_12px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-200"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(false);
              setIsProfileDrawerOpen(true);
            }}
            className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Image src="/dashboard/icons/profile.svg" alt="Profile" width={24} height={24} />
            <span className="text-sm font-normal text-[#343434]">My profile</span>
          </button>
          <div className="h-[1px] w-full bg-[#D6D9DE]" />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Image src="/dashboard/icons/logout.svg" alt="Logout" width={24} height={24} />
            <span className="text-sm font-normal text-[#EF4444]">Logout</span>
          </button>
        </div>
      )}

      {/* Profile Drawer */}
      <ProfileDrawer 
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
      />
    </header>
  );
}
