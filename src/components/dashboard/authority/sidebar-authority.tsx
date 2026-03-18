"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { ROLE_PERMISSIONS } from "@/lib/role-permissions";
import { useMemo } from "react";



const MENU_ITEMS = [
  {
    name: "Dashboard",
    href: "/authority",
    icon: "/dashboard/icons/dashboard.svg",
    activeIcon: "/dashboard/icons/dashboard-active.svg",
  },
  {
    name: "Applications",
    href: "/authority/applications",
    icon: "/dashboard/icons/applications.svg",
    activeIcon: "/dashboard/icons/applications-active.svg",
  },
  {
    name: "Complains",
    href: "/authority/complaints",
    icon: "/dashboard/icons/complaints.svg",
    activeIcon: "/dashboard/icons/complaints-active.svg",
  },
  {
    name: "Token Management",
    href: "/authority/tokens",
    icon: "/dashboard/icons/tokens.svg",
    activeIcon: "/dashboard/icons/token-active.svg",
  },
  {
    name: "Vehicle Entries",
    href: "/authority/vehicle-entries",
    icon: "/dashboard/icons/vehicle.svg",
    activeIcon: "/dashboard/icons/vehicle-active.svg",
  },
  {
    name: "Reports & Analytics",
    href: "/authority/reports",
    icon: "/dashboard/icons/report.svg",
    activeIcon: "/dashboard/icons/report-active.svg",
  },
  {
    name: "Website Content",
    href: "/authority/website-content",
    icon: "/dashboard/icons/website.svg",
    activeIcon: "/dashboard/icons/website-active.svg",
  },
  {
    name: "User Management",
    href: "/authority/users",
    icon: "/dashboard/icons/user-manage.svg",
    activeIcon: "/dashboard/icons/user-manage-active.svg",
  },
  {
    name: "Master Data",
    href: "/authority/master-data",
    icon: "/dashboard/icons/master-data.svg",
    activeIcon: "/dashboard/icons/master-data-active.svg",
  },
  {
    name: "Audit & Logs",
    href: "/authority/audit-logs",
    icon: "/dashboard/icons/audit.svg",
    activeIcon: "/dashboard/icons/audit-active.svg",
  },
];

export default function SidebarAuthority() {
  const pathname = usePathname();
  const { data: user, isLoading } = useUser();
  const role = user?.role;
  type AuthorityRole = keyof typeof ROLE_PERMISSIONS;
  
  const filteredMenuItems = useMemo(() => {
    if (!role) return [];
    // Superadmin can see all items
    if (role === "SUPERADMIN") return MENU_ITEMS;
    const allowedRoutes = ROLE_PERMISSIONS[role as AuthorityRole] ?? [];
    return MENU_ITEMS.filter((item) => {
      // Always allow the main dashboard link
      if (item.href === "/authority") return true;
      // Check if any allowed route is a prefix of the item's href
      return allowedRoutes.some((allowedPath) => item.href.startsWith(allowedPath));
    });
  }, [role]);

  if (isLoading) {
    return (
      <aside className="h-full min-h-[calc(100vh-69px)] w-[230px] border-r border-[#D6D9DE] bg-white pt-5 font-onest">
        {/* Loading skeleton can be added here */}
      </aside>
    );
  }

  return (
    <aside className="h-full min-h-[calc(100vh-69px)] w-[230px] border-r border-[#D6D9DE] bg-white pt-5 font-onest">
      <div className="px-5">
        <h2 className="mb-[25px] text-xs font-medium uppercase tracking-[0.04em] text-[#343434] opacity-70">
          Admin Dashboard
        </h2>
        <nav className="flex flex-col gap-2 pb-5">
          {filteredMenuItems.map((item) => {
            const isActive =
              item.href === "/authority"
                ? pathname === "/authority"
                : pathname.startsWith(item.href);

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

