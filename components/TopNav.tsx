

import React from 'react';
import { TOP_NAV_ITEMS } from '../constants';

interface TopNavProps {
  activeItem: string;
  setActiveItem: (id: string) => void;
}

const MODULE_NAV_ITEMS = [
  ...TOP_NAV_ITEMS,
  { id: 'geo_command_center', label: 'GEO Command Center' },
  { id: 'technical_geo_auditor', label: 'Technical Auditor' },
  { id: 'chatgpt_optimizer', label: 'ChatGPT Optimizer' },
  { id: 'perplexity_specialist', label: 'Perplexity Specialist' },
  { id: 'gemini_optimizer', label: 'Gemini Optimizer' },
  { id: 'claude_compatibility', label: 'Claude Compatibility' },
  { id: 'deepseek_specialist', label: 'DeepSeek Specialist' },
  { id: 'copilot_ready', label: 'Copilot Ready' },
  { id: 'predictive_visibility_forecaster', label: 'Predictive Forecaster' },
  { id: 'performance_analytics', label: 'Performance & ROI' },
];

// Deduplicate items based on id, preferring the original TOP_NAV_ITEMS
const visibleNavItems = [
    ...TOP_NAV_ITEMS,
    ...MODULE_NAV_ITEMS.filter(moduleItem => !TOP_NAV_ITEMS.find(navItem => navItem.id === moduleItem.id))
].filter((value, index, self) =>
    index === self.findIndex((t) => (t.id === value.id))
);

export const TopNav: React.FC<TopNavProps> = ({ activeItem, setActiveItem }) => {
  // Show only specific module navs when they are active
  const isModuleActive = MODULE_NAV_ITEMS.some(item => item.id === activeItem);
  const itemsToShow = isModuleActive ? visibleNavItems.filter(item => TOP_NAV_ITEMS.some(i => i.id === item.id) || item.id === activeItem) : TOP_NAV_ITEMS;


  return (
    <nav className="bg-light-card/80 dark:bg-slate-900/60 backdrop-blur-xl border-b border-light-border dark:border-white/10 px-4 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap">
      <div className="flex items-center space-x-2">
        {itemsToShow.map(item => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveItem(item.id);
            }}
            className={`relative px-3 py-2.5 text-sm font-medium transition-colors duration-200 rounded-md ${
              activeItem === item.id
                ? 'text-dark-text dark:text-light-text'
                : 'text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text'
            }`}
            aria-current={activeItem === item.id ? 'page' : undefined}
          >
            {activeItem === item.id && (
                <span className="absolute inset-0 bg-slate-200 dark:bg-slate-700/50 rounded-md z-0"></span>
            )}
            <span className="relative z-10">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};
