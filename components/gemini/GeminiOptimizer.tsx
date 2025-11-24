import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import { ActionModal } from '../competitive_intelligence/ActionModal';
import {
    GEMINI_EEAT_DATA,
    GEMINI_QUICK_OPTIMIZATION_DATA,
    GEMINI_FORMATTING_INSIGHTS,
    GEMINI_LOCAL_INTENT_METRICS,
    GEMINI_LOCAL_TARGETING_OPPORTUNITIES,
    GEMINI_PERSPECTIVE_DATA
} from '../../constants/geminiData';
import type { EeatSignalData, QuickOptimizationData, FormattingInsight, LocalIntentMetric, LocalTargetingOpportunity, PerspectiveDataPoint } from '../../types';

declare const Chart: any;

// --- SUB-COMPONENTS ---

const GeminiHeader: React.FC = () => (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-6 rounded-xl mb-6 text-center">
        <h2 className="text-4xl font-bold text-white tracking-wider">Gemini Optimizer</h2>
        <p className="text-lg text-blue-200 mt-2">Optimization for Google AI Overviews & Gemini Platform</p>
    </div>
);

const ComprehensiveAnswerFormatting: React.FC = () => {
    const [content, setContent] = useState("Artificial intelligence is transforming digital marketing in 2024. Businesses are leveraging AI tools for content creation, SEO optimization, and customer engagement. The integration of machine learning algorithms has improved targeting accuracy and campaign performance across various platforms.");
    const [insights, setInsights] = useState<FormattingInsight[]>(GEMINI_FORMATTING_INSIGHTS);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Analyze the following content for Gemini AI Overviews and generate 3 formatting insights to improve its structure, coverage, and key point optimization. Content: "${content}"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            insights: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        icon: { type: Type.STRING, description: "A Font Awesome icon class, e.g., 'fas fa-pencil-ruler'." },
                                        title: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                    },
                                    required: ['icon', 'title', 'description']
                                }
                            }
                        },
                        required: ['insights']
                    }
                }
            });

            const result = JSON.parse(response.text);
            if (result.insights) {
                setInsights(result.insights.map((insight: any, index: number) => ({ ...insight, id: `insight-${index}` })));
            }
        } catch (error) {
            console.error("Error analyzing answer format:", error);
            alert("Failed to analyze content. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-dark-text dark:text-light-text mb-2">Content Structure Analysis</h4>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary resize-vertical placeholder-medium-text-light dark:placeholder-medium-text"
                    placeholder="Paste content here..."
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full mt-4 bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 transition-colors disabled:bg-brand-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Answer Format'}
                </button>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-dark-text dark:text-light-text mb-2">Formatting Insights</h4>
                <div className="space-y-4">
                    {insights.map(insight => (
                        <div key={insight.id} className="flex items-start bg-light-card dark:bg-dark-card p-4 rounded-lg border-l-4 border-blue-500">
                            <div className="text-xl text-blue-400 mr-4 pt-1"><i className={insight.icon}></i></div>
                            <div>
                                <h5 className="font-bold text-dark-text dark:text-light-text">{insight.title}</h5>
                                <p className="text-sm text-medium-text-light dark:text-medium-text">{insight.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const LocalIntentOptimization: React.FC = () => {
    const MetricBar: React.FC<{ metric: LocalIntentMetric }> = ({ metric }) => {
        const barColor = metric.score >= 80 ? 'bg-green-500' : metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
        return (
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-dark-text dark:text-light-text">{metric.label}</span>
                    <span className="text-sm font-bold text-medium-text-light dark:text-medium-text">{metric.score}%</span>
                </div>
                <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
                    <div className={`${barColor} h-2 rounded-full`} style={{ width: `${metric.score}%` }}></div>
                </div>
                <p className="text-xs text-medium-text-light dark:text-medium-text mt-1">{metric.description}</p>
            </div>
        );
    };

    const OpportunityCard: React.FC<{ opportunity: LocalTargetingOpportunity }> = ({ opportunity }) => {
        const statusClasses: Record<string, string> = {
            STRONG: 'bg-green-500/20 text-green-300',
            MODERATE: 'bg-yellow-500/20 text-yellow-300',
            WEAK: 'bg-red-500/20 text-red-300',
        };
        return (
            <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg flex justify-between items-center">
                <div>
                    <h5 className="font-bold text-dark-text dark:text-light-text">{opportunity.market}</h5>
                    <p className="text-sm text-medium-text-light dark:text-medium-text">{opportunity.coverage}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusClasses[opportunity.status]}`}>{opportunity.status}</span>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Local Intent Metrics</h4>
                <div className="space-y-4">
                    {GEMINI_LOCAL_INTENT_METRICS.map(metric => <MetricBar key={metric.id} metric={metric} />)}
                </div>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Local Targeting Opportunities</h4>
                <div className="space-y-3">
                    {GEMINI_LOCAL_TARGETING_OPPORTUNITIES.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
                </div>
            </div>
        </div>
    );
};

const MultiPerspectiveCoverage: React.FC<{ onAction: (actionId: string, context: any) => void; }> = ({ onAction }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);
    const [perspectiveData, setPerspectiveData] = useState<PerspectiveDataPoint[]>(
        JSON.parse(JSON.stringify(GEMINI_PERSPECTIVE_DATA))
    );

    useEffect(() => {
        if (chartRef.current) {
            const data = perspectiveData;
            const isDarkMode = document.documentElement.classList.contains('dark');
            const gridColor = isDarkMode ? '#334155' : '#E2E8F0';
            const labelColor = isDarkMode ? '#E2E8F0' : '#1E293B';
            const tickColor = isDarkMode ? '#94A3B8' : '#64748B';

            const chartData = {
                labels: data.map(d => d.subject),
                datasets: [
                    {
                        label: 'Current',
                        data: data.map(d => d.current),
                        backgroundColor: 'rgba(79, 70, 229, 0.4)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                    },
                    {
                        label: 'Target',
                        data: data.map(d => d.target),
                        backgroundColor: 'rgba(34, 197, 94, 0.4)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                    },
                ],
            };
            
            if (chartInstance.current) {
                chartInstance.current.data = chartData;
                chartInstance.current.options.scales.r.angleLines.color = gridColor;
                chartInstance.current.options.scales.r.grid.color = gridColor;
                chartInstance.current.options.scales.r.pointLabels.color = labelColor;
                chartInstance.current.options.scales.r.ticks.color = tickColor;
                chartInstance.current.options.plugins.legend.labels.color = labelColor;
                chartInstance.current.update();
            } else {
                const ctx = chartRef.current.getContext('2d');
                chartInstance.current = new Chart(ctx, {
                    type: 'radar',
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                angleLines: { color: gridColor },
                                grid: { color: gridColor },
                                pointLabels: { color: labelColor, font: { size: 14 } },
                                ticks: {
                                    color: tickColor,
                                    backdropColor: 'transparent',
                                    stepSize: 25,
                                },
                                min: 0,
                                max: 100,
                            },
                        },
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { color: labelColor },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context: any) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.r !== null) {
                                            label += context.parsed.r;
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                    },
                });
            }
        }
    }, [perspectiveData]);

    const handleSliderChange = (index: number, value: number) => {
        const newData = [...perspectiveData];
        newData[index] = { ...newData[index], current: value };
        setPerspectiveData(newData);
    };
    
    const handleAnalyzeGaps = () => {
        onAction('analyze-perspectives', { data: perspectiveData });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg h-96">
                <canvas ref={chartRef}></canvas>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Adjust Current Scores</h4>
                <div className="space-y-4">
                    {perspectiveData.map((item, index) => (
                        <div key={item.subject}>
                            <label htmlFor={`slider-${index}`} className="flex justify-between items-center text-sm font-medium text-dark-text dark:text-light-text mb-1">
                                <span>{item.subject}</span>
                                <span className="font-bold text-brand-primary">{item.current}</span>
                            </label>
                            <input
                                id={`slider-${index}`}
                                type="range"
                                min="0"
                                max="100"
                                value={item.current}
                                onChange={(e) => handleSliderChange(index, parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-light-border dark:bg-dark-border rounded-lg appearance-none cursor-pointer range-thumb"
                            />
                        </div>
                    ))}
                </div>
                 <button
                    onClick={handleAnalyzeGaps}
                    className="mt-6 w-full bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary/90 transition-colors flex items-center justify-center gap-2"
                >
                    <i className="fas fa-magic"></i>
                    Analyze Perspective Gaps
                </button>
            </div>
            <style>{`
                .range-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #4F46E5;
                    cursor: pointer;
                    border-radius: 50%;
                }

                .range-thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: #4F46E5;
                    cursor: pointer;
                    border-radius: 50%;
                    border: none;
                }
            `}</style>
        </div>
    );
};


const EeatCard: React.FC<{ data: EeatSignalData; onAction: (actionId: string, context: any) => void; }> = ({ data, onAction }) => {
    const handleAmplify = () => {
        onAction(`amplify-${data.id}`, { title: data.title, description: data.description });
    };

    return (
        <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg border-t-4 border-yellow-400 flex flex-col hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-300">
            <div className="flex items-start mb-4">
                <div className="text-2xl text-yellow-400 mr-4 pt-1"><i className={data.icon}></i></div>
                <div>
                    <h3 className="text-lg font-bold text-dark-text dark:text-light-text">{data.title}</h3>
                    <p className="text-medium-text-light dark:text-medium-text text-sm">{data.description}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="bg-light-card dark:bg-dark-card p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-dark-text dark:text-light-text">{data.score}/10</div>
                    <div className="text-xs text-medium-text-light dark:text-medium-text">Score</div>
                </div>
                 <div className="bg-light-card dark:bg-dark-card p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-dark-text dark:text-light-text">{data.signals}</div>
                    <div className="text-xs text-medium-text-light dark:text-medium-text">Signals</div>
                </div>
            </div>
            
            <button
                onClick={handleAmplify}
                className="mt-auto w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2"
            >
                Amplify
            </button>
        </div>
    );
};

const QuickOptimizationCard: React.FC<{ data: QuickOptimizationData; onAction: (actionId: string, context: any) => void; }> = ({ data, onAction }) => {
    const handleOptimize = () => {
        onAction(`optimize-${data.id}`, { title: data.title });
    };

    return (
        <button
            onClick={handleOptimize}
            className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg flex flex-col items-center justify-center text-center hover:bg-slate-200 dark:hover:bg-dark-border transition-colors duration-300 group"
        >
            <div className="text-3xl mb-3 text-brand-primary group-hover:text-brand-secondary transition-colors">
                <i className={data.icon}></i>
            </div>
            <h3 className="text-base font-semibold text-dark-text dark:text-light-text">{data.title}</h3>
        </button>
    );
};

// --- MAIN COMPONENT ---

export const GeminiOptimizer: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisInput, setAnalysisInput] = useState('');

    const handleMainAnalyze = async () => {
        if (!analysisInput.trim()) return;

        setModalTitle('AI Analysis for Gemini');
        setIsModalOpen(true);
        setIsLoading(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As a Gemini optimization specialist, analyze the following input and provide a summary of its E-E-A-T signals, local intent, and multi-perspective coverage. Give actionable advice. Format as a well-structured HTML report using Tailwind CSS classes. Input: "${analysisInput}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<div class="bg-red-500/10 text-red-400 p-4 rounded-md">An error occurred while communicating with the AI. Please try again.</div>');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (actionId: string, context: any) => {
        const actionMap: Record<string, { title: string; prompt: string }> = {
            'amplify-experience': { title: 'Amplify Experience Signals', prompt: `You are an AI content strategist. For a website, provide 5 actionable recommendations to better demonstrate 'Experience' for Google's E-E-A-T guidelines, based on the topic of "${context.title}". Format the output as a well-structured HTML list using Tailwind CSS classes.` },
            'amplify-expertise': { title: 'Amplify Expertise Signals', prompt: `You are an AI content strategist. For a website, provide 5 actionable recommendations to better demonstrate 'Expertise' for Google's E-E-A-T guidelines, based on the topic of "${context.title}". Focus on author bios, credentials, and sourcing. Format as a well-structured HTML list using Tailwind CSS.` },
            'amplify-authoritativeness': { title: 'Amplify Authoritativeness Signals', prompt: `You are an AI SEO specialist. Provide 5 actionable recommendations to boost 'Authoritativeness' for Google's E-E-A-T guidelines. Focus on external links, brand mentions, and industry recognition. Format as a well-structured HTML list using Tailwind CSS.` },
            'amplify-trustworthiness': { title: 'Amplify Trustworthiness Signals', prompt: `You are a digital trust analyst. Provide 5 actionable recommendations to improve 'Trustworthiness' for Google's E-E-A-T guidelines. Focus on site security, clear policies, and user reviews. Format as a well-structured HTML list using Tailwind CSS.` },
            'optimize-structure': { title: 'Optimize Content Structure', prompt: 'You are an AI SEO expert specializing in Gemini. Provide a checklist of 5 critical content structure factors (e.g., headings, lists, tables) for ranking in Google\'s AI Overviews. For each factor, give a brief explanation. Format as an HTML list using Tailwind CSS.' },
            'optimize-local': { title: 'Enhance Local Signals', prompt: 'You are a local SEO expert for AI platforms. Provide 5 key recommendations to enhance local signals for a business, including schema, citations, and content. Format as an HTML list using Tailwind CSS.' },
            'optimize-eeat': { title: 'Boost E-E-A-T', prompt: 'You are an E-E-A-T specialist. Generate a comprehensive E-E-A-T audit report summary. Include sections for Experience, Expertise, Authoritativeness, and Trustworthiness with 2-3 key recommendations for each. Format as an HTML report using Tailwind CSS.' },
            'optimize-perspectives': { title: 'Add Perspectives', prompt: 'You are a content strategist. A piece of content is missing perspectives. For a topic on "AI SEO", suggest 3 new perspectives (e.g., "Ethical Implications", "Small Business Impact", "Future Trends") and provide a brief outline for each. Format as an HTML list using Tailwind CSS.' },
            'optimize-overview': { title: 'Generate AI Overview', prompt: 'You are Gemini. Based on a generic article about "The Benefits of AI in Marketing", generate a sample AI Overview that is concise, well-structured, and includes multiple perspectives. Format as a clean HTML block using Tailwind CSS.' },
            'analyze-perspectives': { 
                title: 'Analyze Perspective Gaps', 
                prompt: `You are an AI Content Strategist. The following data represents the current vs. target scores for multi-perspective coverage in a piece of content.
                
                Data:
                ${JSON.stringify(context.data)}
        
                Your task is to:
                1. Identify the perspectives with the largest gaps between 'current' and 'target' scores.
                2. For each of these perspectives, provide 2-3 specific, actionable recommendations on how to improve the content to close the gap.
        
                Format the output as a well-structured HTML using Tailwind CSS classes. Use headings for each perspective.` 
            }
        };

        const action = actionMap[actionId];
        if (!action) return;

        setModalTitle(`AI Assistant: ${action.title}`);
        setIsModalOpen(true);
        setIsLoading(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: action.prompt });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<div class="bg-red-500/10 text-red-400 p-4 rounded-md">An error occurred while communicating with the AI. Please try again.</div>');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <GeminiHeader />
            
            <Card title="Analyze Content for Gemini Compatibility">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        value={analysisInput}
                        onChange={(e) => setAnalysisInput(e.target.value)}
                        className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text"
                        placeholder="Enter website URL, app, or text to analyze..."
                        disabled={isLoading}
                    />
                    <button
                      onClick={handleMainAnalyze}
                      disabled={isLoading || !analysisInput.trim()}
                      className="w-full sm:w-auto flex-shrink-0 bg-brand-primary text-white font-semibold py-3 px-4 rounded-md hover:bg-brand-primary/90 transition-colors disabled:bg-brand-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          <span>Analyzing...</span>
                        </>
                      ) : 'Analyze'}
                    </button>
                </div>
            </Card>
            
            <Card title="E-E-A-T Signal Amplification">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Strengthen your Experience, Expertise, Authoritativeness, and Trustworthiness signals.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {GEMINI_EEAT_DATA.map(data => (
                        <EeatCard key={data.id} data={data} onAction={handleAction} />
                    ))}
                </div>
            </Card>

            <Card title="Quick Optimization Actions">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {GEMINI_QUICK_OPTIMIZATION_DATA.map(data => (
                        <QuickOptimizationCard key={data.id} data={data} onAction={handleAction} />
                    ))}
                </div>
            </Card>

            <Card title="Comprehensive Answer Formatting">
                <ComprehensiveAnswerFormatting />
            </Card>

            <Card title="Local Intent Optimization">
                <LocalIntentOptimization />
            </Card>
            
            <Card title="Multi-perspective Coverage">
                 <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Analyze and improve the breadth of perspectives in your content.</p>
                <MultiPerspectiveCoverage onAction={handleAction} />
            </Card>


            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                isLoading={isLoading}
                content={modalContent}
            />
        </div>
    );
};