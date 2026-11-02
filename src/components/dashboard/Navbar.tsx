"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { logoutAction } from "@/app/actions/auth";
import ProfileDrawer from "./ProfileDrawer";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";

export default function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { data: user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Notifications state
  const isEligibleForNotifications =
    user?.role === "NODAL_OFFICER" ||
    user?.role === "COMMISSIONER" ||
    user?.role === "SUPERADMIN";

  const { data: notificationsData, markAllAsRead } = useNotifications(Boolean(isEligibleForNotifications));
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifPos, setNotifPosition] = useState({ top: 0, left: 0 });
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const notifTriggerRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notificationsData?.unread_count || 0;
  const notificationsList = notificationsData?.items || [];

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

      if (
        notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node) &&
        notifTriggerRef.current && !notifTriggerRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    const handleScroll = () => {
      setIsDropdownOpen(false);
      setIsNotifOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEligibleForNotifications) return;

    if (isNotifOpen) {
      setIsNotifOpen(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setNotifPosition({
        top: rect.bottom + 12,
        left: Math.max(10, rect.right - 340),
      });
      setIsNotifOpen(true);
      // Automatically mark all unread as read upon opening banner
      if (unreadCount > 0) {
        markAllAsRead();
      }
    }
  };

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
    queryClient.clear();
    await logoutAction();
    router.push("/login");
  };

  return (
    <header className="flex h-[69px] w-full items-center border-b border-[#D6D9DE] bg-white font-onest">
      {/* Left Section - Aligned with Sidebar width */}
      <div className="flex w-[230px] items-center justify-between pl-5 pr-0">
        <Link className="flex items-center gap-4" href={"/"}>
          <Image
            src="/images/footer/logo.png"
            alt="Mount Abu Nagar Palika"
            width={31}
            height={35}
            className="h-[35px] w-[31px] object-contain"
          />
          <div className="flex flex-col">
            <span className="text-[13px] font-medium uppercase leading-tight text-black">
              Mount abu
            </span>
            <span className="text-[13px] font-medium uppercase leading-tight text-black">
              nagar palika
            </span>
          </div>
        </Link>
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
          {isEligibleForNotifications ? (
            <button
              ref={notifTriggerRef}
              onClick={handleNotificationClick}
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              title="Notifications"
            >
              <Image
                src="/dashboard/icons/bell.svg"
                alt="Notifications"
                width={24}
                height={24}
              />
              {unreadCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full opacity-40 cursor-not-allowed">
              <Image
                src="/dashboard/icons/bell.svg"
                alt="Notifications"
                width={24}
                height={24}
              />
            </div>
          )}

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

      {/* Notification Dropdown */}
      {isNotifOpen && (
        <div
          ref={notifDropdownRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: notifPos.top,
            left: notifPos.left,
            width: '360px',
            maxHeight: '480px',
          }}
          className="z-[9999] flex flex-col rounded-xl border border-[#D6D9DE] bg-white shadow-[0px_10px_25px_rgba(0,0,0,0.12)] overflow-hidden animate-in fade-in zoom-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F0F2F5] px-4 py-3 bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#1E293B]">Notifications</span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-[#EF4444] px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount} new
                </span>
              ) : (
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  Inbox
                </span>
              )}
            </div>
            <button
              onClick={() => setIsNotifOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col divide-y divide-gray-100 overflow-y-auto max-h-[380px]">
            {notificationsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <Image src="/dashboard/icons/bell.svg" alt="" width={32} height={32} className="opacity-30 mb-2" />
                <p className="text-xs font-medium text-gray-500">No notifications yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">When respondent takes action on your objection, alerts appear here.</p>
              </div>
            ) : (
              notificationsList.map((notif) => {
                const formattedTime = new Date(notif.created_at).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setIsNotifOpen(false);
                      if (notif.application_id) {
                        router.push(`/authority/applications/${notif.application_id}`);
                      }
                    }}
                    className={`flex flex-col gap-1 p-3.5 transition-colors cursor-pointer hover:bg-blue-50/60 ${
                      !notif.is_read ? "bg-[#F0F7FF]" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {!notif.is_read && (
                          <span className="h-2 w-2 rounded-full bg-[#0C83FF] shrink-0" />
                        )}
                        <h4 className="text-xs font-bold text-[#1E293B] truncate">
                          {notif.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                        {formattedTime}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed pl-3.5">
                      {notif.message}
                    </p>
                    {notif.application_id && (
                      <span className="text-[11px] font-semibold text-[#0C83FF] pl-3.5 hover:underline mt-0.5 inline-block">
                        View Application →
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

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
