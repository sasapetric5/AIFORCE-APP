import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GeoTrendData } from '../../types';

interface VisibilityTrendChartProps {
  data: GeoTrendData;
}

export const VisibilityTrendChart: React.FC<VisibilityTrendChartProps> = ({ data }) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    'Your Visibility': data.scores[index],
    'Competitor Average': data.competitorScores[index],
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.2} strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 12 }} domain={[60, 95]} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '0.5rem' }} labelStyle={{ color: '#E2E8F0' }} />
          <Legend wrapperStyle={{fontSize: "12px"}}/>
          <Line type="monotone" dataKey="Your Visibility" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Competitor Average" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};