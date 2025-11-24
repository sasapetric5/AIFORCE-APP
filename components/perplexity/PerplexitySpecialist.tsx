import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import { 
    PERPLEXITY_OVERVIEW_DATA,
    SOURCE_CREDIBILITY_AUDIT_DATA,
    SOURCE_CREDIBILITY_INSIGHTS_DATA,
    FRESHNESS_METRICS_DATA,
    CONTENT_UPDATES_DATA,
    REFERENCE_QUALITY_DATA,
    PERPLEXITY_QUICK_ACTIONS_DATA
} from '../../constants/perplexityData';
import type { PerplexityOverviewData, SourceCredibilityAuditItem, SourceCredibilityInsight, FreshnessMetric, ContentUpdate, CitationAnalysisResult, ReferenceQualityCardData, PerplexityQuickAction } from '../../types';

// --- SUB-COMPONENTS ---

const ActionModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; isLoading: boolean; content: string | null; }> = ({ isOpen, onClose, title, isLoading, content }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{title}</h3>
                    <button onClick={onClose} className="text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {isLoading ? <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4 text-medium-text-light dark:text-medium-text">AI is working...</p></div> : <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content || '' }} />}
                </main>
            </div>
        </div>
    );
};

const PerplexityHeader: React.FC = () => (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white p-6 rounded-xl mb-6">
        <h1 className="text-4xl font-bold tracking-wider">Perplexity Specialist</h1>
        <p className="text-lg opacity-90 tracking-wide mt-2">Fact-Based AI Search Optimization</p>
    </div>
);

const PerplexityOverview: React.FC<{ data: PerplexityOverviewData }> = ({ data }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border-l-4 border-purple-500 text-center"><div className="text-4xl mb-2">🔍</div><div className="text-4xl font-bold">{data.score}</div><div className="text-medium-text-light dark:text-medium-text">Perplexity Score</div><div className="text-xs text-green-400 font-semibold">{data.trend}</div></div>
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border-l-4 border-purple-500 text-center"><div className="text-4xl mb-2">📚</div><div className="text-4xl font-bold">{data.citations}</div><div className="text-medium-text-light dark:text-medium-text">Total Citations</div><div className="text-xs text-green-400 font-semibold">{data.citationTrend}</div></div>
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border-l-4 border-purple-500 text-center"><div className="text-4xl mb-2">🏆</div><div className="text-4xl font-bold">{data.position}</div><div className="text-medium-text-light dark:text-medium-text">Market Position</div><div className="text-xs text-green-400 font-semibold">{data.positionTrend}</div></div>
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border-l-4 border-purple-500 text-center"><div className="text-4xl mb-2">⭐</div><div className="text-4xl font-bold">{data.credibility}%</div><div className="text-medium-text-light dark:text-medium-text">Source Credibility</div><div className="text-xs text-green-400 font-semibold">{data.credibilityTrend}</div></div>
    </div>
);

