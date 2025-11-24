import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card } from './Card';
import { AnalysisInput } from './analysis/AnalysisInput';

// FIX: Declare Chart object to resolve TypeScript error 'Cannot find name 'Chart''.
declare const Chart: any;

// --- ACTION MODAL SUB-COMPONENT ---
interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    isLoading: boolean;
    content: string | null;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, title, isLoading, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{title}</h3>
                    <button onClick={onClose} className="text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                            <p className="mt-4 text-medium-text-light dark:text-medium-text">AI is generating insights...</p>
                        </div>
                    ) : (
                        content && <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                </main>
            </div>
        </div>
    );
};

// --- MOCK DATA ---
const METRIC_CARDS_DATA = [
    { value: '1,247', label: 'Total Tracked Sources', change: '+8% this month', color: 'text-violet-500' },
    { value: '48', label: 'High-Authority Sources', change: '+12% this month', color: 'text-green-500' },
    { value: '+15%', label: 'Citation Growth Rate', change: 'MoM', color: 'text-blue-500' },
    { value: '78/100', label: 'Source Diversity Score', change: '+5 points', color: 'text-amber-500' }
];

const TOP_CITED_DOMAINS = [
    { rank: 1, name: 'wikipedia.org', citations: 248, authority: 'A+' },
    { rank: 2, name: 'github.com', citations: 189, authority: 'A' },
    { rank: 3, name: 'stackoverflow.com', citations: 156, authority: 'A' },
    { rank: 4, name: 'reddit.com', citations: 142, authority: 'B' },
    { rank: 5, name: 'medium.com', citations: 128, authority: 'B' }
];

const AUTHORITY_HEATMAP = [
    { label: 'Industry Publications', value: '32%' },
    { label: 'Academic Sources', value: '18%' },
    { label: 'Social Platforms', value: '15%' },
    { label: 'Competitor Sites', value: '12%' },
];

const SOURCE_GAPS = [
    { icon: 'fas fa-exclamation-triangle', title: "Sources They Have, You Don't", details: "23 high-value domains missing from your citations" },
    { icon: 'fas fa-bullseye', title: "High-Value Sources Missing", details: "8 A+ authority domains not citing your content" },
    { icon: 'fas fa-bolt', title: "Quick-Win Opportunities", details: "15 sources with high citation potential" }
];

const COMPETITOR_STRATEGY = [
    { icon: 'fas fa-chart-line', title: 'Top Content Themes', details: 'AI ethics, machine learning applications, NLP advancements' },
    { icon: 'fas fa-users', title: 'Author Relationships', details: 'Strong ties with 12 industry influencers' },
    { icon: 'fas fa-calendar-alt', title: 'Publication Patterns', details: 'Weekly research papers, monthly industry reports' }
];

const CITATION_QUALITY = [
    { label: 'High-Value Citations', value: '45%', color: 'text-green-400' },
    { label: 'Medium-Value', value: '35%', color: 'text-yellow-400' },
    { label: 'Low-Value', value: '20%', color: 'text-red-400' },
];

const ACTIONABLE_INSIGHTS = [
    { id: 'publish', icon: 'fas fa-bullseye', title: 'Where to Publish', description: 'High-priority targets for content placement to maximize AI citations and visibility.' },
    { id: 'gaps', icon: 'fas fa-search', title: 'Content Gap Analysis', description: 'Identify missing topics and content opportunities that AI is searching for.' },
    { id: 'partners', icon: 'fas fa-handshake', title: 'Partnership Opportunities', description: 'Discover potential collaborations with authors, publications, and influencers.' }
];

// --- SUB-COMPONENTS ---

const MetricCard: React.FC<typeof METRIC_CARDS_DATA[0]> = ({ value, label, change, color }) => (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
        <div className={`text-5xl font-bold ${color}`}>{value}</div>
        <p className="text-base text-medium-text-light dark:text-medium-text my-2">{label}</p>
        <div className="text-xs font-semibold px-2 py-1 rounded-full bg-light-border dark:bg-dark-border text-green-400">{change}</div>
    </div>
);

