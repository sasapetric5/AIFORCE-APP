import React from 'react';
import { GeoAlert } from '../../types';

interface AlertsFeedProps {
  alerts: GeoAlert[];
}

const alertTypeClasses = {
  critical: 'border-red-500/50',
  opportunity: 'border-blue-500/50',
  success: 'border-green-500/50',
};

export const AlertsFeed: React.FC<AlertsFeedProps> = ({ alerts }) => {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className={`p-3 rounded-lg bg-slate-100 dark:bg-dark-border/20 border-l-4 ${alertTypeClasses[alert.type]}`}>
          <div className="flex items-start">
            <span className="text-xl mr-3 mt-1">{alert.icon}</span>
            <div>
              <p className="font-semibold text-dark-text dark:text-light-text text-sm">{alert.title}</p>
              <p className="text-xs text-medium-text-light dark:text-medium-text mt-1">{alert.description}</p>
            </div>
          </div>
          <p className="text-right text-xs text-gray-400 dark:text-gray-500 mt-2">{alert.time}</p>
        </div>
      ))}
    </div>
  );
};