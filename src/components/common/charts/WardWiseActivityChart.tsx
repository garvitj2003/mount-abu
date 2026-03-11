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
  Legend,
} from "recharts";

interface WardActivityData {
  ward: string;
  applications: number;
  approved: number;
  complaints: number;
  tokens: number;
}

interface WardWiseActivityChartProps {
  data: WardActivityData[];
}

export const WardWiseActivityChart = ({ data }: WardWiseActivityChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 h-full w-full">
        <p className="text-[11px] font-medium text-gray-400">No activity data available</p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
          <XAxis 
            dataKey="ward" 
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
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
          />
          <Bar dataKey="applications" name="Applications" fill="#3B83F6" radius={[2, 2, 0, 0]} />
          <Bar dataKey="approved" name="Approved" fill="#12B981" radius={[2, 2, 0, 0]} />
          <Bar dataKey="complaints" name="Complaints" fill="#634E87" radius={[2, 2, 0, 0]} />
          <Bar dataKey="tokens" name="Tokens" fill="#F58646" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
