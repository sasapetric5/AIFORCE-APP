import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CoreVital, PerformanceTrendPoint } from '../../types';

interface PerformanceExcellenceProps {
  vitals: CoreVital[];
  trendData: PerformanceTrendPoint[];
}

const ratingClasses: Record<string, { bar: string, text: string }> = {
    good: { bar: 'bg-green-500', text: 'text-green-400' },
    needs_improvement: { bar: 'bg-yellow-500', text: 'text-yellow-400' },
    poor: { bar: 'bg-red-500', text: 'text-red-400' },
};

const MetricBar: React.FC<{ vital: CoreVital }> = ({ vital }) => {
    if (!vital) return null;
    const ratingInfo = ratingClasses[vital.rating] || { bar: 'bg-gray-500', text: 'text-gray-400' };

    return (
        <div>
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-light-text">{vital.name || 'Unknown'}</span>
                <span className={`font-semibold ${ratingInfo.text}`}>{vital.value || 'N/A'}</span>
            </div>
            <div className="w-full bg-dark-border rounded-full h-2">
                <div
                    className={`${ratingInfo.bar} h-2 rounded-full`}
                    style={{ width: `${vital.score || 0}%` }}
                ></div>
            </div>
            <p className="text-xs text-medium-text mt-1">{vital.target || 'No target'}</p>
        </div>
    );
};

export const PerformanceExcellence: React.FC<PerformanceExcellenceProps> = ({ vitals, trendData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-light-text">Core Web Vitals</h4>
        {(vitals && vitals.length > 0) ? vitals.map(vital => (
          vital && <MetricBar key={vital.id} vital={vital} />
        )) : <p className="text-sm text-medium-text">Core Vitals data unavailable.</p>}
      </div>
      <div className="h-80">
        <h4 className="text-lg font-semibold text-light-text mb-4">Performance Trends</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }} labelStyle={{ color: '#E2E8F0' }} />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Line type="monotone" dataKey="Performance Score" stroke="#4F46E5" strokeWidth={2} />
            <Line type="monotone" dataKey="AI Crawler Score" stroke="#7C3AED" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
