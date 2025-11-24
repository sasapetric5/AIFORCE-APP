import React from 'react';
import { MODULES_DATA } from '../constants';
import { ModuleCard } from './ModuleCard';

interface DashboardProps {
  onModuleClick: (moduleId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onModuleClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {MODULES_DATA.map((module) => (
        <ModuleCard key={module.id} module={module} onClick={onModuleClick} />
      ))}
    </div>
  );
};