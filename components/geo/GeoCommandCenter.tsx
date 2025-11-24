import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card } from '../Card';
import { PlatformCard } from './PlatformCard';
import { ContentMatrix } from './ContentMatrix';
import { VisibilityTrendChart } from './VisibilityTrendChart';
import { GeoQuickActions } from './GeoQuickActions';
import { AlertsFeed } from './AlertsFeed';
import { GoalsTracker } from './GoalsTracker';
import { ProgressModal } from './ProgressModal';
import { AnalysisInput } from '../analysis/AnalysisInput';
import type { GeoData } from '../../types';
import { GEO_PLATFORMS, GEO_CONTENT_MATRIX, GEO_TREND_DATA, GEO_ALERTS, GEO_GOALS } from '../../constants/geoCommandCenterData';

interface GeoCommandCenterProps {
  data: GeoData | null;
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  onGeneration: (content: string) => void;
}

export const GeoCommandCenter: React.FC<GeoCommandCenterProps> = ({ data, onAnalyze, isLoading, onGeneration }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isQuickActionLoading, setIsQuickActionLoading] = useState(false);

  const displayData = data || {
    platforms: GEO_PLATFORMS,
    contentMatrix: GEO_CONTENT_MATRIX,
    trendData: GEO_TREND_DATA,
    alerts: GEO_ALERTS,
    goals: GEO_GOALS,
  };

  const handleQuickAction = async (actionId: string) => {
    const actionData = data || displayData;

    const actionMap: Record<string, { title: string; promptGenerator: () => string; }> = {
      'audit': {
        title: 'Full GEO Audit',
        promptGenerator: () => `
          You are an expert AI Visibility Analyst. Based on the following data, generate a comprehensive GEO audit summary.
          - Overall AI Visibility Score: ${Math.round(actionData.platforms.reduce((acc, p) => acc + p.score, 0) / actionData.platforms.length)}/100
          - Platform Scores: ${JSON.stringify(actionData.platforms)}
          - Top Content Performance: ${JSON.stringify(actionData.contentMatrix.slice(0, 2))}
          - Recent Alerts: ${JSON.stringify(actionData.alerts)}
          
          Provide a summary with:
          1.  An overall assessment.
          2.  Key strengths across platforms.
          3.  Top opportunities for improvement.
          4.  A critical risk to address immediately.

          Format the output as clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. The main container should be a div. Use headers (h4), paragraphs (p), and lists (ul/li). Use classes like 'bg-dark-bg p-4 rounded-lg', 'text-light-text', 'font-bold', 'text-green-400', 'text-yellow-400', 'text-red-400', 'list-disc', 'ml-6'.
        `
      },
      'optimize': {
        title: 'Top Content Optimization',
        promptGenerator: () => `
          You are an AI Content Optimization Specialist. Analyze the following content piece and its performance data to provide 3-5 specific, actionable optimization suggestions.
          - Content Title: "${actionData.contentMatrix[0].title}"
          - Performance Scores: ${JSON.stringify(actionData.contentMatrix[0])}
          
          Focus on suggestions that would improve scores on lower-performing platforms.
          
          Format the output as a single block of clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. The main container should be a div. Use headers and an ordered list for the suggestions.
        `
      },
      'report': {
        title: 'Weekly Performance Report',
        promptGenerator: () => `
          You are an AI Analyst creating a weekly performance report. Based on the following data, generate a concise summary of the week's performance.
          - Trend Data: ${JSON.stringify(actionData.trendData)}
          - Current Goals Status: ${JSON.stringify(actionData.goals)}
          
          The report should include:
          1.  An executive summary of the visibility trend vs. competitors.
          2.  Progress towards key goals.
          3.  A positive highlight for the week.
          4.  A key focus area for next week.

          Format the output as clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. The main container should be a div. Use headers, paragraphs, and lists.
        `
      },
      'alert': {
        title: 'Smart Alert Configuration Suggestions',
        promptGenerator: () => `
          You are an AI Visibility Strategist. Based on the current platform scores and alerts, suggest 3-4 smart alerts that should be configured to proactively manage AI visibility.
          - Platform Scores: ${JSON.stringify(actionData.platforms)}
          - Recent Alerts: ${JSON.stringify(actionData.alerts)}

          For each suggested alert, provide a clear description of what it would monitor and why it's important.
          Example: "Monitor 'Claude' score for 'Content Title X' - trigger if it drops by more than 5 points."

          Format the output as a single block of clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. The main container should be a div. Use a list format.
        `
      }
    };

    const action = actionMap[actionId];
    if (!action) {
      alert(`Action "${actionId}" is not implemented.`);
      return;
    }

    setModalTitle(`AI Assistant: ${action.title}`);
    setModalContent(null);
    setIsQuickActionLoading(true);
    setIsModalOpen(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: action.promptGenerator(),
      });
      
      if (!response) {
        throw new Error("Received an empty or invalid response from the AI model.");
      }

      setModalContent(response.text);
      if(data) onGeneration(response.text); // Only add to history if it was a real action
    } catch (e) {
      console.error(e);
      setModalContent('<div class="bg-red-500/10 text-red-400 p-4 rounded-md">An error occurred while communicating with the AI. Please check the console and try again.</div>');
    } finally {
      setIsQuickActionLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {!data && (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider">GEO Command Center</h1>
                <p className="text-lg text-medium-text tracking-wide mt-2">Monitor your visibility across all Generative Engines.</p>
            </div>
            <AnalysisInput onAnalyze={onAnalyze} isLoading={isLoading} />
             <Card title="Welcome to the GEO Command Center">
                <div className="text-center py-16 text-medium-text">
                    <div className="text-6xl mb-4">🛰️</div>
                    <h2 className="text-2xl font-bold text-light-text mb-4">Analysis Required to View Live Data</h2>
                    <p className="max-w-2xl mx-auto">
                        Enter a URL above to populate this dashboard with live data. You are currently viewing a demo layout.
                    </p>
                </div>
            </Card>
        </div>
      )}

      <div className={!data ? 'opacity-40 pointer-events-none' : ''}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-6">
          {displayData.platforms.map(platform => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <Card title="AI Visibility Trend">
              <VisibilityTrendChart data={displayData.trendData} />
            </Card>
          </div>
          <div>
            <Card title="Quick Actions">
              <GeoQuickActions onAction={handleQuickAction} />
            </Card>
          </div>
        </div>

        <div className="mt-6">
            <Card title="Content Visibility Matrix">
                <ContentMatrix content={displayData.contentMatrix} />
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <Card title="Alerts & Opportunities">
              <AlertsFeed alerts={displayData.alerts} />
            </Card>
          </div>
          <div>
            <Card title="Q3 Goals Tracker">
              <GoalsTracker goals={displayData.goals} />
            </Card>
          </div>
        </div>
      </div>
      
      <ProgressModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalTitle} 
        isLoading={isQuickActionLoading}
        content={modalContent}
      />
    </div>
  );
};
