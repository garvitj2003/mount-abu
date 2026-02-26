"use client";

import React from "react";

interface MaterialUsageData {
  material_name: string;
  unit: string;
  permitted_quantity: number;
  used_quantity: number;
  usage_percent: number;
  [key: string]: any;
}

interface MaterialBreakdownProps {
  data: MaterialUsageData[];
}

export const MaterialBreakdown = ({ data }: MaterialBreakdownProps) => {
  if (data.length === 0) {
    return <div className="py-16 text-center text-[11px] font-medium text-gray-400">No material usage breakdown available</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between px-3 text-[9px] font-semibold text-[#343434] opacity-60">
        <span className="w-1/3">Material</span>
        <span className="w-1/6 text-left">Permitted</span>
        <span className="w-1/6 text-left">Used</span>
        <span className="w-1/3 text-right">Usage %</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between rounded-md px-3 py-1 ${
              index % 2 !== 0 ? "bg-[#F7F7F7]" : ""
            }`}
          >
            <span className="w-1/3 text-[9px] text-[#343434] truncate">
              {item.material_name} ({item.unit})
            </span>
            <span className="w-1/6 text-[10px] text-[#343434]">
              {item.permitted_quantity}
            </span>
            <span className="w-1/6 text-[10px] text-[#343434]">
              {item.used_quantity}
            </span>
            <div className="flex w-1/3 items-center justify-end gap-1.5">
              <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-[#0C83FF]"
                  style={{ width: `${item.usage_percent}%` }}
                />
              </div>
              <span className="w-5 text-right text-[9px] text-[#343434]">
                {Math.round(item.usage_percent || 0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
