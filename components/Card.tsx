import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-light-card/40 dark:bg-slate-900/40 backdrop-blur-xl border border-light-border dark:border-white/10 rounded-2xl shadow-lg ${className}`}>
      <div className="p-4 sm:p-6 border-b border-light-border dark:border-white/10">
        <h3 className="text-lg font-semibold text-dark-text dark:text-light-text">{title}</h3>
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};