"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  {
    name: "Dashboard",
    href: "/citizen",
    icon: "/dashboard/icons/dashboard.svg",
    activeIcon: "/dashboard/icons/dashboard-active.svg",
  },
  {
    name: "Applications",
    href: "/citizen/applications",
    icon: "/dashboard/icons/applications.svg",
    activeIcon: "/dashboard/icons/applications-active.svg",
  },
  {
    name: "Complains",
    href: "/citizen/complaints",
    icon: "/dashboard/icons/complaints.svg",
    activeIcon: "/dashboard/icons/complaints-active.svg",
  },
  {
    name: "Tokens",
    href: "/citizen/tokens",
    icon: "/dashboard/icons/tokens.svg",
    activeIcon: "/dashboard/icons/token-active.svg",
  },
];

export default function SidebarCitizen() {
  const pathname = usePathname();

  return (
    <aside className="h-full min-h-[calc(100vh-69px)] w-[230px] border-r border-[#D6D9DE] bg-white pt-5 font-onest">
      <div className="px-5">
        <h2 className="mb-[25px] text-xs font-medium uppercase tracking-[0.04em] text-[#343434] opacity-70">
          Citizen Dashboard
        </h2>
        <nav className="flex flex-col gap-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-[11px] rounded-lg px-2 py-2 transition-colors ${
                  isActive
                    ? "bg-[#E7F3FF]"
                    : "bg-transparent hover:bg-gray-50"
                }`}
              >
                <div className="relative h-6 w-6 shrink-0">
                  <Image
                    src={isActive ? item.activeIcon : item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span
                  className={`text-sm ${
                    isActive
                      ? "font-semibold text-[#0C83FF]"
                      : "font-normal text-[#343434]"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
