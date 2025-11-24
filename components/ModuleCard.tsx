import React from 'react';
import type { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  onClick: (moduleId: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  const handleCardClick = () => {
    onClick(module.id);
  };
  
  const IconComponent = module.icon;

  return (
    <div
      className={`bg-light-card/40 dark:bg-slate-900/40 backdrop-blur-xl border border-light-border dark:border-white/10 rounded-2xl shadow-lg p-6 flex flex-col cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-primary/20 border-t-4 ${module.borderColor} group`}
      onClick={handleCardClick}
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
      role="button"
      tabIndex={0}
      aria-label={`Open ${module.title} module`}
    >
      <div className="mb-4 text-brand-primary group-hover:text-brand-secondary transition-colors duration-300" aria-hidden="true">
        <IconComponent className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-bold text-dark-text dark:text-light-text mb-2">{module.title}</h3>
      <p className="text-medium-text-light dark:text-medium-text text-sm mb-4 flex-grow">{module.description}</p>
      <ul className="space-y-2 text-sm mb-4">
        {module.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-brand-primary mr-2 mt-1 text-xs" aria-hidden="true">◆</span>
            <span className="text-medium-text-light dark:text-medium-text">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center">
        <span className={`h-2.5 w-2.5 rounded-full mr-2 ${module.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} aria-hidden="true"></span>
        <span className={`text-sm font-semibold ${module.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{module.status}</span>
      </div>
    </div>
  );
};