import React from 'react';
import { Goal } from '../../types';

interface GoalsTrackerProps {
  goals: Goal[];
}

export const GoalsTracker: React.FC<GoalsTrackerProps> = ({ goals }) => {
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-dark-text dark:text-light-text">{goal.title}</span>
            <span className="text-sm font-bold text-medium-text-light dark:text-medium-text">{goal.current} / {goal.target}</span>
          </div>
          <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2.5">
            <div
              className="bg-brand-primary h-2.5 rounded-full"
              style={{ width: `${(goal.current / goal.target) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};