import React from 'react';
import type { SecuritySection } from '../../types';

interface SecurityTrustProps {
  data: SecuritySection[];
}

const ratingClasses: Record<string, string> = {
    excellent: 'bg-green-500/20 text-green-300',
    good: 'bg-blue-500/20 text-blue-300',
    fair: 'bg-yellow-500/20 text-yellow-300',
    poor: 'bg-red-500/20 text-red-300',
};

export const SecurityTrust: React.FC<SecurityTrustProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-medium-text md:col-span-2 lg:col-span-3">Security & Trust data is unavailable.</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map(section => (
        <div key={section?.id} className="bg-dark-bg p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-light-text mb-3">{section?.title}</h4>
          <div className="space-y-2">
            {(section?.signals || []).map(signal => {
              const ratingClass = ratingClasses[signal?.rating] || 'bg-gray-500/20 text-gray-400';
              return (
                <div key={signal?.id} className="flex justify-between items-center text-sm p-2 bg-dark-card rounded-md">
                  <span className="text-medium-text">{signal?.name}</span>
                  <span className={`font-bold text-xs px-2 py-1 rounded-full ${ratingClass}`}>
                    {signal?.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
