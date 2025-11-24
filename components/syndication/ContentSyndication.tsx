import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import { ActionModal } from '../competitive_intelligence/ActionModal';
import type { Notification } from '../../types';

// --- TYPES & CONSTANTS ---

const AI_PLATFORMS = [
    { id: 'chatgpt', name: 'ChatGPT', icon: 'fas fa-robot' },
    { id: 'gemini', name: 'Gemini', icon: 'fab fa-google' },
    { id: 'claude', name: 'Claude', icon: 'fas fa-brain' },
    { id: 'perplexity', name: 'Perplexity', icon: 'fas fa-search' },
    { id: 'copilot', name: 'Microsoft Copilot', icon: 'fab fa-microsoft' },
    { id: 'deepseek', name: 'DeepSeek', icon: 'fas fa-terminal' },
];

const TRADITIONAL_PLATFORMS = [
    { id: 'medium', name: 'Medium', icon: 'fab fa-medium' },
    { id: 'devto', name: 'Dev.to', icon: 'fab fa-dev' },
    { id: 'linkedin', name: 'LinkedIn Article', icon: 'fab fa-linkedin' },
    { id: 'substack', name: 'Substack', icon: 'fas fa-newspaper' },
    { id: 'hackernoon', name: 'Hacker Noon', icon: 'fab fa-hacker-news' },
    { id: 'twitter', name: 'X (Twitter)', icon: 'fab fa-twitter' }
];

const ALL_PLATFORMS = [...AI_PLATFORMS, ...TRADITIONAL_PLATFORMS];

const TIMEZONES = ['UTC', 'America/New_York (EST)', 'America/Chicago (CST)', 'America/Denver (MST)', 'America/Los_Angeles (PST)', 'Europe/London (GMT)', 'Europe/Berlin (CET)'];


// --- SUB-COMPONENTS ---

const DiffViewer: React.FC<{ original: string; rewritten: string }> = ({ original, rewritten }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(rewritten);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div>
                <h5 className="font-semibold mb-2 text-medium-text">Original Content</h5>
                <div className="bg-slate-950 border border-dark-border rounded-md p-4 h-64 overflow-y-auto whitespace-pre-wrap font-mono">
                    {original}
                </div>
            </div>
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-rose-400">Optimized for Platform</h5>
                    <button onClick={handleCopy} className="text-xs bg-dark-border text-medium-text py-1 px-2 rounded hover:bg-slate-600 transition-colors font-sans">
                        {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-md p-4 h-64 overflow-y-auto whitespace-pre-wrap font-sans">
                    {rewritten}
                </div>
            </div>
        </div>
    );
};

const NotificationToast: React.FC<{ message: string, onDismiss: () => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="slide-in-right bg-gradient-to-r from-rose-500 to-indigo-500 text-white py-3 px-5 rounded-lg shadow-2xl border-l-4 border-teal-400">
            <div className="flex items-center gap-2">
                <i className="fas fa-bullhorn"></i>
                <span>{message}</span>
            </div>
        </div>
    );
};


const SyndicationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    content: any;
    connections: Record<string, { connected: boolean; detail: string }>;
    onSyndicate: (contentId: number, platformIds: string[], schedule: any) => void;
    isSyndicating: boolean;
}> = ({ isOpen, onClose, content, connections, onSyndicate, isSyndicating }) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
    const [scheduleTime, setScheduleTime] = useState('09:00');
    const [scheduleTimezone, setScheduleTimezone] = useState('UTC');
    
    const [recommendations, setRecommendations] = useState<any | null>(null);
    const [isRecommending, setIsRecommending] = useState(false);

    const connectedAiPlatforms = AI_PLATFORMS.filter(p => connections[p.id]?.connected);
    const connectedTraditionalPlatforms = TRADITIONAL_PLATFORMS.filter(p => connections[p.id]?.connected);

    useEffect(() => {
        // Reset state when modal opens for new content
        if (isOpen) {
            setSelectedPlatforms([]);
            setScheduleEnabled(false);
            setRecommendations(null);
            setIsRecommending(false);
        }
    }, [isOpen]);

    const handleTogglePlatform = (id: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };
    
    const handleGetRecommendations = async () => {
        setIsRecommending(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Based on the content titled "${content.title}", recommend the top 2 AI platforms and top 2 traditional platforms for syndication from the provided list of connected platforms. Explain why for each. Your response must be a JSON object with keys "ai_platforms" and "traditional_platforms", each an array of objects with "id" (from the list [${[...AI_PLATFORMS, ...TRADITIONAL_PLATFORMS].map(p => `'${p.id}'`).join(', ')}]), "name", and "reason" properties. Only recommend from the connected platforms: ${JSON.stringify([...connectedAiPlatforms, ...connectedTraditionalPlatforms].map(p => p.name))}`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const result = JSON.parse(response.text.match(/{[\s\S]*}/)![0]); // Basic JSON extraction
            setRecommendations(result);
            const recommendedIds = [...result.ai_platforms.map((p: any) => p.id), ...result.traditional_platforms.map((p: any) => p.id)];
            setSelectedPlatforms(recommendedIds);

        } catch(e) {
            console.error("Failed to get recommendations:", e);
        } finally {
            setIsRecommending(false);
        }
    };

    const handleSyndicateClick = () => {
        const schedule = scheduleEnabled ? { date: scheduleDate, time: scheduleTime, timezone: scheduleTimezone } : null;
        onSyndicate(content.id, selectedPlatforms, schedule);
    };

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-light-border dark:border-dark-border flex-shrink-0">
                    <h3 className="text-lg font-bold">Syndicate Content</h3>
                    <p className="text-sm text-medium-text-light dark:text-medium-text">{content.title}</p>
                </header>
                <main className="p-6 space-y-6 overflow-y-auto">
                    {(connectedAiPlatforms.length === 0 && connectedTraditionalPlatforms.length === 0) ? (
                         <div className="text-center p-8">
                            <h4 className="font-semibold text-lg text-dark-text dark:text-light-text">No Platforms Connected</h4>
                            <p className="text-medium-text mt-2">Please connect at least one platform in the "Platform Connections & Settings" section to start syndicating content.</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <button onClick={handleGetRecommendations} disabled={isRecommending} className="w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 flex items-center justify-center gap-2 disabled:bg-brand-primary/50">
                                    {isRecommending ? <><i className="fas fa-spinner fa-spin"></i> Getting Recommendations...</> : <><i className="fas fa-brain"></i> Get AI Platform Recommendations</>}
                                </button>
                                {recommendations && (
                                    <div className="mt-4 space-y-2 text-xs bg-dark-bg p-3 rounded-md border border-dark-border animate-fade-in">
                                        {[...(recommendations.ai_platforms || []), ...(recommendations.traditional_platforms || [])].map((rec: any) => (
                                            <div key={rec.id}><strong>{rec.name}:</strong> {rec.reason}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <PlatformSelection title="AI Platforms" platforms={connectedAiPlatforms} selected={selectedPlatforms} onToggle={handleTogglePlatform} recommendations={recommendations?.ai_platforms} />
                                <PlatformSelection title="Traditional Platforms" platforms={connectedTraditionalPlatforms} selected={selectedPlatforms} onToggle={handleTogglePlatform} recommendations={recommendations?.traditional_platforms} />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={scheduleEnabled} onChange={() => setScheduleEnabled(!scheduleEnabled)} className="h-5 w-5 rounded bg-dark-border border-medium-text text-indigo-500 focus:ring-indigo-400" />
                                    <span className="font-semibold">Schedule for later</span>
                                </label>
                                {scheduleEnabled && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-dark-bg rounded-md border border-dark-border animate-fade-in">
                                        <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="bg-dark-border p-2 rounded-md text-sm" />
                                        <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="bg-dark-border p-2 rounded-md text-sm" />
                                        <select value={scheduleTimezone} onChange={e => setScheduleTimezone(e.target.value)} className="bg-dark-border p-2 rounded-md text-sm">
                                            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
                 <footer className="p-4 border-t border-light-border dark:border-dark-border flex-shrink-0 flex justify-end gap-3">
                    <button onClick={onClose} className="py-2 px-4 text-sm font-semibold rounded-md bg-slate-200 dark:bg-dark-border hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                    {(connectedAiPlatforms.length > 0 || connectedTraditionalPlatforms.length > 0) && (
                        <button onClick={handleSyndicateClick} disabled={isSyndicating || selectedPlatforms.length === 0} className="py-2 px-4 text-sm font-semibold rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-600/50 flex items-center gap-2">
                            {isSyndicating && <i className="fas fa-spinner fa-spin"></i>}
                            {isSyndicating ? 'Processing...' : (scheduleEnabled ? `Schedule Post` : 'Publish Now')}
                        </button>
                    )}
                </footer>
                 <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            </div>
        </div>
    );
};

const PlatformSelection: React.FC<{ title: string, platforms: any[], selected: string[], onToggle: (id: string) => void, recommendations: any[] | null }> = ({ title, platforms, selected, onToggle, recommendations }) => (
    <div>
        <h4 className="font-semibold text-dark-text dark:text-light-text mb-2">{title}</h4>
        {platforms.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platforms.map(p => {
                    const isRecommended = recommendations?.some(r => r.id === p.id);
                    return (
                        <label htmlFor={`p-${p.id}`} key={p.id} className={`flex items-center gap-2 p-2 rounded-md border-2 transition-colors cursor-pointer ${selected.includes(p.id) ? 'border-rose-500 bg-rose-500/10' : 'border-dark-border bg-dark-bg hover:border-medium-text/50'} ${isRecommended ? 'ring-2 ring-offset-2 ring-offset-dark-card ring-brand-primary' : ''}`}>
                            <input id={`p-${p.id}`} type="checkbox" checked={selected.includes(p.id)} onChange={() => onToggle(p.id)} className="h-4 w-4 rounded bg-dark-border border-medium-text text-rose-500 focus:ring-rose-400" />
                            <i className={`${p.icon} text-lg w-5 text-center`}></i>
                            <span className="text-sm">{p.name}</span>
                        </label>
                    )
                })}
            </div>
        ) : (
            <div className="text-center p-3 bg-dark-bg rounded-md text-sm text-medium-text">No connected platforms in this category.</div>
        )}
    </div>
);

const ConnectionSettings: React.FC<{
    title: string;
    platforms: typeof AI_PLATFORMS;
    connections: Record<string, { connected: boolean; detail: string }>;
    onDetailChange: (id: string, detail: string) => void;
    onToggle: (id: string) => void;
    detailPlaceholder: string;
}> = ({ title, platforms, connections, onDetailChange, onToggle, detailPlaceholder }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">{title}</h3>
            <div className="space-y-3">
                {platforms.map(p => (
                    <div key={p.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                        <div className="flex items-center gap-3 flex-grow w-full sm:w-auto">
                            <i className={`${p.icon} text-xl w-6 text-center ${connections[p.id]?.connected ? 'text-green-400' : 'text-medium-text'}`}></i>
                            <span className="font-semibold">{p.name}</span>
                        </div>
                        <input
                            type="text"
                            placeholder={detailPlaceholder}
                            value={connections[p.id]?.detail || ''}
                            onChange={(e) => onDetailChange(p.id, e.target.value)}
                            disabled={connections[p.id]?.connected}
                            className="w-full sm:flex-1 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md p-2 text-sm disabled:opacity-50"
                        />
                        <button
                            onClick={() => onToggle(p.id)}
                            disabled={!connections[p.id]?.detail && !connections[p.id]?.connected}
                            className={`w-full sm:w-auto font-semibold py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 ${
                                connections[p.id]?.connected
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/30'
                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/30'
                            }`}
                        >
                            {connections[p.id]?.connected ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

export const ContentSyndication: React.FC = () => {
    // Generic Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    
    // Notification State
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    // Connections State
    const [connections, setConnections] = useState<Record<string, { connected: boolean; detail: string }>>(
        ALL_PLATFORMS.reduce((acc, p) => {
            acc[p.id] = { connected: false, detail: '' };
            return acc;
        }, {} as Record<string, { connected: boolean; detail: string }>)
    );

    // Syndication Hub State
    const [contentQueue, setContentQueue] = useState([
        { id: 1, title: 'Q3 Product Update', status: 'Published', syndications: { chatgpt: '2024-07-20', medium: '2024-07-21' } },
        { id: 2, title: 'New Whitepaper: The Future of AI', status: 'Scheduled', syndications: { gemini: '2024-07-25', linkedin: '2024-07-25' } },
        { id: 3, title: 'How to Optimize for Perplexity', status: 'Draft', syndications: {} },
        { id: 4, title: 'The Future of AI in Marketing', status: 'Published', syndications: { google: '2024-07-22' } },
    ]);
    const [isSyndicationModalOpen, setIsSyndicationModalOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState<any | null>(null);
    const [isSyndicating, setIsSyndicating] = useState(false);

    // Partnership Discovery State
    const [amplificationTopic, setAmplificationTopic] = useState('AI in Healthcare');
    const [isFindingPartners, setIsFindingPartners] = useState(false);
    const [amplificationPartners, setAmplificationPartners] = useState<any[] | null>(null);

    // Native Format Optimization State
    const [sourceContent, setSourceContent] = useState('Our new AI-powered analytics platform provides real-time insights into market trends, helping businesses make data-driven decisions faster than ever before. It integrates seamlessly with existing workflows.');
    const [targetPlatform, setTargetPlatform] = useState('chatgpt');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizedContent, setOptimizedContent] = useState<string | null>(null);
    const [optimizationError, setOptimizationError] = useState<string | null>(null);

    // FIX: Define the list of platforms to be used for native format optimization buttons.
    const platforms = [
        { id: 'chatgpt', name: 'ChatGPT', icon: 'fas fa-robot' },
        { id: 'gemini', name: 'Gemini', icon: 'fab fa-google' },
        { id: 'claude', name: 'Claude', icon: 'fas fa-brain' },
        { id: 'perplexity', name: 'Perplexity', icon: 'fas fa-search' },
        { id: 'copilot', name: 'Copilot', icon: 'fab fa-microsoft' },
        { id: 'deepseek', name: 'DeepSeek', icon: 'fas fa-terminal' },
        { id: 'mistral', name: 'Mistral', icon: 'fas fa-wind' },
        { id: 'llama', name: 'Llama', icon: 'fas fa-paw' },
        { id: 'poe', name: 'Poe', icon: 'fas fa-wand-magic-sparkles' },
    ];

    const showNotification = (message: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
    };
    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleConnectionChange = (platformId: string, detail: string) => {
        setConnections(prev => ({
            ...prev,
            [platformId]: { ...prev[platformId], detail: detail }
        }));
    };

    const toggleConnection = (platformId: string) => {
        setConnections(prev => ({
            ...prev,
            [platformId]: { ...prev[platformId], connected: !prev[platformId].connected }
        }));
        const platform = ALL_PLATFORMS.find(p => p.id === platformId);
        if (platform) {
            showNotification(`${connections[platformId].connected ? 'Disconnected from' : 'Connected to'} ${platform.name}!`);
        }
    };

    const handleSyndicate = (contentId: number, platformIds: string[], schedule: any) => {
        setIsSyndicating(true);
        const scheduledTime = schedule ? new Date(`${schedule.date}T${schedule.time}`).toISOString() : new Date().toISOString();
        
        setTimeout(() => {
            setContentQueue(prev => prev.map(item => {
                if (item.id === contentId) {
                    const newSyndications = {...item.syndications};
                    platformIds.forEach(pId => {
                        newSyndications[pId as keyof typeof item.syndications] = scheduledTime;
                    });
                    return { ...item, status: schedule ? 'Scheduled' : 'Published', syndications: newSyndications };
                }
                return item;
            }));
            setIsSyndicating(false);
            setIsSyndicationModalOpen(false);
            showNotification(`Content successfully ${schedule ? 'scheduled' : 'published'}!`);
        }, 1500);
    };

    const handleOpenSyndicationModal = (content: any) => {
        setSelectedContent(content);
        setIsSyndicationModalOpen(true);
    };

    const handleFindPartners = async () => {
        if (!amplificationTopic.trim()) return;
        setIsFindingPartners(true);
        setAmplificationPartners(null);

         try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are a digital marketing strategist. For the topic "${amplificationTopic}", identify 3 potential partnership or cross-promotion opportunities. For each, specify the partner's name, their type (e.g., Tech Blog, YouTube Influencer, Newsletter), and a brief, scannable outreach strategy.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            partners: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        type: { type: Type.STRING },
                                        strategy: { type: Type.STRING },
                                    },
                                    required: ['name', 'type', 'strategy'],
                                },
                            },
                        },
                        required: ['partners'],
                    },
                },
            });

            const result = JSON.parse(response.text);
            setAmplificationPartners(result.partners);

        } catch (e) {
            console.error(e);
            showNotification("Error finding partners.");
        } finally {
            setIsFindingPartners(false);
        }
    };

    const handleNativeFormatOptimize = async () => {
        if (!sourceContent.trim()) return;
        setIsOptimizing(true);
        setOptimizedContent(null);
        setOptimizationError(null);
        const platformGuidelines: Record<string, string> = {
            chatgpt: "Focus on a conversational, Q&A-driven format. Use clear headings and anticipate follow-up questions.",
            gemini: "Create a comprehensive, multi-perspective overview. Use structured lists and cover various user intents.",
            claude: "Structure for in-depth analysis. Provide rich contextual background and a logical flow for complex reasoning.",
            perplexity: "Emphasize fact-based statements, data, and clear source citations. Present information neutrally.",
            copilot: "Focus on productivity and integration. Provide actionable, step-by-step instructions, code snippets, or practical examples.",
            deepseek: "Target a technical audience. Focus on code, algorithms, and architectural details. Use precise, technical language.",
            mistral: "Create a balanced and efficient overview. Balance technical details with practical applications. Be concise.",
            llama: "Adopt an accessible, community-focused tone. Use simple language and address common questions (FAQs).",
            poe: "Design modular, reusable content snippets. Create self-contained blocks of text that can be used by different AI personalities."
        };
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are an expert content strategist. Rewrite the following text to be optimized for the "${targetPlatform}" AI platform. Adhere to the following guideline: "${platformGuidelines[targetPlatform]}". Original Text: "${sourceContent}". IMPORTANT: Return ONLY the rewritten text.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setOptimizedContent(response.text);
        } catch (e) {
            console.error(e);
            setOptimizationError("AI optimization failed. Please check the console and try again.");
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="fixed top-28 right-5 z-[1000] space-y-2">
                {notifications.map(n => (
                    <NotificationToast key={n.id} message={n.message} onDismiss={() => dismissNotification(n.id)} />
                ))}
            </div>

            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4">
                    <i className="fas fa-bullhorn text-rose-400"></i> Content Syndication & Amplification
                </h1>
                <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">
                    Maximize your reach with minimal effort.
                </p>
            </div>
            
            <Card title="Platform Connections & Settings">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">
                    Connect your accounts to enable automated syndication. Enter an API key for AI platforms or a profile/page URL for traditional platforms.
                </p>
                <div className="space-y-6">
                    <ConnectionSettings
                        title="AI Platforms"
                        platforms={AI_PLATFORMS}
                        connections={connections}
                        onDetailChange={handleConnectionChange}
                        onToggle={toggleConnection}
                        detailPlaceholder="Enter API Key..."
                    />
                    <ConnectionSettings
                        title="Traditional Platforms"
                        platforms={TRADITIONAL_PLATFORMS}
                        connections={connections}
                        onDetailChange={handleConnectionChange}
                        onToggle={toggleConnection}
                        detailPlaceholder="Enter Profile/Page URL..."
                    />
                </div>
            </Card>

            <Card title="Syndication Hub">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-medium-text uppercase">
                            <tr><th className="p-3">Content</th><th className="p-3">Status</th><th className="p-3 text-center">Syndicated To</th><th className="p-3 text-right">Actions</th></tr>
                        </thead>
                        <tbody>
                            {contentQueue.map(item => (
                                <tr key={item.id} className="border-t border-dark-border">
                                    <td className="p-3 font-semibold">{item.title}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Published' ? 'bg-green-500/20 text-green-300' : item.status === 'Scheduled' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-400'}`}>{item.status}</span></td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-3">
                                            {Object.keys(item.syndications).map(platformId => {
                                                const platform = ALL_PLATFORMS.find(p => p.id === platformId);
                                                return platform ? <i key={platformId} className={`${platform.icon} text-lg text-green-400`} title={`Published to ${platform.name}`}></i> : null;
                                            })}
                                        </div>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleOpenSyndicationModal(item)} className="bg-brand-primary text-white font-semibold text-xs py-1 px-3 rounded-md hover:bg-brand-primary/90">
                                            <i className="fas fa-share-square mr-1"></i> Syndicate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card title="Partnership Discovery Engine">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Find amplification partners by entering a topic of interest.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" value={amplificationTopic} onChange={e => setAmplificationTopic(e.target.value)} className="flex-grow w-full bg-dark-bg border border-dark-border rounded-md p-2" placeholder="Enter a topic, e.g., 'AI in Healthcare'"/>
                    <button onClick={handleFindPartners} disabled={isFindingPartners} className="w-full sm:w-auto bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 flex items-center justify-center gap-2 disabled:bg-brand-primary/50">
                        {isFindingPartners ? <><i className="fas fa-spinner fa-spin"></i> Finding...</> : <><i className="fas fa-search"></i> Find Amplification Partners</>}
                    </button>
                </div>
                <div className="mt-6">
                    {isFindingPartners && <p className="text-center text-medium-text">AI is searching for partners...</p>}
                    {amplificationPartners && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {amplificationPartners.map((partner, index) => (
                                <div key={index} className="bg-dark-bg p-4 rounded-lg border-l-4 border-rose-500">
                                    <h4 className="font-bold text-light-text">{partner.name}</h4>
                                    <p className="text-sm font-semibold text-rose-400 mb-2">{partner.type}</p>
                                    <p className="text-xs text-medium-text">{partner.strategy}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Native Format Optimization">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Automatically restructure your content for each platform's native format to boost performance.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="source-content" className="block text-sm font-medium text-medium-text mb-1">Your Content</label>
                        <textarea id="source-content" value={sourceContent} onChange={e => setSourceContent(e.target.value)} rows={6} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-medium-text mb-2">Target Platform</label>
                        <div className="flex flex-wrap gap-2">
                            {platforms.map(p => (
                                <button key={p.id} onClick={() => setTargetPlatform(p.id)} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border-2 transition-colors ${targetPlatform === p.id ? 'bg-rose-500/10 border-rose-500 text-rose-300' : 'bg-dark-bg border-dark-border text-medium-text hover:border-medium-text/50'}`}>
                                    <i className={p.icon}></i>
                                    <span>{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleNativeFormatOptimize} disabled={isOptimizing} className="w-full bg-rose-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-rose-700 disabled:bg-rose-600/50 flex items-center justify-center gap-2">
                        {isOptimizing ? <><i className="fas fa-spinner fa-spin"></i> Optimizing...</> : <><i className="fas fa-wand-magic-sparkles"></i> Optimize with AI</>}
                    </button>
                </div>
                 {optimizationError && <p className="text-red-400 text-sm text-center mt-4">{optimizationError}</p>}
                 {optimizedContent && <DiffViewer original={sourceContent} rewritten={optimizedContent} />}
            </Card>
            
            <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} isLoading={isLoadingModal} content={modalContent} />
            
            <SyndicationModal isOpen={isSyndicationModalOpen} onClose={() => setIsSyndicationModalOpen(false)} content={selectedContent} connections={connections} onSyndicate={handleSyndicate} isSyndicating={isSyndicating} />

             <style>{`
                .slide-in-right {
                    animation: slideInRight 0.5s ease-out forwards;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};