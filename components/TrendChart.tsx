
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendDataPoint } from '../types';

const generateTrendData = (days: number): TrendDataPoint[] => {
  const data: TrendDataPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      'Visibility Score': Math.floor(Math.random() * 20) + 65 + Math.sin(i / (days / 5)) * 10,
      'Competitor Score': Math.floor(Math.random() * 15) + 55 + Math.cos(i / (days / 5)) * 8,
    });
  }
  return data;
};

export const TrendChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<30 | 60 | 90>(30);
  
  const data = useMemo(() => generateTrendData(timeRange), [timeRange]);

  const timeRanges: {label: string; value: 30|60|90}[] = [
    { label: '30d', value: 30 },
    { label: '60d', value: 60 },
    { label: '90d', value: 90 },
  ];

  return (
    <div className="w-full h-56">
      <div className="flex justify-end items-center mb-2 -mt-2">
         <span className="text-sm font-semibold text-medium-text mr-4">Trend Analysis</span>
        <div className="flex space-x-1 bg-dark-border p-1 rounded-md">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                timeRange === range.value ? 'bg-brand-primary text-white' : 'text-medium-text hover:bg-dark-card'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '0.5rem' }} labelStyle={{ color: '#E2E8F0' }} />
          <Legend wrapperStyle={{fontSize: "12px"}}/>
          <Line type="monotone" dataKey="Visibility Score" stroke="#4F46E5" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Competitor Score" stroke="#7C3AED" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
