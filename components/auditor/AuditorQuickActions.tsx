import React from 'react';
import type { AuditorQuickActionItem } from '../../types';

interface AuditorQuickActionsProps {
  actions: AuditorQuickActionItem[];
  onAction: (actionId: string) => void;
}

export const AuditorQuickActions: React.FC<AuditorQuickActionsProps> = ({ actions, onAction }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-dark-border/30 hover:bg-dark-border/80 transition-colors duration-200 group"
        >
          <div className="text-3xl mb-2">{action.icon}</div>
          <span className="font-medium text-light-text text-sm">{action.text}</span>
        </button>
      ))}
    </div>
  );
};
