import React from 'react';
import type { AnalyzerQuickAction } from '../../types';

interface AnalyzerQuickActionsProps {
  actions: AnalyzerQuickAction[];
  onAction: (actionId: string) => void;
}

export const AnalyzerQuickActions: React.FC<AnalyzerQuickActionsProps> = ({ actions, onAction }) => {
  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <button
          key={action.id}
          className="w-full text-left p-4 rounded-lg bg-dark-border/30 hover:bg-dark-border/80 transition-colors duration-200 group"
          onClick={() => onAction(action.id)}
        >
          <div>
            <span className="font-medium text-light-text">{action.title}</span>
            <p className="text-xs text-medium-text">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};
