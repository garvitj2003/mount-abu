"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AvailableQuantityData {
  material_name: string;
  available_quantity: number;
  [key: string]: any;
}

interface AvailableQuantityChartProps {
  data: AvailableQuantityData[];
}

const COLORS = ["#3B83F6", "#F58646", "#26A69A", "#EF4444", "#634E87", "#FFD648"];

const EmptyChartPlaceholder = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-6">
    <div className="flex size-32 items-center justify-center rounded-full bg-gray-50 border-2 border-dashed border-gray-200">
      <div className="size-20 rounded-full bg-gray-100/50" />
    </div>
    <p className="text-[11px] font-medium text-gray-400">{message}</p>
  </div>
);

export const AvailableQuantityChart = ({ data }: AvailableQuantityChartProps) => {
  if (data.length === 0 || data.every(d => d.available_quantity === 0)) {
    return <EmptyChartPlaceholder message="No available materials" />;
  }

  const chartData = data.map((item, idx) => ({
    name: item.material_name,
    value: item.available_quantity,
    color: COLORS[idx % COLORS.length]
  }));

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
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ fontSize: '10px', borderRadius: '8px' }}
              formatter={(value: any) => [`${value}`, 'Available']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] font-medium text-[#343434] truncate max-w-[60px]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
