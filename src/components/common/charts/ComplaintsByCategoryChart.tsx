"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CategoryData {
  category: string;
  count: number;
}

interface ComplaintsByCategoryChartProps {
  data: CategoryData[];
  barColor?: string;
}

export const ComplaintsByCategoryChart = ({ 
  data, 
  barColor = "#3B83F6" 
}: ComplaintsByCategoryChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 h-full">
        <div className="flex gap-1 items-end h-20 opacity-20">
          <div className="w-6 bg-gray-300 rounded-t h-10" />
          <div className="w-6 bg-gray-300 rounded-t h-16" />
          <div className="w-6 bg-gray-300 rounded-t h-8" />
        </div>
        <p className="text-[11px] font-medium text-gray-400">No category data available</p>
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
          <XAxis 
            dataKey="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#6D727A' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#6D727A' }}
          />
          <Tooltip 
            cursor={{ fill: '#F5F6F7' }}
            contentStyle={{ fontSize: '10px', borderRadius: '8px' }}
          />
          <Bar dataKey="count" fill={barColor} radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
