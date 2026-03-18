"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MaterialUsageData {
  permitted_quantity: number;
  used_quantity: number;
  [key: string]: any;
}

interface MaterialUsageChartProps {
  data: MaterialUsageData[];
}

const EmptyChartPlaceholder = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-6">
    <div className="flex size-32 items-center justify-center rounded-full bg-gray-50 border-2 border-dashed border-gray-200">
      <div className="size-20 rounded-full bg-gray-100/50" />
    </div>
    <p className="text-[11px] font-medium text-gray-400">{message}</p>
  </div>
);

export const MaterialUsageChart = ({ data }: MaterialUsageChartProps) => {
  const totalPermitted = data.reduce((acc, curr) => acc + (curr.permitted_quantity || 0), 0);
  const totalUsed = data.reduce((acc, curr) => acc + (curr.used_quantity || 0), 0);

  if (totalPermitted === 0 && totalUsed === 0) {
    return <EmptyChartPlaceholder message="No material data available" />;
  }

  const chartData = [
    { name: "Permitted", value: totalPermitted, color: "#3B83F6" },
    { name: "Used", value: totalUsed, color: "#12B981" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-2 h-full w-full">
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ fontSize: '10px', borderRadius: '8px' }}
              formatter={(value: any) => [`${value}`, 'Quantity']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-5">
        {chartData.map((item) => (
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
