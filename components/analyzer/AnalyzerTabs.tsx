import React from 'react';

interface AnalyzerTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = ['dashboard', 'analytics', 'optimization', 'reports', 'settings'];

export const AnalyzerTabs: React.FC<AnalyzerTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-dark-border/50 rounded-lg flex items-center p-1">
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === tab
              ? 'bg-brand-primary text-white'
              : 'text-medium-text hover:bg-dark-border hover:text-light-text'
          }`}
          aria-current={activeTab === tab ? 'page' : undefined}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  );
};
