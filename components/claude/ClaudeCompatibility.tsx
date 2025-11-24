import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import { CLAUDE_DATA, CLAUDE_QUICK_ACTIONS_DATA } from '../../constants/claudeData';
import type { ClaudeCapability, ClaudeData, ClaudeQuickAction, LogicalFlowAnalysisResult } from '../../types';
import { ActionModal } from '../competitive_intelligence/ActionModal';

const ClaudeHeader: React.FC = () => (
    <div className="bg-gradient-to-r from-orange-600 to-amber-800 text-white p-6 rounded-xl mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-wider">Claude Compatibility Optimizer</h1>
        <p className="text-lg opacity-90 tracking-wide mt-2">Optimization for Claude's complex reasoning and analysis capabilities.</p>
    </div>
);

const CapabilityCard: React.FC<{ 
    capability: ClaudeCapability; 
    onOptimize: (capability: ClaudeCapability) => void;
}> = ({ capability, onOptimize }) => {
    return (
        <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg border-t-4 border-orange-500 hover:shadow-orange-500/10 transition-all duration-300 flex flex-col hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center mb-4">
                <div className="bg-orange-500/10 text-orange-400 rounded-lg p-3 mr-4">
                    <i className={`text-2xl ${capability.icon}`}></i>
                </div>
                <h3 className="text-lg font-bold text-dark-text dark:text-light-text">{capability.title}</h3>
            </div>
            <p className="text-sm text-medium-text-light dark:text-medium-text mb-4 min-h-[40px] flex-grow">{capability.description}</p>
            <div className="grid grid-cols-2 gap-4 text-center my-4">
                <div className="bg-light-card dark:bg-dark-card p-3 rounded-lg">
                    <div className="text-xl font-bold text-orange-400">{capability.metric1.value}</div>
                    <div className="text-xs text-medium-text-light dark:text-medium-text">{capability.metric1.label}</div>
                </div>
                <div className="bg-light-card dark:bg-dark-card p-3 rounded-lg">
                    <div className="text-xl font-bold text-orange-400">{capability.metric2.value}</div>
                    <div className="text-xs text-medium-text-light dark:text-medium-text">{capability.metric2.label}</div>
                </div>
            </div>
            <button
                onClick={() => onOptimize(capability)}
                className="w-full mt-auto text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700"
            >
                <i className="fas fa-magic"></i> Optimize
            </button>
        </div>
    );
};

const ClaudeStats: React.FC<{ stats: ClaudeData['stats'] }> = ({ stats }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg text-center border-b-4 border-orange-500">
            <div className="text-4xl font-bold text-dark-text dark:text-light-text">{stats.compatibilityScore}%</div>
            <p className="text-sm text-medium-text-light dark:text-medium-text mt-1">Compatibility Score</p>
        </div>
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg text-center border-b-4 border-orange-500">
            <div className="text-4xl font-bold text-dark-text dark:text-light-text">{stats.optimizedPages}</div>
            <p className="text-sm text-medium-text-light dark:text-medium-text mt-1">Optimized Pages</p>
        </div>
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg text-center border-b-4 border-orange-500">
            <div className="text-4xl font-bold text-dark-text dark:text-light-text">{stats.avgResponseTime}</div>
            <p className="text-sm text-medium-text-light dark:text-medium-text mt-1">Avg. Response Time</p>
        </div>
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg text-center border-b-4 border-orange-500">
            <div className="text-4xl font-bold text-green-400">{stats.performanceGain}</div>
            <p className="text-sm text-medium-text-light dark:text-medium-text mt-1">Performance Gain</p>
        </div>
    </div>
);

