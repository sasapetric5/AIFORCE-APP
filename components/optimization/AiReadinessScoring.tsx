import React from 'react';
import type { ScoreMetrics } from '../../types';

interface AiReadinessScoringProps {
  url: string;
  setUrl: (url: string) => void;
  contentText: string;
  setContentText: (text: string) => void;
  scores: ScoreMetrics | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const scoreStyle = {
    background: `conic-gradient(#7C3AED ${score}%, #E2E8F0 0)`,
  };
  const darkScoreStyle = {
    background: `conic-gradient(#7C3AED ${score}%, #334155 0)`,
  };


  return (
    <div className="relative flex items-center justify-center w-32 h-32 rounded-full" style={scoreStyle}>
       <div className="dark:hidden absolute flex items-center justify-center w-32 h-32 rounded-full" style={scoreStyle}></div>
       <div className="hidden dark:flex absolute items-center justify-center w-32 h-32 rounded-full" style={darkScoreStyle}></div>
      <div className="absolute bg-light-card dark:bg-dark-card w-[110px] h-[110px] rounded-full flex items-center justify-center">
        <span className="text-4xl font-bold text-dark-text dark:text-light-text">{score}</span>
      </div>
    </div>
  );
};

const MetricBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    const getBarColor = (s: number) => {
        if (s < 50) return 'bg-red-500';
        if (s < 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };
    return (
        <div>
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-dark-text dark:text-light-text">{label}</span>
                <span className="text-medium-text-light dark:text-medium-text">{score}/100</span>
            </div>
            <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
                <div
                    className={`${getBarColor(score)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
};


export const AiReadinessScoring: React.FC<AiReadinessScoringProps> = ({
  url,
  setUrl,
  contentText,
  setContentText,
  scores,
  isAnalyzing,
  onAnalyze,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-light-bg dark:bg-dark-bg p-6 rounded-lg space-y-4">
        <div>
          <label htmlFor="contentUrl" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-2">Content URL</label>
          <input
            type="text"
            id="contentUrl"
            className="w-full bg-light-card dark:bg-dark-border border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text"
            placeholder="https://example.com/your-content"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="text-center text-medium-text-light dark:text-medium-text my-2">OR</div>
        <div>
          <label htmlFor="contentText" className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-2">Paste your content</label>
          <textarea
            id="contentText"
            rows={8}
            className="w-full bg-light-card dark:bg-dark-border border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary resize-vertical placeholder-medium-text-light dark:placeholder-medium-text"
            placeholder="Paste your content here for AI readiness analysis..."
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
          />
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full bg-brand-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-brand-primary/90 transition-all duration-300 disabled:bg-brand-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            '🚀 Analyze AI Readiness'
          )}
        </button>
      </div>
      <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg flex flex-col items-center justify-center">
        {scores ? (
          <>
            <div className="text-center mb-6">
              <ScoreCircle score={scores.overall} />
              <h4 className="text-xl font-bold text-dark-text dark:text-light-text mt-4">AI Readiness Score</h4>
            </div>
            <div className="w-full space-y-4">
                <MetricBar label="Structure & Formatting" score={scores.structure} />
                <MetricBar label="Semantic Depth" score={scores.semanticDepth} />
                <MetricBar label="Entity Coverage" score={scores.entityCoverage} />
                <MetricBar label="Q&A Readiness" score={scores.qaReadiness} />
                <MetricBar label="Platform Compatibility" score={scores.platformCompatibility} />
            </div>
          </>
        ) : (
            <div className="text-center text-medium-text-light dark:text-medium-text">
                <p>Run analysis to see your AI Readiness Score and detailed metrics.</p>
            </div>
        )}
      </div>
    </div>
  );
};