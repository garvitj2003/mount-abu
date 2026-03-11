"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface StatusData {
  status: string;
  count: number;
  color: string;
}

interface ApplicationsByStatusChartProps {
  data: StatusData[];
}

export const ApplicationsByStatusChart = ({ data }: ApplicationsByStatusChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-6">
        <div className="flex size-32 items-center justify-center rounded-full bg-gray-50 border-2 border-dashed border-gray-200">
          <div className="size-20 rounded-full bg-gray-100/50" />
        </div>
        <p className="text-[11px] font-medium text-gray-400">No status data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 h-full w-full">
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={0}
              dataKey="count"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ fontSize: '10px', borderRadius: '8px' }}
              formatter={(value: any) => [`${value}`, 'Applications']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] font-medium text-[#343434]">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
