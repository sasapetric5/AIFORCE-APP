import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { CrawlerCompatibilityData } from '../../types';

interface CrawlerCompatibilityProps {
  data: CrawlerCompatibilityData;
}

const statusClasses: Record<string, string> = {
    PASS: 'bg-green-500/20 text-green-300',
    WARNING: 'bg-yellow-500/20 text-yellow-300',
    FAIL: 'bg-red-500/20 text-red-300',
};

export const CrawlerCompatibility: React.FC<CrawlerCompatibilityProps> = ({ data }) => {
  const { tests = [], chartData = [], overallScore = 0 } = data || {};

  if (!data) {
    return <div className="text-center p-8 text-medium-text">Crawler compatibility data is unavailable.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
      <div className="lg:col-span-2 space-y-3">
        {tests.map(test => (
          <div key={test.id} className="flex justify-between items-center bg-dark-bg p-3 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{test.icon}</span>
              <div>
                <h4 className="font-semibold text-light-text">{test.name}</h4>
                <p className="text-xs text-medium-text">{test.description}</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusClasses[test.status]}`}>{test.status}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} labelLine={false}>
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Legend iconType="circle" wrapperStyle={{fontSize: "12px", marginTop: "10px"}}/>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2 pointer-events-none">
                <span className="text-3xl font-bold text-light-text">{overallScore}%</span>
            </div>
        </div>
        <div className="text-sm text-medium-text mt-4">Overall Compatibility</div>
      </div>
    </div>
  );
};