const LogicalFlowAnalysis: React.FC = () => {
    const [content, setContent] = useState('Claude is a large language model from Anthropic. It excels at complex reasoning. Therefore, content should be well-structured. For example, using clear headings is important. Another point is providing context.');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<LogicalFlowAnalysisResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!content) return;
        setIsLoading(true);
        setResult(null);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As a writing expert for AI, analyze the logical flow and coherence of the following content. Provide a score (0-100) and 3 actionable improvement suggestions for better comprehension by an advanced AI like Claude. Respond in JSON. Content: "${content}"`;
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
    
    const score = result?.score ?? 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                 <h4 className="font-semibold text-dark-text dark:text-light-text">Content to Analyze</h4>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text" placeholder="Paste content..."></textarea>
                <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-orange-800 flex justify-center items-center gap-2">
                    {isLoading ? 'Analyzing...' : 'Analyze Logical Flow'}
                </button>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="font-semibold text-dark-text dark:text-light-text mb-4">Analysis Results</h4>
                {error && <p className="text-red-400">{error}</p>}
                {!result && !isLoading && <div className="text-center text-medium-text-light dark:text-medium-text h-full flex items-center justify-center">Run analysis to see results.</div>}
                {result && (
                    <>
                        <div className="text-center mb-4">
                            <div className="relative inline-block">
                                <svg className="w-32 h-32" viewBox="0 0 36 36"><path className="text-light-border dark:text-dark-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" /><path className="text-orange-500" strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{score}</div>
                            </div>
                            <p className="font-semibold mt-2">Coherence Score</p>
                        </div>
                        <ul className="text-left space-y-2 text-sm">
                            {result.suggestions.map((s, i) => <li key={i} className="flex items-start"><span className="mr-2 text-orange-400">›</span><span>{s}</span></li>)}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

const ContextWindowSimulator: React.FC = () => {
    const [longContent, setLongContent] = useState('In the realm of artificial intelligence, the evolution of large language models (LLMs) represents a significant paradigm shift. These models, trained on vast datasets of text and code, exhibit remarkable capabilities in natural language understanding, generation, and reasoning. One of the key architectural distinctions among modern LLMs is the size of their context window—the amount of information the model can consider at once when generating a response. Models with larger context windows, such as Anthropic\'s Claude series, can process and synthesize information from extensive documents, enabling more nuanced and contextually aware outputs. This capability is particularly advantageous for tasks requiring deep analysis of lengthy reports, legal documents, or complex codebases. The challenge, however, lies in efficiently utilizing this extended context. Simply providing a large volume of text is not sufficient; the information must be structured and prioritized to guide the model\'s attention effectively. Techniques such as placing key instructions at the beginning of the prompt, using clear formatting like XML tags to delineate sections, and providing concise summaries of preceding information can significantly improve performance. As research progresses, we anticipate further innovations in context management, potentially leading to models that can maintain coherent and accurate reasoning across virtually unlimited amounts of information.');
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const handleSummarize = async () => {
        if (!longContent) return;
        setIsLoading(true);
        setSummary('');
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Create a very concise summary (TL;DR) of the following text. The goal is to capture the main points to prime an AI's context window. Text: "${longContent}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setSummary(response.text);
        } catch (e) {
            console.error(e);
            setError('Failed to generate summary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (summary) {
            navigator.clipboard.writeText(summary);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const tokenCount = Math.round(longContent.length / 4);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <h4 className="font-semibold text-dark-text dark:text-light-text">Long-Form Content</h4>
                <textarea value={longContent} onChange={(e) => setLongContent(e.target.value)} rows={12} className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text" placeholder="Paste long content..."></textarea>
                <div className="flex justify-between items-center text-sm">
                    <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2.5"><div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (tokenCount / 200000) * 100)}%` }}></div></div>
                    <span className="ml-4 font-mono whitespace-nowrap">{tokenCount} / 200k Tokens</span>
                </div>
                 <button onClick={handleSummarize} disabled={isLoading} className="w-full bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-orange-800 flex justify-center items-center gap-2">
                    {isLoading ? 'Generating...' : 'Generate TL;DR for Context'}
                </button>
            </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-dark-text dark:text-light-text">AI-Generated Context Summary</h4>
                    {summary && (
                        <button onClick={handleCopy} className="text-xs bg-dark-border text-medium-text py-1 px-2 rounded hover:bg-slate-600 transition-colors">
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                </div>
                <div className="w-full h-[300px] bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded p-3 overflow-y-auto text-dark-text dark:text-light-text">
                    {isLoading && <p className="text-medium-text-light dark:text-medium-text">Generating summary...</p>}
                    {error && <p className="text-red-400">{error}</p>}
                    {summary}
                </div>
            </div>
        </div>
    );
};

