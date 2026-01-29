"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// --- Icons ---

type IconType = "applications" | "complaints" | "token";

const DashboardIcon = ({
  type,
  color = "#343434",
}: {
  type: IconType;
  color?: string;
}) => {
  switch (type) {
    case "applications":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 11C20 11 20 9.4306 19.8478 9.06306C19.6955 8.69552 19.4065 8.40649 18.8284 7.82843L14.0919 3.09188C13.593 2.593 13.3436 2.34355 13.0345 2.19575C12.9702 2.165 12.9044 2.13772 12.8372 2.11401C12.5141 2 12.1614 2 11.4558 2C8.21082 2 6.58831 2 5.48933 2.88607C5.26731 3.06508 5.06508 3.26731 4.88607 3.48933C4 4.58831 4 6.21082 4 9.45584V14C4 17.7712 4 19.6569 5.17157 20.8284C6.34315 22 8.22876 22 12 22M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 19H15.5754C14.6713 19 14.2192 19 14.0534 18.7463C13.8875 18.4927 14.1201 18.157 14.5853 17.4855L15.0384 16.8315C15.1519 16.6677 15.2086 16.5858 15.227 16.4938C15.2454 16.4019 15.2238 16.3083 15.1805 16.1209L14.9669 15.1961C14.8391 14.6427 14.7753 14.366 14.9485 14.183C15.1217 14 15.4475 14 16.0992 14H17.9008C18.5525 14 18.8783 14 19.0515 14.183C19.2248 14.366 19.1609 14.6427 19.0331 15.1961L18.8195 16.1209C18.7762 16.3083 18.7546 16.4019 18.773 16.4938C18.7914 16.5858 18.8481 16.6677 18.9616 16.8315L19.4147 17.4855C19.8799 18.157 20.1125 18.4927 19.9466 18.7463C19.7808 19 19.3287 19 18.4246 19H17ZM17 19V22"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "complaints":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.9961 9.01264H17.0042M17.0045 7.00903V4.50451M22 6.792C22 9.43833 19.7593 11.584 16.9961 11.584C16.6711 11.5844 16.3472 11.5543 16.028 11.4943C15.7983 11.4511 15.6835 11.4296 15.6033 11.4418C15.523 11.454 15.4094 11.5145 15.1822 11.6356C14.5393 11.9778 13.7896 12.0987 13.0686 11.9645C13.3426 11.627 13.5298 11.2222 13.6123 10.7882C13.6624 10.5228 13.5384 10.2649 13.3526 10.0762C12.5093 9.21878 11.9922 8.06347 11.9922 6.792C11.9922 4.14565 14.2328 2 16.9961 2C19.7593 2 22 4.14565 22 6.792Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.50189 22H4.71817C4.39488 22 4.07021 21.9545 3.77327 21.8269C2.80666 21.4116 2.31624 20.8633 2.08769 20.5202C1.95764 20.325 1.97617 20.0764 2.11726 19.889C3.23716 18.4015 5.8337 17.503 7.50189 17.5029M7.50665 22H10.2904C10.6137 22 10.9383 21.9545 11.2353 21.8269C12.2019 21.4116 12.6923 20.8633 12.9209 20.5202C13.0509 20.325 13.0324 20.0764 12.8913 19.889C11.7714 18.4015 9.17484 17.503 7.50665 17.5029M10.2854 12.2888C10.2854 13.8201 9.0413 15.0614 7.50665 15.0614C5.97199 15.0614 4.72791 13.8201 4.72791 12.2888C4.72791 10.7575 5.97199 9.51611 7.50665 9.51611C9.0413 9.51611 10.2854 10.7575 10.2854 12.2888Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "token":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 12C2.5 7.77027 2.5 5.6554 3.69797 4.25276C3.86808 4.05358 4.05358 3.86808 4.25276 3.69797C5.6554 2.5 7.77027 2.5 12 2.5C16.2297 2.5 18.3446 2.5 19.7472 3.69797C19.9464 3.86808 20.1319 4.05358 20.302 4.25276C21.5 5.6554 21.5 7.77027 21.5 12C21.5 16.2297 21.5 18.3446 20.302 19.7472C20.1319 19.9464 19.9464 20.1319 19.7472 20.302C18.3446 21.5 16.2297 21.5 12 21.5C7.77027 21.5 5.6554 21.5 4.25276 20.302C4.05358 20.1319 3.86808 19.9464 3.69797 19.7472C2.5 18.3446 2.5 16.2297 2.5 12Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M11.5384 7.2534C11.7534 6.91553 12.2466 6.91553 12.4616 7.2534L13.0837 8.23082C13.7716 9.3117 14.6883 10.2284 15.7692 10.9163L16.7466 11.5384C17.0845 11.7534 17.0845 12.2466 16.7466 12.4616L15.7692 13.0837C14.6883 13.7716 13.7716 14.6883 13.0837 15.7692L12.4616 16.7466C12.2466 17.0845 11.7534 17.0845 11.5384 16.7466L10.9163 15.7692C10.2284 14.6883 9.3117 13.7716 8.23082 13.0837L7.2534 12.4616C6.91553 12.2466 6.91553 11.7534 7.2534 11.5384L8.23082 10.9163C9.3117 10.2284 10.2284 9.3117 10.9163 8.23082L11.5384 7.2534Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

// --- Stat Card ---

interface StatCardProps {
  title: string;
  count: string;
  subtext: string;
  iconType: IconType;
  color: string;
}

export const StatCard = ({
  title,
  count,
  subtext,
  iconType,
  color,
}: StatCardProps) => {
  return (
    <div className="flex h-full min-w-[200px] flex-1 flex-col justify-between rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#343434]">{title}</span>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span
            className="text-4xl font-semibold"
            style={{ color: color }}
          >
            {count}
          </span>
          <DashboardIcon type={iconType} color={color} />
        </div>
        <span className="text-[11px] font-light text-[#6D727A]">
          {subtext}
        </span>
      </div>
    </div>
  );
};

// --- Charts ---

const MATERIAL_USAGE_DATA = [
  { name: "Permitted", value: 65, color: "#3B83F6" },
  { name: "Used", value: 35, color: "#12B981" },
];

export const MaterialUsageChart = () => {
  return (
    <div className="flex flex-col items-center justify-center p-2 h-full">
      <div className="h-[180px] w-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={MATERIAL_USAGE_DATA}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {MATERIAL_USAGE_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-5">
        {MATERIAL_USAGE_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] font-medium text-[#343434]">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AVAILABLE_QUANTITY_DATA = [
  { name: "Cement", value: 30, color: "#3B83F6" },
  { name: "Sand", value: 25, color: "#F58646" },
  { name: "Bricks", value: 20, color: "#26A69A" },
  { name: "Steel", value: 15, color: "#EF4444" },
  { name: "Concrete", value: 5, color: "#634E87" },
  { name: "Others", value: 5, color: "#FFD648" },
];

export const AvailableQuantityChart = () => {
  return (
    <div className="flex flex-col items-center justify-center p-2 h-full">
      <div className="h-[180px] w-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={AVAILABLE_QUANTITY_DATA}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {AVAILABLE_QUANTITY_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-x-5 gap-y-3">
        {AVAILABLE_QUANTITY_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] font-medium text-[#343434]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MATERIAL_BREAKDOWN_DATA = [
  { name: "Cement (bags)", permitted: 500, used: 250, percentage: 50 },
  { name: "Bricks (nos)", permitted: 400, used: 200, percentage: 50 },
  { name: "Steel (kg)", permitted: 200, used: 100, percentage: 50 },
  { name: "Sand (bags)", permitted: 800, used: 400, percentage: 50 },
];

export const MaterialBreakdown = () => {
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between px-3 text-[9px] font-semibold text-[#343434] opacity-60">
        <span className="w-1/3">Material</span>
        <span className="w-1/6 text-left">Permited</span>
        <span className="w-1/6 text-left">Used</span>
        <span className="w-1/3 text-right">Usage %</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {MATERIAL_BREAKDOWN_DATA.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between rounded-md px-3 py-1 ${
              index % 2 !== 0 ? "bg-[#F7F7F7]" : ""
            }`}
          >
            <span className="w-1/3 text-[9px] text-[#343434]">
              {item.name}
            </span>
            <span className="w-1/6 text-[10px] text-[#343434]">
              {item.permitted}
            </span>
            <span className="w-1/6 text-[10px] text-[#343434]">
              {item.used}
            </span>
            <div className="flex w-1/3 items-center justify-end gap-1.5">
              <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-[#0C83FF]"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-5 text-right text-[9px] text-[#343434]">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
