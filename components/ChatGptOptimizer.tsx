import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from './Card';
import type { ChatGptOverviewData, ConversationPattern, PromptAnalysisResult, CitationFactor, GptsCardData, ChatGptQuickAction } from '../types';

// Mock Data
const MOCK_DATA = {
    overview: { score: 85, citations: 124, position: '#2', optimizationScore: 78 },
    conversationPatterns: [
        { name: 'Q&A', 'Citation Frequency': 68 },
        { name: 'Step-by-Step', 'Citation Frequency': 42 },
        { name: 'Definitions', 'Citation Frequency': 35 },
        { name: 'Examples', 'Citation Frequency': 28 },
        { name: 'Comparisons', 'Citation Frequency': 22 },
    ],
    citationFactors: [
        { name: 'Content Comprehensiveness', score: 85, color: 'bg-green-500' },
        { name: 'Q&A Readiness', score: 65, color: 'bg-yellow-500' },
        { name: 'Step-by-Step Structure', score: 45, color: 'bg-red-500' },
        { name: 'Definition Clarity', score: 78, color: 'bg-green-500' },
        { name: 'Example Richness', score: 60, color: 'bg-yellow-500' },
    ],
    gptsCards: [
        { id: 'technical', icon: '🔧', title: 'Technical GPTs Optimization', subtitle: 'API and integration readiness', description: 'Optimize your technical content for GPTs that specialize in coding, APIs, and technical implementations.', features: ['Code snippet optimization', 'API documentation enhancement', 'Technical tutorial structuring', 'Integration guide preparation'] },
        { id: 'educational', icon: '📚', title: 'Educational GPTs Enhancement', subtitle: 'Learning and tutorial optimization', description: 'Enhance your educational content for GPTs focused on teaching, tutorials, and knowledge sharing.', features: ['Step-by-step lesson planning', 'Quiz and assessment preparation', 'Learning path optimization', 'Knowledge check integration'] },
        { id: 'business', icon: '💼', title: 'Business GPTs Preparation', subtitle: 'Professional and enterprise content', description: 'Prepare your business content for GPTs specializing in professional services and enterprise solutions.', features: ['Business case optimization', 'ROI calculation preparation', 'Professional template creation', 'Enterprise integration guides'] },
    ],
    quickActions: [
        { id: 'enhance-qa', icon: '❓', text: 'Enhance Q&A Structure' },
        { id: 'optimize-steps', icon: '📋', text: 'Optimize Step-by-Step' },
        { id: 'improve-definitions', icon: '📖', text: 'Improve Definitions' },
        { id: 'add-examples', icon: '💡', text: 'Add Rich Examples' },
        { id: 'generate-gpts', icon: '🤖', text: 'Generate GPTs Content' },
    ],
};

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
                    {isLoading ? <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-chatgpt mx-auto"></div><p className="mt-4 text-medium-text-light dark:text-medium-text">AI is working...</p></div> : <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content || '' }} />}
                </main>
            </div>
        </div>
    );
};

const ChatGptHeader: React.FC = () => (
    <div className="bg-gradient-to-r from-brand-chatgpt to-teal-800 text-white p-6 rounded-xl mb-6">
        <h1 className="text-4xl font-bold tracking-wider">ChatGPT Optimizer</h1>
        <p className="text-lg opacity-90 tracking-wide mt-2">Specialized AI Platform Enhancement</p>
    </div>
);

const ChatGptOverview: React.FC<{ data: ChatGptOverviewData }> = ({ data }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border-l-4 border-brand-chatgpt text-center"><div className="text-4xl mb-2">🤖</div><div className="text-4xl font-bold">{data.score}</div><div className="text-medium-text-light dark:text-medium-text">ChatGPT Score</div></div>
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border-l-4 border-brand-chatgpt text-center"><div className="text-4xl mb-2">💬</div><div className="text-4xl font-bold">{data.citations}</div><div className="text-medium-text-light dark:text-medium-text">Total Citations</div></div>
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border-l-4 border-brand-chatgpt text-center"><div className="text-4xl mb-2">🎯</div><div className="text-4xl font-bold">{data.position}</div><div className="text-medium-text-light dark:text-medium-text">Market Position</div></div>
        <div className="bg-light-card dark:bg-dark-card p-5 rounded-lg border-l-4 border-brand-chatgpt text-center"><div className="text-4xl mb-2">⚡</div><div className="text-4xl font-bold">{data.optimizationScore}%</div><div className="text-medium-text-light dark:text-medium-text">Optimization Score</div></div>
    </div>
);

