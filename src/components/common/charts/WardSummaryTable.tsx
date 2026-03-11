"use client";

import React from "react";

interface WardSummaryRow {
  ward: string;
  applications: number;
  approved: number;
  tokensIssued: number;
  complaints: number;
}

interface WardSummaryTableProps {
  data: WardSummaryRow[];
}

export const WardSummaryTable = ({ data }: WardSummaryTableProps) => {
  if (!data || data.length === 0) {
    return <div className="py-16 text-center text-[11px] font-medium text-gray-400">No ward summary available</div>;
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#D6D9DE]">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-[#D6D9DE] bg-gray-50">
            <th className="p-3 text-[11px] font-bold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Ward</th>
            <th className="p-3 text-[11px] font-bold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Applications</th>
            <th className="p-3 text-[11px] font-bold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Approved</th>
            <th className="p-3 text-[11px] font-bold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Tokens Issued</th>
            <th className="p-3 text-[11px] font-bold text-[#333333] opacity-70 uppercase">Complaints</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-[#D6D9DE] last:border-0 hover:bg-gray-50 transition-colors">
              <td className="p-3 text-[13px] font-medium text-[#0C83FF] underline cursor-pointer border-r border-[#D6D9DE]">
                {row.ward}
              </td>
              <td className="p-3 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE]">
                {row.applications}
              </td>
              <td className="p-3 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE]">
                {row.approved}
              </td>
              <td className="p-3 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE]">
                {row.tokensIssued}
              </td>
              <td className="p-3 text-[13px] font-medium text-[#343434]">
                {row.complaints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
