import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import { ActionModal } from '../competitive_intelligence/ActionModal';
import { DEEPSEEK_DATA, DEEPSEEK_QUICK_ACTIONS_DATA } from '../../constants/deepseekData';
import type { DeepSeekData, DeepSeekCapability, CodeAnalysisResult, DeepSeekQuickAction } from '../../types';

// --- SUB-COMPONENTS ---

const DeepSeekHeader: React.FC = () => (
    <div className="bg-gradient-to-r from-green-600 to-emerald-800 text-white p-6 rounded-xl mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-wider">DeepSeek Specialist</h1>
        <p className="text-lg opacity-90 tracking-wide mt-2">Technical & Code-focused Optimization</p>
    </div>
);

const CapabilityCard: React.FC<{
    capability: DeepSeekCapability;
    onOptimize: (capability: DeepSeekCapability) => void;
}> = ({ capability, onOptimize }) => {
    return (
        <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg border-t-4 border-green-500 hover:shadow-green-500/10 transition-all duration-300 flex flex-col hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center mb-4">
                <div className="bg-green-500/10 text-green-400 rounded-lg p-3 mr-4">
                    <i className={`text-2xl ${capability.icon}`}></i>
                </div>
                <h3 className="text-lg font-bold text-dark-text dark:text-light-text">{capability.title}</h3>
            </div>
            <p className="text-sm text-medium-text-light dark:text-medium-text mb-4 min-h-[40px] flex-grow">{capability.description}</p>
            <div className="grid grid-cols-2 gap-4 text-center my-4">
                <div className="bg-light-card dark:bg-dark-card p-3 rounded-lg">
                    <div className="text-xl font-bold text-green-400">{capability.metric1.value}</div>
                    <div className="text-xs text-medium-text-light dark:text-medium-text">{capability.metric1.label}</div>
                </div>
                <div className="bg-light-card dark:bg-dark-card p-3 rounded-lg">
                    <div className="text-xl font-bold text-green-400">{capability.metric2.value}</div>
                    <div className="text-xs text-medium-text-light dark:text-medium-text">{capability.metric2.label}</div>
                </div>
            </div>
            <button
                onClick={() => onOptimize(capability)}
                className="w-full mt-auto text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
            >
                <i className="fas fa-magic"></i> Optimize
            </button>
        </div>
    );
};