const ConversationAnalysis: React.FC<{ data: ConversationPattern[] }> = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid stroke="currentColor" strokeOpacity={0.2} strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fill: 'currentColor', opacity: 0.7 }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'currentColor', opacity: 0.9 }} />
                    <Tooltip cursor={{fill: 'currentColor', fillOpacity: 0.1}} contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                    <Bar dataKey="Citation Frequency" fill="#10a37f" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 space-y-4">
            <div className="bg-light-border dark:bg-dark-border/50 p-4 rounded-lg"><h4 className="font-semibold text-dark-text dark:text-light-text">🔍 High Q&A Engagement</h4><p className="text-sm text-medium-text-light dark:text-medium-text">Your content performs best in question-answer format. 68% of citations come from Q&A patterns.</p></div>
            <div className="bg-light-border dark:bg-dark-border/50 p-4 rounded-lg"><h4 className="font-semibold text-dark-text dark:text-light-text">📊 Step-by-Step Preference</h4><p className="text-sm text-medium-text-light dark:text-medium-text">ChatGPT frequently cites your step-by-step guides and tutorials.</p></div>
            <div className="bg-light-border dark:bg-dark-border/50 p-4 rounded-lg"><h4 className="font-semibold text-dark-text dark:text-light-text">💡 Definition Gaps</h4><p className="text-sm text-medium-text-light dark:text-medium-text">Missing clear definitions for key terms reduces citation likelihood.</p></div>
        </div>
    </div>
);

