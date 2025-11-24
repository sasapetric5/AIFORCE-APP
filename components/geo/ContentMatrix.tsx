import React from 'react';
import { GeoContent } from '../../types';

interface ContentMatrixProps {
  content: GeoContent[];
}

const getCellColor = (score: number) => {
  if (score > 90) return 'bg-green-500/20 text-green-500 dark:text-green-300';
  if (score > 85) return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300';
  return 'bg-red-500/20 text-red-500 dark:text-red-300';
};

export const ContentMatrix: React.FC<ContentMatrixProps> = ({ content }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-medium-text-light dark:text-medium-text">
        <thead className="text-xs text-medium-text-light dark:text-medium-text uppercase bg-slate-100 dark:bg-dark-bg">
          <tr>
            <th scope="col" className="px-6 py-3">Content Asset</th>
            <th scope="col" className="px-6 py-3 text-center">Gemini</th>
            <th scope="col" className="px-6 py-3 text-center">ChatGPT</th>
            <th scope="col" className="px-6 py-3 text-center">Perplexity</th>
            <th scope="col" className="px-6 py-3 text-center">Claude</th>
            <th scope="col" className="px-6 py-3 text-center">Copilot</th>
            <th scope="col" className="px-6 py-3 text-center">DeepSeek</th>
            <th scope="col" className="px-6 py-3 text-center">Mistral</th>
            <th scope="col" className="px-6 py-3 text-center">Llama</th>
            <th scope="col" className="px-6 py-3 text-center">Poe</th>
          </tr>
        </thead>
        <tbody>
          {content.map((item) => (
            <tr key={item.id} className="border-b border-light-border dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-border/50">
              <th scope="row" className="px-6 py-4 font-medium text-dark-text dark:text-light-text whitespace-nowrap">
                {item.title}
              </th>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.gemini)}`}>{item.gemini}</span>
              </td>
              <td className="px-6 py-4 text-center">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.chatgpt)}`}>{item.chatgpt}</span>
              </td>
              <td className="px-6 py-4 text-center">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.perplexity)}`}>{item.perplexity}</span>
              </td>
              <td className="px-6 py-4 text-center">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.claude)}`}>{item.claude}</span>
              </td>
              <td className="px-6 py-4 text-center">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.copilot)}`}>{item.copilot}</span>
              </td>
              <td className="px-6 py-4 text-center">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.deepseek)}`}>{item.deepseek}</span>
              </td>
              <td className="px-6 py-4 text-center">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.mistral)}`}>{item.mistral}</span>
              </td>
              <td className="px-6 py-4 text-center">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.llama)}`}>{item.llama}</span>
              </td>
              <td className="px-6 py-4 text-center">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCellColor(item.poe)}`}>{item.poe}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};