const DomainRanking: React.FC = () => {
    const authorityClasses: Record<string, string> = {
        'A+': 'bg-green-500/20 text-green-400',
        'A': 'bg-blue-500/20 text-blue-400',
        'B': 'bg-yellow-500/20 text-yellow-400',
        'C': 'bg-gray-500/20 text-gray-400'
    };
    return (
        <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Top Cited Domains</h3>
            <ul className="space-y-3">
                {TOP_CITED_DOMAINS.map(domain => (
                    <li key={domain.rank} className="flex items-center p-3 bg-light-card dark:bg-dark-card rounded-md">
                        <div className="w-8 h-8 flex-shrink-0 mr-4 bg-violet-500 text-white font-bold text-sm rounded-md flex items-center justify-center">{domain.rank}</div>
                        <div className="flex-grow">
                            <p className="font-semibold text-dark-text dark:text-light-text">{domain.name}</p>
                            <p className="text-xs text-medium-text-light dark:text-medium-text">{domain.citations} citations</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${authorityClasses[domain.authority]}`}>{domain.authority}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CitationAnalytics: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (chartRef.current && typeof Chart !== 'undefined') {
            const ctx = chartRef.current.getContext('2d');
            const isDarkMode = document.documentElement.classList.contains('dark');
            const gridColor = isDarkMode ? '#334155' : '#E2E8F0';
            const textColor = isDarkMode ? '#94A3B8' : '#64748B';

            if (chartInstance.current) chartInstance.current.destroy();

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Total Citations',
                        data: [650, 720, 810, 890, 950, 1020, 1120],
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'High-Value Citations',
                        data: [280, 320, 380, 420, 470, 520, 580],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: textColor } } },
                    scales: {
                        y: { beginAtZero: false, grid: { color: gridColor }, ticks: { color: textColor } },
                        x: { grid: { display: false }, ticks: { color: textColor } }
                    }
                }
            });
        }
        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-light-bg dark:bg-dark-bg p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Citation Velocity & Trends</h3>
                <div className="h-64"><canvas ref={chartRef}></canvas></div>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Citation Quality</h3>
                <div className="space-y-4">
                    {CITATION_QUALITY.map(item => (
                        <div key={item.label} className="flex justify-between items-center bg-light-card dark:bg-dark-card p-3 rounded-md">
                            <span className="font-semibold text-sm text-dark-text dark:text-light-text">{item.label}</span>
                            <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface SourceIntelligenceProps {
    analyzedUrl: string;
    onAnalyze: (url: string) => void;
    isLoading: boolean;
}

export const SourceIntelligence: React.FC<SourceIntelligenceProps> = ({ analyzedUrl, onAnalyze, isLoading: isAnalysisLoading }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('5 min ago');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setLastUpdated('just now');
            // This is where you might show a toast notification
        }, 2000);
    };

    const handleAction = async (actionId: string) => {
        const actionMap: Record<string, { title: string; prompt: string }> = {
            'publish': {
                title: 'AI Recommendations: Where to Publish',
                prompt: `You are an AI content strategist. Based on the themes and content from the following source, identify 5 high-priority publications or platforms where this content should be published or syndicated to maximize AI citations and visibility. For each suggestion, provide a brief (1-2 sentence) explanation of why it's a good fit. Source: "${analyzedUrl || 'a generic tech company website'}"`
            },
            'gaps': {
                title: 'AI-Powered Content Gap Analysis',
                prompt: `You are an expert SEO and content analyst. Analyze the content from the following source. Identify 3 to 5 missing topics or content gaps that AIs are likely searching for related to this subject. For each gap, provide a brief description and a suggested content title. Source: "${analyzedUrl || 'a generic tech company website'}"`
            },
            'partners': {
                title: 'AI-Suggested Partnership Opportunities',
                prompt: `You are a digital marketing and partnerships expert. Based on the themes, authority, and likely audience of the content from the following source, suggest 3 potential collaboration partners (e.g., specific authors, publications, or influencers). For each suggestion, explain the synergy and propose a concrete collaboration idea (e.g., a joint webinar, a guest post, a cross-promotional campaign). Source: "${analyzedUrl || 'a generic tech company website'}"`
            }
        };

        const action = actionMap[actionId];
        if (!action) return;

        setModalTitle(action.title);
        setIsModalOpen(true);
        setIsLoading(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const fullPrompt = `${action.prompt}\n\nFormat the response as a single block of clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. The main container should be a div. Use headers (h4), paragraphs (p), and lists (ul/li). Use classes like 'bg-dark-bg p-4 rounded-lg', 'text-light-text', 'font-bold', 'list-disc', 'ml-6'.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
            });

            if (!response) {
                throw new Error("Received an empty or invalid response from the AI model.");
            }

            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<div class="bg-red-500/10 text-red-400 p-4 rounded-md">An error occurred while communicating with the AI. Please check the console and try again.</div>');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4"><i className="fas fa-brain text-brand-primary"></i> AI Source Intelligence</h1>
                <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">Track, analyze, and optimize your content's sources across the AI ecosystem.</p>
            </div>
            
            {!analyzedUrl && (
                 <div className="space-y-6">
                    <AnalysisInput onAnalyze={onAnalyze} isLoading={isAnalysisLoading} />
                    <Card title="Welcome to Source Intelligence">
                        <div className="text-center py-16 text-medium-text">
                            <div className="text-6xl mb-4">💡</div>
                            <h2 className="text-2xl font-bold text-light-text mb-4">Analysis Required to View Live Data</h2>
                            <p className="max-w-2xl mx-auto">
                                Enter a URL above to populate this dashboard with live data. You are currently viewing a demo layout.
                            </p>
                        </div>
                    </Card>
                </div>
            )}

            <div className={!analyzedUrl ? 'opacity-40 pointer-events-none' : ''}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {METRIC_CARDS_DATA.map(card => <MetricCard key={card.label} {...card} />)}
                </div>

                <div className="mt-6">
                    <Card title="Real-Time Source Tracking">
                        <div className="flex justify-between items-center -mt-4 mb-6">
                            <p className="text-medium-text-light dark:text-medium-text">Monitor top cited domains and source authority.</p>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-medium-text-light dark:text-medium-text">{lastUpdated}</span>
                                <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white text-sm font-semibold rounded-md hover:bg-brand-primary/90 disabled:bg-brand-primary/50">
                                    {isRefreshing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sync-alt"></i>}
                                    <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2"><DomainRanking /></div>
                            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Source Authority Heatmap</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {AUTHORITY_HEATMAP.map(item => (
                                        <div key={item.label} className="bg-light-card dark:bg-dark-card p-4 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-dark-text dark:text-light-text">{item.value}</p>
                                            <p className="text-xs text-medium-text-light dark:text-medium-text">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                
                <div className="mt-6">
                    <Card title="Competitor Source Analysis">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Source Gap Identification</h3>
                                <ul className="space-y-4">
                                    {SOURCE_GAPS.map(gap => (
                                        <li key={gap.title} className="flex items-start">
                                            <div className="w-10 h-10 flex-shrink-0 mr-4 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center"><i className={gap.icon}></i></div>
                                            <div>
                                                <p className="font-semibold text-dark-text dark:text-light-text">{gap.title}</p>
                                                <p className="text-sm text-medium-text-light dark:text-medium-text">{gap.details}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Competitor Source Strategy</h3>
                                <ul className="space-y-4">
                                    {COMPETITOR_STRATEGY.map(strat => (
                                        <li key={strat.title} className="flex items-start">
                                            <div className="w-10 h-10 flex-shrink-0 mr-4 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center"><i className={strat.icon}></i></div>
                                            <div>
                                                <p className="font-semibold text-dark-text dark:text-light-text">{strat.title}</p>
                                                <p className="text-sm text-medium-text-light dark:text-medium-text">{strat.details}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="mt-6">
                    <Card title="Citation Analytics">
                        <CitationAnalytics />
                    </Card>
                </div>

                <div className="mt-6">
                    <Card title="Actionable Insights & Recommendations">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {ACTIONABLE_INSIGHTS.map(insight => (
                                <div key={insight.title} className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg border-l-4 border-green-500">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 flex-shrink-0 mr-4 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center"><i className={insight.icon}></i></div>
                                        <h3 className="text-lg font-semibold text-dark-text dark:text-light-text">{insight.title}</h3>
                                    </div>
                                    <p className="text-sm text-medium-text-light dark:text-medium-text mb-4">{insight.description}</p>
                                    <button onClick={() => handleAction(insight.id)} className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700">View Details</button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
            
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