const QuickActions: React.FC<{ data: ClaudeQuickAction[], onAction: (actionId: string, context?: any) => void }> = ({ data, onAction }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map(action => (
            <button key={action.id} onClick={() => onAction(action.id)} className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center hover:bg-slate-200 dark:hover:bg-dark-border transition-colors group">
                <div className="text-3xl mb-2 text-orange-400 group-hover:text-orange-300 transition-colors"><i className={action.icon}></i></div>
                <div className="text-sm font-semibold text-dark-text dark:text-light-text">{action.text}</div>
            </button>
        ))}
    </div>
);


export const ClaudeCompatibility: React.FC = () => {
    const [data, setData] = useState<ClaudeData>(CLAUDE_DATA);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [analysisInput, setAnalysisInput] = useState('');

    const handleMainAnalyze = async () => {
        if (!analysisInput.trim()) return;

        setModalTitle('AI Analysis for Claude Compatibility');
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As a Claude compatibility specialist, analyze the following input and provide a summary of its logical flow, context depth, and suitability for complex reasoning tasks. Give actionable advice. Format as a well-structured HTML report using Tailwind CSS classes. Input: "${analysisInput}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<div class="bg-red-500/10 text-red-400 p-4 rounded-md">An error occurred while communicating with the AI. Please try again.</div>');
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleCapabilityOptimize = async (capability: ClaudeCapability) => {
        const capabilityPrompts: Record<string, { title: string; prompt: string }> = {
            'formatting': {
                title: 'Optimize for Detailed Analysis Formatting',
                prompt: `You are a content strategist specializing in formatting for advanced AI like Claude. Take the following generic content about AI SEO and restructure it with detailed formatting. Add clear headings, subheadings, bullet points, and blockquotes to make it highly scannable and analyzable for an AI.
                
                Content: "AI SEO is the process of optimizing content for artificial intelligence search engines. It involves creating comprehensive, semantically rich, and well-structured content. Key techniques include using natural language, answering questions directly, and providing deep context. This differs from traditional SEO which was more keyword-focused."
        
                Format the output as a block of clean HTML using Tailwind CSS classes.`
            },
            'context': {
                title: 'Optimize for Context Window Utilization',
                prompt: `You are an AI interaction designer. Explain 3-4 best practices for structuring a very long document to maximize Claude's large context window utilization. Focus on techniques like adding a summary at the top, using XML tags to delineate sections, and repeating key instructions. Provide examples for each practice.
                
                Format the output as a well-structured HTML list using Tailwind CSS classes.`
            },
            'multi-doc': {
                title: 'Optimize for Multi-document Processing',
                prompt: `You are an information architect for AI systems. A user wants to submit multiple documents to Claude for analysis. Provide a step-by-step guide on how to prepare these documents for optimal cross-referencing and synthesis. Include advice on creating a summary document, using consistent naming conventions, and asking precise questions about the document set.
                
                Format the output as a well-structured HTML guide using Tailwind CSS classes.`
            },
            'flow': {
                title: 'Optimize for Logical Flow Enhancement',
                prompt: `You are a writing expert specializing in logical flow. The following content has a disjointed logical flow. Rewrite it to be more coherent and logical, with clear transitions between ideas, making it easier for an AI like Claude to follow the reasoning.
                
                Original Content: "Claude is good at reasoning. Your content needs clear headings. It has a large context window. You should provide background information. Logical fallacies should be avoided."
        
                Format the rewritten content as a block of clean HTML using Tailwind CSS classes, explaining briefly what was changed.`
            }
        };

        const action = capabilityPrompts[capability.id];
        if (!action) {
            alert(`Optimization for "${capability.title}" is not implemented.`);
            return;
        }

        setModalTitle(`AI Assistant: ${action.title}`);
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: action.prompt });
            setModalContent(response.text);
            
            setData(prevData => {
                const newCapabilities = prevData.capabilities.map(cap => {
                    if (cap.id === capability.id) {
                        const currentVal = parseInt(cap.metric1.value, 10);
                        if (!isNaN(currentVal)) {
                           const newVal = Math.min(currentVal + 5, 100);
                           return { ...cap, metric1: {...cap.metric1, value: `${newVal}%`} };
                        }
                    }
                    return cap;
                });
                const newStats = {
                    ...prevData.stats,
                    compatibilityScore: Math.min(prevData.stats.compatibilityScore + 2, 100),
                    optimizedPages: prevData.stats.optimizedPages + 1
                };
                return { capabilities: newCapabilities, stats: newStats };
            });

        } catch (e) {
            console.error(e);
            setModalContent('<p class="text-red-400">An error occurred. Please try again.</p>');
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleAction = async (actionId: string) => {
        const genericContent = "Claude is a large language model from Anthropic. It excels at complex reasoning and has a large context window. To optimize for Claude, content should be well-structured, coherent, and provide deep context. It's also important to explore topics with nuance, acknowledging multiple perspectives. This allows the model to perform more sophisticated analysis and generation tasks.";
        const actionMap: Record<string, { title: string; prompt: string }> = {
            'improve-coherence': { title: 'Improve Coherence', prompt: `You are a writing expert specializing in logical flow for AI. Analyze the following content and provide 3-5 specific suggestions to improve its coherence and logical transitions for better comprehension by an advanced AI like Claude. Format the response as a well-structured HTML list. Content: "${genericContent}"` },
            'structure-for-analysis': { title: 'Structure for Analysis', prompt: `You are a content strategist optimizing for advanced AI analysis. Restructure the following text to be ideal for multi-document analysis and complex reasoning by an AI like Claude. Focus on clear headings, thematic grouping, and explicit connections between ideas. Format as a block of clean HTML. Content: "${genericContent}"` },
            'enhance-nuance': { title: 'Enhance Nuance', prompt: `You are a sophisticated writer. The following text is too simplistic. Rewrite it to add more nuance, subtlety, and depth, exploring multiple perspectives and acknowledging complexities, making it suitable for an advanced reasoning AI like Claude. Format as a block of clean HTML. Content: "${genericContent}"` },
            'generate-counter-arguments': { title: 'Generate Counter-arguments', prompt: `You are a critical thinking expert. For the main argument in the following text, generate 2-3 well-reasoned counter-arguments or alternative viewpoints. This will help create a more balanced and comprehensive document for an advanced AI like Claude to analyze. Format as a well-structured HTML list. Content: "${genericContent}"` },
        };
        const action = actionMap[actionId];
        if (!action) return;

        setModalTitle(`AI Assistant: ${action.title}`);
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: action.prompt });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<p class="text-red-400">An error occurred. Please try again.</p>');
        } finally {
            setIsLoadingModal(false);
        }
    };


    return (
        <div className="space-y-6">
            <ClaudeHeader />
            
            <Card title="Analyze Content for Claude Compatibility">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        value={analysisInput}
                        onChange={(e) => setAnalysisInput(e.target.value)}
                        className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text"
                        placeholder="Enter website URL, app, or text to analyze..."
                        disabled={isLoadingModal}
                    />
                    <button
                      onClick={handleMainAnalyze}
                      disabled={isLoadingModal || !analysisInput.trim()}
                      className="w-full sm:w-auto flex-shrink-0 bg-orange-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:bg-orange-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoadingModal ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          <span>Analyzing...</span>
                        </>
                      ) : 'Analyze'}
                    </button>
                </div>
            </Card>
            
            <Card title="Overall Claude Performance">
                <ClaudeStats stats={data.stats} />
            </Card>

            <Card title="Claude Capabilities Optimization">
                 <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Enhance your content for Claude's unique reasoning and analysis features.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.capabilities.map(cap => (
                        <CapabilityCard 
                            key={cap.id} 
                            capability={cap} 
                            onOptimize={handleCapabilityOptimize}
                        />
                    ))}
                 </div>
            </Card>

            <Card title="Logical Flow & Coherence Analysis">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Score your content's structure and get AI-powered suggestions for better logical flow.</p>
                <LogicalFlowAnalysis />
            </Card>
            
            <Card title="Context Window Simulator">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Optimize long-form content by analyzing token usage and generating concise summaries.</p>
                <ContextWindowSimulator />
            </Card>

            <Card title="Quick Optimization Actions">
                <QuickActions data={CLAUDE_QUICK_ACTIONS_DATA} onAction={handleAction} />
            </Card>

            <ActionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={modalTitle} 
                isLoading={isLoadingModal} 
                content={modalContent} 
            />
        </div>
    );
};