import React from 'react';
import { Card } from '../Card';

export const StartAnalysisPlaceholder: React.FC = () => {
  return (
    <Card title="Welcome to AI FORCE">
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛰️</div>
        <h2 className="text-2xl font-bold text-light-text mb-4">Begin Your AI Visibility Analysis</h2>
        <p className="text-medium-text max-w-2xl mx-auto">
          Enter a website domain, a specific URL, or an app store link in the form above to generate a comprehensive, AI-powered analysis of your digital presence.
        </p>
      </div>
    </Card>
  );
};
