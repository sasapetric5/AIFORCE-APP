import React from 'react';
import { Card } from '../Card';

export const AnalysisLoader: React.FC = () => {
  return (
    <Card title="Analysis in Progress">
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-light-text mb-4">AI Is Analyzing Your Domain...</h2>
        <p className="text-medium-text max-w-2xl mx-auto">
          This may take a moment. Our AI is evaluating content, checking performance across platforms, and generating your visibility report.
        </p>
      </div>
    </Card>
  );
};
