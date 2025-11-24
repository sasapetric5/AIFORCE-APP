import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card } from '../Card';
import { AuditorOverview } from './AuditorOverview';
import { CrawlerCompatibility } from './CrawlerCompatibility';
import { StructuredData } from './StructuredData';
import { PerformanceExcellence } from './PerformanceExcellence';
import { SecurityTrust } from './SecurityTrust';
import { AuditorQuickActions } from './AuditorQuickActions';
import type { TechnicalGeoAuditorData } from '../../types';
import {
    AUDITOR_QUICK_ACTIONS_DATA,
    AUDITOR_OVERVIEW_DATA,
    CRAWLER_COMPATIBILITY_DATA,
    SCHEMA_AUDIT_DATA,
    RECOMMENDED_SCHEMA_DATA,
    CORE_VITALS_DATA,
    PERFORMANCE_TREND_DATA,
    SECURITY_TRUST_DATA
} from '../../constants/auditorData';
import { AnalysisInput } from '../analysis/AnalysisInput';

const AuditorHeader: React.FC = () => (
    <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-wider">Technical GEO Auditor</h1>
        <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">Infrastructure Optimization for AI Crawlers and Indexing</p>
    </div>
);

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading: boolean;
  content: string | null;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, title, isLoading, content }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  
  if (!isOpen) return null;

  const handleCopy = () => {
    if (content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const textToCopy = tempDiv.textContent || tempDiv.innerText || '';
        navigator.clipboard.writeText(textToCopy.trim());
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border flex-shrink-0">
          <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-medium-text-light dark:text-medium-text">AI is analyzing... please wait.</p>
            </div>
          ) : (
            content && <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </main>
         <footer className="p-4 border-t border-light-border dark:border-dark-border flex-shrink-0 flex justify-end items-center gap-3">
            <button
                onClick={handleCopy}
                disabled={!content || isLoading}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-200 dark:bg-dark-border text-dark-text dark:text-light-text hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
            >
                {copySuccess ? 'Copied!' : 'Copy Text'}
            </button>
            <button
                onClick={onClose}
                className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
            >
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};

interface TechnicalGeoAuditorProps {
    data?: TechnicalGeoAuditorData;
    onAnalyze: (url: string) => void;
    isLoading: boolean;
}

const MOCK_AUDITOR_DATA: TechnicalGeoAuditorData = {
    overview: AUDITOR_OVERVIEW_DATA,
    crawlerCompatibility: CRAWLER_COMPATIBILITY_DATA,
    structuredData: {
        audit: SCHEMA_AUDIT_DATA,
        recommendations: RECOMMENDED_SCHEMA_DATA,
    },
    performance: {
        vitals: CORE_VITALS_DATA,
        trendData: PERFORMANCE_TREND_DATA,
    },
    security: SECURITY_TRUST_DATA,
};

export const TechnicalGeoAuditor: React.FC<TechnicalGeoAuditorProps> = ({ data, onAnalyze, isLoading: isAnalysisLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const displayData = data || MOCK_AUDITOR_DATA;

    const handleAction = async (actionId: string) => {
        const actionData = data || displayData;

        const actionMap: Record<string, { title: string; promptGenerator: () => string; }> = {
            'fix-crawlers': {
                title: 'Fix Crawler Issues',
                promptGenerator: () => `
                    You are a technical SEO expert. Based on the following AI crawler compatibility report, generate a detailed action plan to fix the issues. Provide specific, actionable steps for each crawler with a 'WARNING' or 'FAIL' status.
                    Format the output as a single block of clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. Use classes like 'bg-dark-bg p-4 rounded-lg', 'text-light-text', 'font-bold', 'text-green-400', 'text-yellow-400', 'text-red-400', 'list-disc', 'ml-6'.
                    The main container should be a div.
                    Report: ${JSON.stringify(actionData?.crawlerCompatibility?.tests?.filter(t => t.status !== 'PASS'))}
                `
            },
            'optimize-perf': {
                title: 'Optimize Performance',
                promptGenerator: () => `
                    You are a web performance optimization specialist. Analyze these Core Web Vitals metrics and provide a prioritized list of actionable recommendations to improve the scores, especially for the metrics rated 'needs_improvement' or 'poor'. Explain the potential impact of each recommendation.
                    Format the output as clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. Use headers (h4), paragraphs (p), and lists (ul/li). Use classes like 'bg-dark-bg p-4 rounded-lg', 'text-light-text', 'font-bold'.
                    The main container should be a div.
                    Vitals data: ${JSON.stringify(actionData?.performance?.vitals?.filter(v => v.rating !== 'good'))}
                `
            },
            'add-schema': {
                title: 'Add Schema Markup',
                promptGenerator: () => `
                    You are a structured data expert. The following schema audit shows which schemas are missing or partial.
                    1. Generate the complete JSON-LD script for a 'HowTo' schema for a generic guide titled 'How to Use Our Product'.
                    2. Provide an example of a complete 'FAQPage' schema with two relevant questions and answers for a company named "AI FORCE".
                    Format the output as HTML. For each schema, provide a heading (h4), a brief explanation (p), and then the full JSON-LD script inside a <pre><code> block. The code block should contain the complete '<script type="application/ld+json">...</script>' tag, ready to be copied.
                    Use Tailwind CSS for styling. The main container should be a div.
                    Audit: ${JSON.stringify(actionData?.structuredData?.audit?.filter(s => s.status !== 'PRESENT'))}
                `
            },
            'enhance-security': {
                title: 'Enhance Security & Trust',
                promptGenerator: () => `
                    You are a web security and digital trust analyst. Based on this security and trust signal report, generate a prioritized action plan to enhance the website's security and authority. Focus on improving the signals with 'fair' or 'poor' ratings.
                    Format the output as clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. Use headers, paragraphs, and lists.
                    The main container should be a div.
                    Report: ${JSON.stringify(actionData?.security)}
                `
            },
            'generate-report': {
                title: 'Technical GEO Audit Report',
                promptGenerator: () => `
                    You are an AI SEO auditor. Generate a comprehensive executive summary of a technical GEO audit based on the following data. The report should be well-structured with sections for Overview, AI Crawler Compatibility, Structured Data, Performance, and Security. Highlight key findings, critical issues, and top recommendations.
                    Format as a single block of clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. Use headers, paragraphs, lists, and tables if necessary.
                    Data: ${JSON.stringify({ 
                        overview: actionData?.overview, 
                        crawlers: actionData?.crawlerCompatibility,
                        schema: actionData?.structuredData?.audit,
                        vitals: actionData?.performance?.vitals,
                        security: actionData?.security
                    })}
                `
            }
        };

        const action = actionMap[actionId];
        if (!action) {
            alert(`Action triggered: ${actionId}`);
            return;
        }

        setModalTitle(`AI Assistant: ${action.title}`);
        setModalContent(null);
        setIsLoading(true);
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
        } catch (e) {
            console.error(e);
            setModalContent('<p class="text-red-400">An error occurred while communicating with the AI. Please check the console and try again.</p>');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className="space-y-6">
            <AuditorHeader />
            {!data && (
                <div className="space-y-6">
                    <AnalysisInput onAnalyze={onAnalyze} isLoading={isAnalysisLoading} />
                    <Card title="Welcome to the Technical GEO Auditor">
                        <div className="text-center py-16 text-medium-text">
                            <div className="text-6xl mb-4">🔧</div>
                            <h2 className="text-2xl font-bold text-light-text mb-4">Analysis Required to View Live Data</h2>
                            <p className="max-w-2xl mx-auto">
                                Enter a URL above to populate this dashboard with live data. You are currently viewing a demo layout.
                            </p>
                        </div>
                    </Card>
                </div>
            )}
            
            <div className={!data ? 'opacity-40 pointer-events-none' : ''}>
                <Card title="Technical Audit Overview">
                    <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Comprehensive analysis of your technical infrastructure for AI crawlers</p>
                    <AuditorOverview data={displayData.overview} />
                </Card>

                <div className="mt-6">
                    <Card title="AI Crawler Compatibility">
                        <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Testing your website's compatibility with major AI crawlers</p>
                        <CrawlerCompatibility data={displayData.crawlerCompatibility} />
                    </Card>
                </div>

                <div className="mt-6">
                    <Card title="Structured Data Optimization">
                        <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Schema markup and structured data analysis for AI comprehension</p>
                        <StructuredData audit={displayData.structuredData.audit} recommendations={displayData.structuredData.recommendations} />
                    </Card>
                </div>

                <div className="mt-6">
                    <Card title="Performance Excellence">
                        <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Core web vitals and performance metrics for AI crawlers</p>
                        <PerformanceExcellence vitals={displayData.performance.vitals} trendData={displayData.performance.trendData} />
                    </Card>
                </div>

                <div className="mt-6">
                    <Card title="Security & Trust Signals">
                        <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Security measures and trust indicators for AI systems</p>
                        <SecurityTrust data={displayData.security} />
                    </Card>
                </div>
                
                <div className="mt-6">
                    <Card title="Quick Optimization Actions">
                        <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Immediate improvements for better AI visibility</p>
                        <AuditorQuickActions actions={AUDITOR_QUICK_ACTIONS_DATA} onAction={handleAction} />
                    </Card>
                </div>
            </div>

            <ActionModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalTitle}
                isLoading={isLoading}
                content={modalContent}
            />
        </div>
    );
};