const SourceCredibility: React.FC<{ audit: SourceCredibilityAuditItem[], insights: SourceCredibilityInsight[] }> = ({ audit, insights }) => {
    const scoreClasses: Record<string, string> = { 'A+': 'bg-green-500', 'B+': 'bg-blue-500', 'C+': 'bg-yellow-500', 'B': 'bg-cyan-500', 'A': 'bg-green-400' };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="font-semibold text-dark-text dark:text-light-text mb-3">Credibility Audit Results</h4>
                <div className="space-y-2">
                    {audit.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-light-card dark:bg-dark-card p-3 rounded-md">
                            <div className="flex items-center gap-3"><span className="text-2xl">{item.icon}</span><div><p className="font-semibold">{item.title}</p><p className="text-xs text-medium-text-light dark:text-medium-text">{item.description}</p></div></div>
                            <div className={`px-3 py-1 text-xs font-bold text-white rounded-full ${scoreClasses[item.score]}`}>{item.score}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2 bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="font-semibold text-dark-text dark:text-light-text mb-3">Credibility Insights</h4>
                <div className="space-y-3">
                    {insights.map(item => (
                        <div key={item.id} className="bg-light-border dark:bg-dark-border/50 p-3 rounded-lg border-l-4 border-purple-500">
                            <p className="font-semibold text-dark-text dark:text-light-text flex items-center gap-2"><span className="text-lg">{item.icon}</span>{item.title}</p>
                            <p className="text-sm text-medium-text-light dark:text-medium-text mt-1">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RealTimeReadiness: React.FC<{ metrics: FreshnessMetric[], updates: ContentUpdate[] }> = ({ metrics, updates }) => {
    const statusClasses: Record<string, string> = { 'CURRENT': 'bg-green-500/20 text-green-300', 'UPDATE NEEDED': 'bg-red-500/20 text-red-300', 'SCHEDULED': 'bg-yellow-500/20 text-yellow-300' };
    const barColor = (score: number) => score > 80 ? 'bg-green-500' : score > 70 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="font-semibold text-dark-text dark:text-light-text mb-4">Content Freshness Analysis</h4>
                <div className="space-y-4">
                    {metrics.map(metric => (
                        <div key={metric.id}>
                            <div className="flex justify-between items-center text-sm mb-1"><span className="text-dark-text dark:text-light-text">{metric.label}</span><span className="font-semibold text-medium-text-light dark:text-medium-text">{metric.score}%</span></div>
                            <div className="w-full bg-light-border dark:bg-dark-border h-2 rounded-full"><div className={`${barColor(metric.score)} h-2 rounded-full`} style={{ width: `${metric.score}%` }}></div></div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{metric.lastUpdated}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="font-semibold text-dark-text dark:text-light-text mb-4">Content Update Tracker</h4>
                <div className="space-y-2">
                    {updates.map(update => (
                        <div key={update.id} className="flex justify-between items-center bg-light-card dark:bg-dark-card p-3 rounded-md">
                            <div><p className="font-semibold">{update.title}</p><p className="text-xs text-medium-text-light dark:text-medium-text">Last reviewed: {update.lastReviewed}</p></div>
                            <div className={`px-2 py-1 text-xs font-bold rounded-full ${statusClasses[update.status]}`}>{update.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CitationFormat: React.FC = () => {
    const [content, setContent] = useState('The rapid advancement of artificial intelligence in 2024 has transformed how businesses approach search engine optimization. According to recent studies, AI-powered tools can improve SEO efficiency by up to 65%. Major platforms like ChatGPT and Perplexity now prioritize comprehensive, fact-based content with clear source attribution.');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<CitationAnalysisResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!content) return;
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As a Perplexity optimization specialist, analyze the following content for its citation format quality. Provide a compatibility score (0-100) and 4 actionable improvement suggestions focused on fact-based sourcing and clear attribution. Respond in JSON. Content: "${content}"`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            score: { type: Type.NUMBER },
                            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                        required: ['score', 'suggestions'],
                    },
                },
            });
            setResult(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setError('Failed to analyze. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const score = result?.score ?? 82;
    const suggestions = result?.suggestions ?? [ "Add specific study citations with publication dates", "Include direct quotes from authoritative sources", "Add reference list with full source details", "Implement proper academic citation style" ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text" placeholder="Paste content..."></textarea>
                <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-800 flex justify-center items-center gap-2">
                    {isLoading ? <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing...</> : '🔍 Analyze Citation Format'}
                </button>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="font-semibold text-dark-text dark:text-light-text mb-4">Format Optimization Results</h4>
                {error && <p className="text-red-400">{error}</p>}
                <div className="text-center mb-4">
                    <div className="relative inline-block">
                        <svg className="w-32 h-32" viewBox="0 0 36 36"><path className="text-light-border dark:text-dark-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" /><path className="text-purple-500" strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{score}</div>
                    </div>
                    <p className="font-semibold mt-2">Citation Format Score</p>
                </div>
                <ul className="text-left space-y-2 text-sm">
                    {suggestions.map((s, i) => <li key={i} className="flex items-start"><span className="mr-2 text-purple-400">📝</span><span>{s}</span></li>)}
                </ul>
            </div>
        </div>
    );
};

const ReferenceQuality: React.FC<{ data: ReferenceQualityCardData[], onAction: (actionId: string, context?: any) => void }> = ({ data, onAction }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map(card => (
            <div key={card.id} className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border flex flex-col hover:border-purple-500 transition-colors">
                <div className="flex items-center gap-4 mb-3"><span className="text-3xl">{card.icon}</span><div><h4 className="font-bold text-dark-text dark:text-light-text">{card.title}</h4><p className="text-sm text-medium-text-light dark:text-medium-text">{card.subtitle}</p></div></div>
                <p className="text-sm text-medium-text-light dark:text-medium-text mb-4 flex-grow">{card.description}</p>
                <div className="grid grid-cols-2 gap-2 text-center my-2">
                    <div className="bg-light-bg dark:bg-dark-bg p-2 rounded"><div className="font-bold text-lg">{card.qualityScore}/10</div><div className="text-xs text-medium-text-light dark:text-medium-text">Quality Score</div></div>
                    <div className="bg-light-bg dark:bg-dark-bg p-2 rounded"><div className="font-bold text-lg">{card.referenceCount}</div><div className="text-xs text-medium-text-light dark:text-medium-text">References</div></div>
                </div>
                <button onClick={() => onAction(`improve-${card.id}`, card)} className="w-full mt-auto bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700">Enhance References</button>
            </div>
        ))}
    </div>
);

const QuickActions: React.FC<{ data: PerplexityQuickAction[], onAction: (actionId: string) => void }> = ({ data, onAction }) => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data.map(action => (
            <button key={action.id} onClick={() => onAction(action.id)} className="bg-light-card dark:bg-dark-card p-4 rounded-lg text-center hover:bg-slate-200 dark:hover:bg-dark-border transition-colors">
                <div className="text-3xl mb-2">{action.icon}</div>
                <div className="text-sm font-semibold text-dark-text dark:text-light-text">{action.text}</div>
            </button>
        ))}
    </div>
);


// --- MAIN COMPONENT ---

export const PerplexitySpecialist: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisInput, setAnalysisInput] = useState('');

    const handleMainAnalyze = async () => {
        if (!analysisInput.trim()) return;

        setModalTitle('AI Analysis for Perplexity');
        setIsModalOpen(true);
        setIsLoading(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As a Perplexity optimization specialist, analyze the following input and provide a summary of its source credibility, freshness, and suitability for Perplexity AI. Give actionable advice. Format as a well-structured HTML report using Tailwind CSS classes. Input: "${analysisInput}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<div class="bg-red-500/10 text-red-400 p-4 rounded-md">An error occurred while communicating with the AI. Please try again.</div>');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (actionId: string, context?: any) => {
        const actionMap: Record<string, { title: string; prompt: string }> = {
            'add-citations': { title: 'Add Source Citations', prompt: 'You are a Perplexity optimization expert. For a generic article about AI SEO, suggest 5 highly credible, specific sources to add as citations. Format as an HTML list.' },
            'update-content': { title: 'Update Outdated Content', prompt: 'You are a content strategist. Identify 3 potentially outdated pieces of information in a generic AI SEO article and provide updated versions. Format as an HTML before/after list.' },
            'enhance-data': { title: 'Enhance Data Verification', prompt: 'You are a data analyst. For an article citing "AI improves SEO", suggest 3 ways to enhance the verification of this data (e.g., linking to specific studies, adding confidence intervals). Format as an HTML list.' },
            'improve-format': { title: 'Improve Reference Format', prompt: 'You are a technical editor. Take a simple reference list and reformat it into a more academic style (e.g., APA). Provide 3 examples in an HTML list.' },
            'generate-fact-check': { title: 'Generate Fact-Check Report', prompt: 'You are a fact-checker. For a generic article on AI SEO, perform a mock fact-check on 3 common claims and provide a brief report on their accuracy. Format as HTML.' },
            'improve-academic': { title: 'Enhance Academic References', prompt: `You are a research assistant. The user wants to improve academic references for their content on "${context?.title}". Suggest 3 top-tier academic journals or conference proceedings relevant to this topic they could cite from. Format as HTML.`},
            'improve-industry': { title: 'Enhance Industry References', prompt: `You are a market analyst. The user wants to improve industry sources for content on "${context?.title}". Suggest 3 leading industry reports or analyst firms they could reference. Format as HTML.`},
            'improve-data-sources': { title: 'Enhance Data Sources', prompt: `You are a data scientist. The user wants to improve data sources for content on "${context?.title}". Suggest 3 reputable public datasets or statistical sources they could use. Format as HTML.`},
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
            setModalContent('<p class="text-red-400">An error occurred. Please try again.</p>');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PerplexityHeader />
            <Card title="Analyze Content for Perplexity Compatibility">
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
                      className="w-full sm:w-auto flex-shrink-0 bg-purple-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <Card title="Perplexity Performance Overview"><PerplexityOverview data={PERPLEXITY_OVERVIEW_DATA} /></Card>
            <Card title="Source Credibility Enhancement"><SourceCredibility audit={SOURCE_CREDIBILITY_AUDIT_DATA} insights={SOURCE_CREDIBILITY_INSIGHTS_DATA} /></Card>
            <Card title="Real-time Information Readiness"><RealTimeReadiness metrics={FRESHNESS_METRICS_DATA} updates={CONTENT_UPDATES_DATA} /></Card>
            <Card title="Citation Format Optimization"><CitationFormat /></Card>
            <Card title="Reference Quality Scoring"><ReferenceQuality data={REFERENCE_QUALITY_DATA} onAction={handleAction} /></Card>
            <Card title="Quick Optimization Actions"><QuickActions data={PERPLEXITY_QUICK_ACTIONS_DATA} onAction={handleAction} /></Card>
            <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} isLoading={isLoading} content={modalContent} />
        </div>
    );
};