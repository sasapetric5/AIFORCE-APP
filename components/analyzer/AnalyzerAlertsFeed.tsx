import React from 'react';
import type { AnalyzerAlert } from '../../types';

interface AlertsFeedProps {
  alerts: AnalyzerAlert[];
}

const alertColors: Record<AnalyzerAlert['type'], string> = {
    critical: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
    success: 'text-green-400',
}

export const AnalyzerAlertsFeed: React.FC<AlertsFeedProps> = ({ alerts }) => {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="border-b border-dark-border pb-3 last:border-b-0 last:pb-0">
          <div className={`font-semibold text-sm flex items-center ${alertColors[alert.type]}`}>
            <span className="mr-2 text-lg">{alert.icon}</span>
            {alert.title}
            </div>
          <p className="text-xs text-medium-text mt-1 ml-7">{alert.message}</p>
          <p className="text-xs text-gray-500 mt-1 ml-7">{alert.time}</p>
        </div>
      ))}
    </div>
  );
};
