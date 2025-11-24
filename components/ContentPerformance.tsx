

import React from 'react';
import type { ContentPerformanceItem } from '../types';

const MOCK_CONTENT_PERFORMANCE: ContentPerformanceItem[] = [
  { title: 'Ultimate Guide to AI SEO', platform: 'ChatGPT', citations: 124, traffic: '+15%', conversion: '+5.2%' },
  { title: 'Top 10 LLM Trends in 2024', platform: 'Gemini', citations: 98, traffic: '+12%', conversion: '+4.1%' },
  { title: 'How to Optimize for Perplexity', platform: 'Perplexity', citations: 85, traffic: '+18%', conversion: '+6.5%' },
  { title: 'Claude 3 Opus vs GPT-4', platform: 'Claude', citations: 72, traffic: '+9%', conversion: '+3.0%' },
  { title: 'Integrating Copilot into Your Workflow', platform: 'Copilot', citations: 65, traffic: '+7%', conversion: '+2.5%' },
];

// FIX: Added missing platform colors ('DeepSeek', 'Mistral', 'Llama', 'Poe') to the `platformColors` object to satisfy the `Record<PlatformName, string>` type.
const platformColors: Record<ContentPerformanceItem['platform'], string> = {
    'ChatGPT': 'bg-green-500/20 text-green-400',
    'Gemini': 'bg-blue-500/20 text-blue-400',
    'Perplexity': 'bg-purple-500/20 text-purple-400',
    'Claude': 'bg-orange-500/20 text-orange-400',
    'Copilot': 'bg-cyan-500/20 text-cyan-400',
    'DeepSeek': 'bg-gray-500/20 text-gray-400',
    'Mistral': 'bg-rose-500/20 text-rose-400',
    'Llama': 'bg-yellow-500/20 text-yellow-400',
    'Poe': 'bg-indigo-500/20 text-indigo-400',
}

export const ContentPerformance: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-medium-text">
        <thead className="text-xs text-medium-text uppercase bg-dark-bg">
          <tr>
            <th scope="col" className="px-6 py-3">Content</th>
            <th scope="col" className="px-6 py-3">Platform</th>
            <th scope="col" className="px-6 py-3 text-center">Citations</th>
            <th scope="col" className="px-6 py-3 text-center">Traffic</th>
            <th scope="col" className="px-6 py-3 text-center">Conversion</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_CONTENT_PERFORMANCE.map((item, index) => (
            <tr key={index} className="border-b border-dark-border hover:bg-dark-border/50">
              <th scope="row" className="px-6 py-4 font-medium text-light-text whitespace-nowrap">
                {item.title}
              </th>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${platformColors[item.platform]}`}>
                    {item.platform}
                </span>
              </td>
              <td className="px-6 py-4 text-center">{item.citations}</td>
              <td className="px-6 py-4 text-green-400 font-semibold text-center">{item.traffic}</td>
              <td className="px-6 py-4 text-green-400 font-semibold text-center">{item.conversion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};