const PromptOptimization: React.FC = () => {
    const [prompt, setPrompt] = useState('What are the best AI SEO strategies for 2024?');
    const [url, setUrl] = useState('https://aiforce.com/ai-seo-guide');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PromptAnalysisResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!prompt || !url) return;
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const geminiPrompt = `As a ChatGPT optimization specialist, analyze the compatibility of content from the URL "${url}" with the user's prompt: "${prompt}". Provide a compatibility score (0-100) and 4 actionable improvement suggestions. Respond in JSON.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: geminiPrompt,
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

            if (!response) {
                throw new Error("Received an empty or invalid response from the AI model.");
            }

            setResult(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setError('Failed to analyze. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter Target Prompt" className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text" />
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Your Content URL" className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text" />
                <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-brand-chatgpt text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 disabled:bg-teal-800 flex justify-center items-center gap-2">
                    {isLoading && <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {isLoading ? 'Analyzing...' : 'Analyze Prompt Compatibility'}
                </button>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center">
                {error && <p className="text-red-400">{error}</p>}
                {!result && !isLoading && <p className="text-medium-text-light dark:text-medium-text h-full flex items-center justify-center">Run analysis to see results.</p>}
                {result && (
                    <>
                        <div className="text-5xl font-bold text-brand-chatgpt">{result.score}<span className="text-2xl text-medium-text-light dark:text-medium-text">/100</span></div>
                        <p className="font-semibold mb-3">Prompt Compatibility Score</p>
                        <ul className="text-left space-y-2 text-sm">
                            {result.suggestions.map((s, i) => <li key={i} className="flex items-start"><span className="mr-2 text-brand-chatgpt">💡</span><span>{s}</span></li>)}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

const CitationScoring: React.FC<{ data: CitationFactor[] }> = ({ data }) => {
    const chartData = [{ name: 'Prob', value: 72 }, { name: 'Pot', value: 28 }];
    const COLORS = ['#10a37f', '#334155'];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                {data.map(factor => (
                    <div key={factor.name}>
                        <div className="flex justify-between text-sm mb-1"><span className="text-dark-text dark:text-light-text">{factor.name}</span><span className="font-semibold text-medium-text-light dark:text-medium-text">{factor.score}%</span></div>
                        <div className="w-full bg-light-border dark:bg-dark-border h-2 rounded-full"><div className={`${factor.color} h-2 rounded-full`} style={{ width: `${factor.score}%` }}></div></div>
                    </div>
                ))}
            </div>
            <div className="h-60 relative flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={450}>
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                    <div className="text-4xl font-bold text-brand-chatgpt">72%</div>
                    <div className="text-medium-text-light dark:text-medium-text text-sm">Citation Probability</div>
                </div>
            </div>
        </div>
    );
};

const GptsDiscovery: React.FC<{ data: GptsCardData[], onAction: (actionId: string) => void }> = ({ data, onAction }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map(card => (
            <div key={card.id} className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border flex flex-col">
                <div className="flex items-center gap-4 mb-3"><span className="text-3xl">{card.icon}</span><div><h4 className="font-bold text-dark-text dark:text-light-text">{card.title}</h4><p className="text-sm text-medium-text-light dark:text-medium-text">{card.subtitle}</p></div></div>
                <p className="text-sm text-medium-text-light dark:text-medium-text mb-4 flex-grow">{card.description}</p>
                <button onClick={() => onAction(`optimize-${card.id}`)} className="w-full bg-brand-chatgpt text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 mt-auto">Optimize Content</button>
            </div>
        ))}
    </div>
);

const QuickActions: React.FC<{ data: ChatGptQuickAction[], onAction: (actionId: string) => void }> = ({ data, onAction }) => (
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

export const ChatGptOptimizer: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (actionId: string) => {
        const actionMap: Record<string, { title: string; prompt: string }> = {
            'enhance-qa': { title: 'Enhance Q&A Structure', prompt: 'You are a ChatGPT optimization expert. Take a generic article about AI SEO and rewrite key sections into a strong Question/Answer format. Add 3 new relevant questions and concise answers. Format as HTML using Tailwind CSS.' },
            'optimize-steps': { title: 'Optimize Step-by-Step Content', prompt: 'You are a ChatGPT optimization expert. Rewrite a generic guide about "AI SEO" into a clear, 5-step guide. Format as an ordered list in HTML using Tailwind CSS.' },
            'improve-definitions': { title: 'Improve Definitions', prompt: 'You are a ChatGPT optimization expert. Identify 5 key terms in an article about AI SEO and write clear, concise definitions for them. Format as a definition list in HTML using Tailwind CSS.' },
            'add-examples': { title: 'Add Rich Examples', prompt: 'You are a ChatGPT content specialist. For a guide on AI SEO, create 3 rich, practical examples of how to apply AI SEO techniques. Format as HTML using Tailwind CSS with subheadings for each example.' },
            'generate-gpts': { title: 'Generate GPTs Content', prompt: 'You are a GPTs content strategist. Generate a short, optimized piece of content about "AI SEO Best Practices" specifically for discovery within the GPTs store. Focus on keywords and clear value propositions. Format as HTML using Tailwind CSS.' },
            'optimize-technical': { title: 'Optimize for Technical GPTs', prompt: 'You are an AI content strategist. Provide 3 specific recommendations for optimizing a technical blog post about AI SEO for a technical GPT. Focus on code snippets and API documentation. Format as HTML using Tailwind CSS.'},
            'optimize-educational': { title: 'Optimize for Educational GPTs', prompt: 'You are an AI content strategist. Provide 3 specific recommendations for optimizing an educational article about AI SEO for a learning GPT. Focus on structure, quizzes, and learning objectives. Format as HTML using Tailwind CSS.'},
            'optimize-business': { title: 'Optimize for Business GPTs', prompt: 'You are an AI content strategist. Provide 3 specific recommendations for optimizing a business-focused article on AI SEO for an enterprise GPT. Focus on ROI, case studies, and business value. Format as HTML using Tailwind CSS.'},
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
            
            if (!response) {
                throw new Error("Received an empty or invalid response from the AI model.");
            }

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
            <ChatGptHeader />
            <Card title="ChatGPT Performance Overview"><ChatGptOverview data={MOCK_DATA.overview} /></Card>
            <Card title="Conversation Pattern Analysis"><ConversationAnalysis data={MOCK_DATA.conversationPatterns} /></Card>
            <Card title="Prompt-Specific Optimization"><PromptOptimization /></Card>
            <Card title="Citation Likelihood Scoring"><CitationScoring data={MOCK_DATA.citationFactors} /></Card>
            <Card title="GPTs Discovery Enhancement"><GptsDiscovery data={MOCK_DATA.gptsCards} onAction={handleAction} /></Card>
            <Card title="Quick Optimization Actions"><QuickActions data={MOCK_DATA.quickActions} onAction={handleAction} /></Card>
            <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} isLoading={isLoading} content={modalContent} />
        </div>
    );
};