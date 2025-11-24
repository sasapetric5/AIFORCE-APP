import React from 'react';

const QUICK_ACTIONS = [
  { id: 'audit', label: 'Launch Full GEO Audit', icon: '🔍' },
  { id: 'optimize', label: 'Optimize Top Content', icon: '📝' },
  { id: 'report', label: 'Generate Weekly Report', icon: '📊' },
  { id: 'alert', label: 'Configure Smart Alerts', icon: '🔔' },
];

interface GeoQuickActionsProps {
  onAction: (actionId: string) => void;
}

export const GeoQuickActions: React.FC<GeoQuickActionsProps> = ({ onAction }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-slate-100 dark:bg-dark-border/30 hover:bg-slate-200 dark:hover:bg-dark-border/80 transition-colors duration-200 group"
          onClick={() => onAction(action.id)}
        >
          <div className="text-3xl mb-2">{action.icon}</div>
          <span className="font-medium text-dark-text dark:text-light-text text-sm">{action.label}</span>
        </button>
      ))}
    </div>
  );
};