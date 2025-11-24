import React from 'react';
import type { AuditorOverviewMetric } from '../../types';

interface AuditorOverviewProps {
  data: AuditorOverviewMetric[];
}

export const AuditorOverview: React.FC<AuditorOverviewProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-medium-text">Overview data is unavailable.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map(metric => (
        <div key={metric.id} className={`bg-dark-border/30 rounded-lg p-5 text-center shadow-md border-l-4 ${metric.borderColor}`}>
          <div className="text-4xl mb-3">{metric.icon}</div>
          <div className="text-3xl font-bold text-light-text">{metric.value}</div>
          <div className="text-sm text-medium-text mb-2">{metric.label}</div>
          <div className={`text-xs font-semibold ${metric.trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {metric.trend}
          </div>
        </div>
      ))}
    </div>
  );
};
