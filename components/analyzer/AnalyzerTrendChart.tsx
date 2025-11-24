import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AnalyzerTrendData } from '../../types';

interface AnalyzerTrendChartProps {
  data: AnalyzerTrendData;
}

export const AnalyzerTrendChart: React.FC<AnalyzerTrendChartProps> = ({ data }) => {
    const chartData = data.labels.map((label, index) => ({
        name: label,
        'Your Visibility': data.your_visibility[index],
        'Competitor Average': data.competitor_avg[index],
    }));

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[40, 100]} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '0.5rem' }} labelStyle={{ color: '#E2E8F0' }} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="Your Visibility" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Competitor Average" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
