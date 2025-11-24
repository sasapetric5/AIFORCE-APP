import React from 'react';
import { GeoPlatform } from '../../types';

interface PlatformCardProps {
  platform: GeoPlatform;
}

const TrendArrow: React.FC<{ trend: number }> = ({ trend }) => {
  const isUp = trend >= 0;
  return (
    <span className={`flex items-center text-xs font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
      {isUp ? '▲' : '▼'} {Math.abs(trend)}%
    </span>
  );
};

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform }) => {
  const platformColors: Record<string, string> = {
    gemini: 'border-blue-500',
    chatgpt: 'border-green-500',
    perplexity: 'border-purple-500',
    claude: 'border-orange-500',
    copilot: 'border-cyan-500',
    deepseek: 'border-gray-400',
    mistral: 'border-rose-500',
    llama: 'border-yellow-500',
    poe: 'border-indigo-500',
  };

  return (
    <div className={`bg-slate-100 dark:bg-dark-border/30 rounded-lg p-4 shadow-md border-l-4 ${platformColors[platform.id]}`}>
      <div className="flex justify-between items-start">
        <div className="font-bold text-dark-text dark:text-light-text flex items-center">
          <span className="text-xl mr-2">{platform.icon}</span> {platform.name}
        </div>
        <TrendArrow trend={platform.trend} />
      </div>
      <div className="text-4xl font-bold text-dark-text dark:text-light-text my-3">{platform.score}</div>
      <div className="text-xs text-medium-text-light dark:text-medium-text">
        Overall Visibility Score
      </div>
    </div>
  );
};