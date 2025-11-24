
import React from 'react';
import type { PlatformScore } from '../types';

const MOCK_PLATFORM_SCORES: PlatformScore[] = [
  { name: 'Gemini', score: 92, color: 'bg-blue-500' },
  { name: 'ChatGPT', score: 85, color: 'bg-green-500' },
  { name: 'Perplexity', score: 89, color: 'bg-purple-500' },
  { name: 'Claude', score: 78, color: 'bg-orange-500' },
  { name: 'Copilot', score: 81, color: 'bg-cyan-500' },
];

export const PlatformBreakdown: React.FC = () => {
  return (
    <div className="space-y-4">
      {MOCK_PLATFORM_SCORES.map((platform) => (
        <div key={platform.name}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-light-text">{platform.name}</span>
            <span className="text-sm font-bold text-medium-text">{platform.score}</span>
          </div>
          <div className="w-full bg-dark-border rounded-full h-2">
            <div
              className={`${platform.color} h-2 rounded-full`}
              style={{ width: `${platform.score}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
