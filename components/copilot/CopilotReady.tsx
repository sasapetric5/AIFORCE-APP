import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card } from '../Card';
import { ActionModal } from '../competitive_intelligence/ActionModal';
import { COPILOT_DATA } from '../../constants/copilotData';
import type { CopilotCapability, CopilotGuide, CopilotWorkflowTool, CopilotStats } from '../../types';

// --- SUB-COMPONENTS ---

const CopilotHeader: React.FC = () => (
    <div className="bg-gradient-to-r from-copilot-blue to-indigo-800 text-white p-6 rounded-xl mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-wider">Copilot Ready</h1>
        <p className="text-lg opacity-90 tracking-wide mt-2">Actionable & Workflow-centric Optimization</p>
    </div>
);

const CapabilityCard: React.FC<{
    capability: CopilotCapability;
    onOptimize: (capability: CopilotCapability) => void;
    isLoading: boolean;
    loadingId: string;
}> = ({ capability, onOptimize, isLoading, loadingId }) => {
    const isThisCardLoading = isLoading && loadingId === capability.id;

    return (
        <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg border-t-4 border-copilot-blue hover:shadow-copilot-blue/10 transition-all duration-300 flex flex-col hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center mb-4">
                <div className="bg-copilot-blue/10 text-copilot-blue rounded-lg p-3 mr-4">
                    <i className={`text-2xl ${capability.icon}`}></i>
                </div>
                <h3 className="text-lg font-bold text-dark-text dark:text-light-text">{capability.title}</h3>
            </div>
            <p className="text-sm text-medium-text-light dark:text-medium-text mb-4 min-h-[40px] flex-grow">{capability.description}</p>
             <ul className="space-y-2 text-sm mb-4">
                {capability.features.map(feature => (
                    <li key={feature} className="flex items-start">
                        <span className="text-copilot-blue mr-2">✓</span>
                        <span className="text-medium-text-light dark:text-medium-text">{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => onOptimize(capability)}
                disabled={isLoading}
                className="w-full mt-auto text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 bg-copilot-blue hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed"
            >
                {isThisCardLoading ? (
                     <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Optimizing...</span>
                    </>
                ) : (
                    <><i className="fas fa-magic"></i> Optimize</>
                )}
            </button>
        </div>
    );
};

const StepByStepGuides: React.FC<{ guides: CopilotGuide[] }> = ({ guides }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map(guide => (
            <div key={guide.title} className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                 <h4 className="font-semibold text-dark-text dark:text-light-text mb-3">{guide.title}</h4>
                 <ol className="relative border-l border-gray-200 dark:border-gray-700">
                     {guide.steps.map((step, index) => (
                         <li key={index} className="mb-6 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-copilot-blue rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 text-white">
                                {index + 1}
                            </span>
                            <div className="ml-2">
                                <h5 className="font-bold text-dark-text dark:text-light-text">{step.title}</h5>
                                <p className="text-sm text-medium-text-light dark:text-medium-text">{step.description}</p>
                            </div>
                        </li>
                     ))}
                 </ol>
            </div>
        ))}
    </div>
);

const WorkflowIntegration: React.FC<{
    tools: CopilotWorkflowTool[];
    onToggle: (name: string) => void;
}> = ({ tools, onToggle }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tools.map(tool => (
            <div
                key={tool.name}
                className={`
                    bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center transition-all duration-300 border
                    ${tool.connected ? 'border-green-500' : 'border-light-border dark:border-dark-border'}
                `}
            >
                <div className="relative inline-block">
                    <i className={`text-4xl ${tool.icon} ${tool.connected ? 'text-green-400' : 'text-copilot-blue'}`}></i>
                    {tool.connected && (
                         <div className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-light-bg dark:border-dark-bg">
                            <i className="fas fa-check text-xs"></i>
                        </div>
                    )}
                </div>
                <p className="text-sm font-semibold mt-2 text-dark-text dark:text-light-text">{tool.name}</p>
                <button
                    onClick={() => onToggle(tool.name)}
                    className={`
                        w-full text-xs font-bold py-2 px-3 rounded-md mt-3 transition-colors
                        ${tool.connected
                            ? 'bg-gray-200 dark:bg-dark-border text-medium-text-light dark:text-medium-text hover:bg-red-500/20 hover:text-red-400'
                            : 'bg-copilot-blue text-white hover:bg-blue-700'
                        }
                    `}
                >
                    {tool.connected ? 'Disconnect' : 'Connect'}
                </button>
            </div>
        ))}
    </div>
);


const ProductivityMetrics: React.FC<{ stats: CopilotStats }> = ({ stats }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center"><div className="text-4xl font-bold text-copilot-blue">{stats.productivityGain}</div><p className="text-sm text-medium-text-light dark:text-medium-text mt-1">Productivity Gain</p></div>
        <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center"><div className="text-4xl font-bold text-copilot-blue">{stats.taskCompletion}%</div><p className="text-sm text-medium-text-light dark:text-medium-text mt-1">Task Completion</p></div>
        <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center"><div className="text-4xl font-bold text-copilot-blue">{stats.guidesCreated}</div><p className="text-sm text-medium-text-light dark:text-medium-text mt-1">Guides Created</p></div>
        <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center"><div className="text-4xl font-bold text-green-400">{stats.efficiencyBoost}</div><p className="text-sm text-medium-text-light dark:text-medium-text mt-1">Efficiency Boost</p></div>
    </div>
);

// --- MAIN COMPONENT ---

export const CopilotReady: React.FC = () => {
    const [stats, setStats] = useState<CopilotStats>(COPILOT_DATA.stats);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [loadingCapabilityId, setLoadingCapabilityId] = useState('');
    const [workflowTools, setWorkflowTools] = useState<CopilotWorkflowTool[]>(COPILOT_DATA.workflowTools);
    const [analysisInput, setAnalysisInput] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                taskCompletion: Math.min(99, prev.taskCompletion + 1)
            }));
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleIntegration = (name: string) => {
        setWorkflowTools(prevTools => {
            return prevTools.map(tool => {
                if (tool.name === name) {
                    if (!tool.connected) {
                        window.open(tool.url, '_blank', 'noopener,noreferrer');
                    }
                    return { ...tool, connected: !tool.connected };
                }
                return tool;
            });
        });
    };

    const handleOptimize = async (capability: CopilotCapability) => {
        if (!analysisInput.trim()) {
            alert("Please provide a website, app, text, or code to analyze before optimizing.");
            return;
        }

        const prompts: Record<string, string> = {
            'guides': `You are an expert technical writer. Based on the following user input, generate a comprehensive, step-by-step guide. The guide should be clear, actionable, and tailored for a developer audience. Format the output as a clean HTML ordered list (\`<ol>\` with \`<li>\` items). User Input: "${analysisInput}"`,
            'snippets': `You are an expert software engineer. Based on the following user request, generate a high-quality, well-commented code snippet. Automatically detect the programming language if not specified. Format the output as a clean HTML block with a \`<pre><code class="language-xyz">\` tag. User Request: "${analysisInput}"`,
            'integration': `You are a workflow optimization specialist. Based on the following tool or concept, provide 3 actionable tips for integrating it into an existing developer workflow. Focus on minimizing disruption and maximizing productivity. Format as a clean HTML unordered list (\`<ul>\` with \`<li>\` items). Tool/Concept: "${analysisInput}"`,
            'hacks': `You are a productivity expert for developers. Based on the following topic or tool, generate 3-5 insightful productivity hacks. The hacks should be practical and easy to implement. Format as a clean HTML unordered list (\`<ul>\` with \`<li>\` items). Topic/Tool: "${analysisInput}"`
        };

        const prompt = prompts[capability.id];
        if (!prompt) return;

        setModalTitle(`AI Assistant: Optimize ${capability.title}`);
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setLoadingCapabilityId(capability.id);
        setModalContent(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            
            if (!response) {
                throw new Error("Received an empty or invalid response from the AI model.");
            }

            setModalContent(response.text);

            setStats(prev => ({
                ...prev,
                guidesCreated: capability.id === 'guides' ? prev.guidesCreated + 1 : prev.guidesCreated,
                efficiencyBoost: `+${parseInt(prev.efficiencyBoost.replace(/[+%]/g, '')) + 1}%`
            }));

        } catch (e) {
            console.error(e);
            setModalContent('<p class="text-red-400">An error occurred. Please try again.</p>');
        } finally {
            setIsLoadingModal(false);
            setLoadingCapabilityId('');
        }
    };
    
    return (
        <div className="space-y-6">
            <CopilotHeader />
            
            <Card title="Analyze for Copilot Readiness">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Enter a website URL, app link, text, or code block. The AI will use this context to generate tailored optimizations below.</p>
                <textarea
                    value={analysisInput}
                    onChange={(e) => setAnalysisInput(e.target.value)}
                    rows={6}
                    className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-copilot-blue focus:border-copilot-blue font-mono text-sm placeholder-medium-text-light dark:placeholder-medium-text"
                    placeholder="e.g., 'Create a React component for a login form' or 'https://myapi.com/docs'..."
                    disabled={isLoadingModal}
                />
            </Card>

            <Card title="Productivity Metrics">
                <ProductivityMetrics stats={stats} />
            </Card>
            <Card title="Copilot Capabilities">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Use the content from the analysis box above to generate context-aware optimizations.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {COPILOT_DATA.capabilities.map(cap => (
                        <CapabilityCard 
                            key={cap.id} 
                            capability={cap} 
                            onOptimize={handleOptimize}
                            isLoading={isLoadingModal}
                            loadingId={loadingCapabilityId}
                        />
                    ))}
                </div>
            </Card>
            <Card title="Popular Step-by-Step Guides">
                <StepByStepGuides guides={COPILOT_DATA.guides} />
            </Card>
            <Card title="Workflow Integration">
                 <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Connect your favorite tools to streamline your workflow and boost productivity.</p>
                <WorkflowIntegration tools={workflowTools} onToggle={handleToggleIntegration} />
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