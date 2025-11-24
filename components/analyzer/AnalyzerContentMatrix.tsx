import React from 'react';
import type { AnalyzerContent } from '../../types';

interface AnalyzerContentMatrixProps {
  content: AnalyzerContent[];
}

const platformColors: Record<string, string> = {
    'ChatGPT': 'bg-green-500/20 text-green-400',
    'Gemini': 'bg-blue-500/20 text-blue-400',
    'Perplexity': 'bg-purple-500/20 text-purple-400',
    'Claude': 'bg-orange-500/20 text-orange-400',
    'Copilot': 'bg-cyan-500/20 text-cyan-400',
};

export const AnalyzerContentMatrix: React.FC<AnalyzerContentMatrixProps> = ({ content }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-medium-text">
        <thead className="text-xs text-medium-text uppercase bg-dark-bg">
          <tr>
            <th scope="col" className="px-6 py-3">Content</th>
            <th scope="col" className="px-6 py-3">Platform</th>
            <th scope="col" className="px-6 py-3 text-center">Citations</th>
            <th scope="col" className="px-6 py-3 text-center">Visibility</th>
          </tr>
        </thead>
        <tbody>
          {content.map((item, index) => (
            <tr key={index} className="border-b border-dark-border hover:bg-dark-border/50">
              <th scope="row" className="px-6 py-4 font-medium text-light-text whitespace-nowrap">
                {item.title}
              </th>
              <td className="px-6 py-4">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${platformColors[item.platform] || 'bg-gray-500/20 text-gray-400'}`}>
                    {item.platform}
                </span>
              </td>
              <td className="px-6 py-4 text-center">{item.citations}</td>
              <td className="px-6 py-4 text-center font-semibold">{item.visibility}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
