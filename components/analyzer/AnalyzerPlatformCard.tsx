import React from 'react';
import type { AnalyzerPlatform } from '../../types';

interface AnalyzerPlatformCardProps {
  platform: AnalyzerPlatform;
  onClick: (platformId: string) => void;
}

const platformColors: Record<string, string> = {
  'chatgpt': 'border-teal-600',
  'perplexity': 'border-purple-600',
  'gemini': 'border-blue-600',
  'claude': 'border-orange-500',
  'copilot': 'border-cyan-500'
};

export const AnalyzerPlatformCard: React.FC<AnalyzerPlatformCardProps> = ({ platform, onClick }) => {
  return (
    <div
      className={`bg-dark-border/30 rounded-lg p-4 shadow-md transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-brand-primary/20 border-l-4 ${platformColors[platform.id] || 'border-gray-500'} cursor-pointer`}
      onClick={() => onClick(platform.id)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick(platform.id)}
    >
      <div className="font-bold text-light-text mb-2 flex items-center">
         <span className="text-xl mr-2">{platform.icon}</span> {platform.name}
      </div>
      <div className="text-3xl font-bold text-light-text my-2">{platform.score}</div>
      <div className="text-xs text-medium-text">
        <div>Citations: {platform.citations}</div>
        <div>Position: {platform.position}</div>
      </div>
    </div>
  );
};