const CodeDiffViewer: React.FC<{ original: string; optimized: string }> = ({ original, optimized }) => {
    const originalLines = original.split('\n');
    const optimizedLines = optimized.split('\n');
    const optimizedSet = new Set(optimizedLines);
    const originalSet = new Set(originalLines);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(optimized);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="font-mono text-sm bg-slate-950 border border-dark-border rounded-md overflow-hidden mt-4">
            <div className="grid grid-cols-2">
                <div className="p-2 sm:p-4 border-r border-dark-border">
                    <h5 className="text-medium-text mb-2 text-sm font-semibold">Original Code</h5>
                </div>
                <div className="p-2 sm:p-4">
                     <div className="flex justify-between items-center mb-2">
                        <h5 className="text-medium-text text-sm font-semibold">Optimized Version</h5>
                         <button onClick={handleCopy} className="text-xs bg-dark-border text-medium-text py-1 px-2 rounded hover:bg-slate-600 transition-colors font-sans">
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 bg-dark-card overflow-x-auto">
                <pre className="p-2 sm:p-4 whitespace-pre-wrap break-words">
                    {originalLines.map((line, index) => (
                        <div key={`a-${index}`} className={`flex ${!optimizedSet.has(line) ? 'bg-red-500/10' : ''}`}>
                            <span className="w-8 text-right text-medium-text pr-2 select-none shrink-0">{index + 1}</span>
                            <span className="flex-1">{line || ' '}</span>
                        </div>
                    ))}
                </pre>
                <pre className="p-2 sm:p-4 border-l border-dark-border whitespace-pre-wrap break-words">
                    {optimizedLines.map((line, index) => (
                        <div key={`b-${index}`} className={`flex ${!originalSet.has(line) ? 'bg-green-500/10' : ''}`}>
                            <span className="w-8 text-right text-medium-text pr-2 select-none shrink-0">{index + 1}</span>
                            <span className="flex-1">{line || ' '}</span>
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );
};


const CodeQualityAnalysis: React.FC = () => {
    const [code, setCode] = useState('function example(arr) {\n  // A simple bubble sort for demonstration\n  for (var i = 0; i < arr.length; i++) {\n    for (var j = 0; j < (arr.length - i - 1); j++) {\n      if (arr[j] > arr[j + 1]) {\n        var temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null);
    const [analysisError, setAnalysisError] = useState('');

    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationResult, setOptimizationResult] = useState<{ original: string; optimized: string } | null>(null);
    const [optimizationError, setOptimizationError] = useState('');


    const handleAnalyze = async () => {
        if (!code) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setAnalysisError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As a senior software engineer, analyze the following code snippet for quality, efficiency, and adherence to best practices. Provide a quality score (0-100) and 3 actionable improvement suggestions for a technical audience. Respond in JSON. Code: "${code}"`;
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
            setAnalysisResult(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setAnalysisError('Failed to analyze. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleOptimize = async () => {
        if (!code) return;
        setIsOptimizing(true);
        setOptimizationResult(null);
        setOptimizationError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As an expert senior software engineer, refactor and optimize the following code snippet for performance, readability, and modern best practices.
            
            IMPORTANT: ONLY return the complete, refactored code block. Do not include any explanation, comments about your changes, markdown formatting (like \`\`\`javascript), or any other text outside of the code itself.

            Code to optimize:
            \`\`\`
            ${code}
            \`\`\`
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
            });
            const optimizedCode = response.text.replace(/```[a-z]*\n/g, '').replace(/```\n/g, '').trim();
            setOptimizationResult({ original: code, optimized: optimizedCode });
        } catch (e) {
            console.error(e);
            setOptimizationError('Failed to optimize code. The AI model may have refused the request. Please try again.');
        } finally {
            setIsOptimizing(false);
        }
    };

    const score = analysisResult?.score ?? 0;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="font-semibold text-dark-text dark:text-light-text">Code Snippet</h4>
                    <div className="relative">
                        <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={12} className="w-full bg-slate-950 border border-dark-border text-slate-300 rounded-md p-4 font-mono text-sm focus:ring-green-500 focus:border-green-500 placeholder-medium-text" placeholder="Paste code snippet here..."></textarea>
                        <span className="absolute top-3 right-3 text-xs bg-dark-border text-medium-text px-2 py-1 rounded">JavaScript</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={handleAnalyze} disabled={isAnalyzing || isOptimizing} className="flex-1 bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 disabled:bg-brand-primary/50 flex justify-center items-center gap-2">
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Quality'}
                        </button>
                        <button onClick={handleOptimize} disabled={isAnalyzing || isOptimizing} className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-800 flex justify-center items-center gap-2">
                            {isOptimizing ? 'Optimizing...' : 'Optimize Code'}
                        </button>
                    </div>
                </div>
                <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-dark-text dark:text-light-text">Analysis & Optimization</h4>
                         {optimizationResult && (
                             <button onClick={() => setOptimizationResult(null)} className="text-sm text-blue-400 hover:text-blue-300">
                                 &larr; Back to Analysis
                             </button>
                         )}
                    </div>

                    {optimizationError && <p className="text-red-400">{optimizationError}</p>}
                    
                    {optimizationResult ? (
                        <CodeDiffViewer original={optimizationResult.original} optimized={optimizationResult.optimized} />
                    ) : (
                        <>
                            {analysisError && <p className="text-red-400">{analysisError}</p>}
                            {!analysisResult && !isAnalyzing && <div className="text-center text-medium-text-light dark:text-medium-text h-full flex items-center justify-center">Run analysis to see results.</div>}
                            {isAnalyzing && <div className="text-center text-medium-text-light dark:text-medium-text h-full flex items-center justify-center">Analyzing code...</div>}
                            {analysisResult && (
                                <>
                                    <div className="text-center mb-4">
                                        <div className="relative inline-block">
                                            <svg className="w-32 h-32" viewBox="0 0 36 36"><path className="text-light-border dark:text-dark-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" /><path className="text-green-500" strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{score}</div>
                                        </div>
                                        <p className="font-semibold mt-2">Code Quality Score</p>
                                    </div>
                                    <ul className="text-left space-y-2 text-sm">
                                        {analysisResult.suggestions.map((s, i) => <li key={i} className="flex items-start"><span className="mr-2 text-green-400">›</span><span>{s}</span></li>)}
                                    </ul>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const QuickActions: React.FC<{ data: DeepSeekQuickAction[], onAction: (actionId: string, context?: any) => void }> = ({ data, onAction }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map(action => (
            <button key={action.id} onClick={() => onAction(action.id)} className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center hover:bg-slate-200 dark:hover:bg-dark-border transition-colors group">
                <div className="text-3xl mb-2 text-green-400 group-hover:text-green-300 transition-colors"><i className={action.icon}></i></div>
                <div className="text-sm font-semibold text-dark-text dark:text-light-text">{action.text}</div>
            </button>
        ))}
    </div>
);

// --- MAIN COMPONENT ---

export const DeepSeekSpecialist: React.FC = () => {
    const [data, setData] = useState<DeepSeekData>(DEEPSEEK_DATA);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [analysisInput, setAnalysisInput] = useState('');

    const handleMainAnalyze = async () => {
        if (!analysisInput.trim()) {
            alert('Please provide a URL, app link, or code to analyze.');
            return;
        }

        setModalTitle('AI Analysis for DeepSeek Compatibility');
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                As a "DeepSeek Specialist" and expert technical analyst, perform a comprehensive evaluation of the following input. The input could be a URL, an app description, or a raw code snippet.
                
                Your analysis should focus on aspects that are highly relevant to a technical audience and AI models like DeepSeek, which excel at code and technical understanding.
                
                Input for analysis:
                \`\`\`
                ${analysisInput}
                \`\`\`

                Generate a report covering these key areas:
                1.  **Overall Technical Summary:** A brief overview of the input.
                2.  **Code Quality & Best Practices (if code is present):** Assess readability, efficiency, and use of modern standards.
                3.  **Architectural Assessment (if applicable):** Infer and comment on the potential system architecture or design patterns.
                4.  **Algorithm Analysis (if applicable):** Identify any algorithms and discuss their complexity or efficiency.
                5.  **Technical Depth Score:** Provide a score from 0-100 on the content's technical depth.
                6.  **Recommendations for DeepSeek:** Provide 3-5 actionable recommendations to improve the content's appeal and clarity for a technical audience and for AI models like DeepSeek.

                Format the entire response as a single block of clean, well-structured HTML using Tailwind CSS classes. Use headers (h3, h4), paragraphs (p), lists (ul/li), and code blocks (<pre><code>). Make it visually appealing and easy to read within a modal window. Do not include <html> or <body> tags. The main container should be a div.
            `;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<div class="bg-red-500/10 text-red-400 p-4 rounded-md">An error occurred while communicating with the AI. Please try again.</div>');
        } finally {
            setIsLoadingModal(false);
        }
    };


    const handleCapabilityOptimize = async (capability: DeepSeekCapability) => {
        // ... Logic for handling optimization for a specific capability
        setModalTitle(`AI Assistant: Optimize ${capability.title}`);
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Generate a brief optimization plan for "${capability.title}" for a technical audience. Format as a clean HTML list.` });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<p class="text-red-400">An error occurred. Please try again.</p>');
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleAction = async (actionId: string) => {
        const actionMap: Record<string, { title: string; prompt: string }> = {
            'generate-code-snippet': { title: 'Generate Code Snippet', prompt: 'You are a senior developer. Generate a Python code snippet that demonstrates a simple REST API client using the requests library. Include comments. Format as a clean HTML block with a code tag.' },
            'refactor-code': { title: 'Refactor Code', prompt: 'You are a senior software architect. Take a poorly written JavaScript function for sorting an array and refactor it for better performance and readability. Show a "before" and "after". Format as a clean HTML block with code tags.' },
            'explain-algorithm': { title: 'Explain Algorithm', prompt: 'You are a computer science professor. Explain the Dijkstra\'s algorithm in simple terms, including its use case and time complexity. Format as a well-structured HTML document.' },
            'create-architecture-diagram': { title: 'Create Architecture Diagram', prompt: 'You are a system architect. Describe a simple three-tier web application architecture (presentation, application, data layers). Provide a text-based diagram (using characters like `-->`, `[ ]`) and explain each component. Format as a clean HTML block with a pre tag.' },
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
            <DeepSeekHeader />

            <Card title="Analyze for DeepSeek Compatibility">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Enter a website URL, app link, or paste a code block to receive a technical analysis optimized for DeepSeek's capabilities.</p>
                <div className="space-y-4">
                    <textarea
                        value={analysisInput}
                        onChange={(e) => setAnalysisInput(e.target.value)}
                        rows={5}
                        className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-green-500 focus:border-green-500 font-mono text-sm placeholder-medium-text-light dark:placeholder-medium-text"
                        placeholder="Enter URL, app link, or paste code here..."
                        disabled={isLoadingModal}
                    />
                    <button
                        onClick={handleMainAnalyze}
                        disabled={isLoadingModal || !analysisInput.trim()}
                        className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoadingModal && modalTitle.includes("DeepSeek Compatibility") ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Analyzing...</span>
                            </>
                        ) : 'Analyze for DeepSeek'}
                    </button>
                </div>
            </Card>

            <Card title="DeepSeek Capabilities Optimization">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Enhance your technical content for DeepSeek's unique code and algorithm understanding.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.capabilities.map(cap => (
                        <CapabilityCard key={cap.id} capability={cap} onOptimize={handleCapabilityOptimize} />
                    ))}
                </div>
            </Card>
            <Card title="Code Quality & Efficiency Analysis">
                 <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Get AI-powered analysis on your code snippets for better performance and best practices.</p>
                <CodeQualityAnalysis />
            </Card>
            <Card title="Quick Technical Actions">
                <QuickActions data={DEEPSEEK_QUICK_ACTIONS_DATA} onAction={handleAction} />
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