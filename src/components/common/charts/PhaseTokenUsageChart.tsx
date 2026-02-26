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
} from "recharts";

interface PhaseTokenUsageData {
  phase_status: string;
  count: number;
  [key: string]: any;
}

interface PhaseTokenUsageChartProps {
  data: PhaseTokenUsageData[];
}

export const PhaseTokenUsageChart = ({ data }: PhaseTokenUsageChartProps) => {
  if (data.length === 0 || data.every(d => d.count === 0)) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="flex gap-1 items-end h-16">
          <div className="w-4 bg-gray-100 rounded-t h-8" />
          <div className="w-4 bg-gray-100 rounded-t h-12" />
          <div className="w-4 bg-gray-100 rounded-t h-6" />
        </div>
        <p className="text-[11px] font-medium text-gray-400">No token usage data</p>
      </div>
    );
  }

  return (
    <div className="h-[120px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
          <XAxis 
            dataKey="phase_status" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: '#6D727A' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: '#6D727A' }}
          />
          <Tooltip 
            cursor={{ fill: '#F5F6F7' }}
            contentStyle={{ fontSize: '10px', borderRadius: '8px' }}
          />
          <Bar dataKey="count" fill="#0C83FF" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
