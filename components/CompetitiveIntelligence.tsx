import { useState } from 'react';
import type { CompetitiveIntelligenceData, CIOpportunity, CIAlert } from '../types';
import { Card } from './Card';
import { AnalysisInput } from './analysis/AnalysisInput';
import { COMPETITIVE_INTELLIGENCE_DATA } from '../constants/competitiveIntelligenceData';

export function CompetitiveIntelligence() {
  const [data, setData] = useState<CompetitiveIntelligenceData | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const onAnalyze = async (query: string) => {
    setIsAnalysisLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(COMPETITIVE_INTELLIGENCE_DATA);
      setIsAnalysisLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-header-text">Competitive Intelligence</h1>
      </div>

      {!data && (
        <div className="space-y-6">
          <AnalysisInput onAnalyze={onAnalyze} isLoading={isAnalysisLoading} />
          <Card title="Welcome to the Competitive Intelligence Suite">
            <div className="text-center py-16 text-medium-text">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Analyze Your Competition</h3>
              <p className="text-sm opacity-75">
                Enter a competitor's domain or content to uncover strategic insights and opportunities.
              </p>
            </div>
          </Card>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <Card title="Competitive Analysis Complete">
            <div className="text-center py-8">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-lg font-medium">Analysis complete for {data.analyzedDomain}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
