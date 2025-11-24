import React, { useState } from 'react';

interface AnalysisInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const AnalysisInput: React.FC<AnalysisInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-grow w-full">
            <label htmlFor="url-input" className="sr-only">Enter website URL, app store link, or text to analyze</label>
            <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text text-base"
                placeholder="Enter website URL, app store link, or text to analyze..."
                disabled={isLoading}
            />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full sm:w-auto flex-shrink-0 bg-brand-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-brand-primary/90 transition-all duration-300 disabled:bg-brand-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            '🚀 Analyze with AI'
          )}
        </button>
      </form>
    </div>
  );
};