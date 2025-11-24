
import React from 'react';

interface PlatformTemplatesProps {
    onApplyTemplate: (platformId: string) => void;
    isApplyingTemplate: string | null;
}

const templates = [
    {
        id: 'chatgpt',
        icon: '🤖',
        title: 'ChatGPT Optimized',
        subtitle: 'Conversational & Q&A Focus',
        description: "Restructure your content for ChatGPT's conversational nature with emphasis on Q&A format and comprehensive explanations.",
        features: ['Structured Q&A sections', 'Conversational tone', 'Step-by-step explanations', 'Follow-up question anticipation']
    },
    {
        id: 'perplexity',
        icon: '🔮',
        title: 'Perplexity Ready',
        subtitle: 'Fact-Based & Source-Centric',
        description: "Reformat for Perplexity's fact-checking approach with emphasis on credible sources and verifiable information.",
        features: ['Source citations', 'Fact-based structure', 'Data-driven insights', 'Reference formatting']
    },
    {
        id: 'gemini',
        icon: '🌐',
        title: 'Gemini Compatible',
        subtitle: 'Comprehensive & Structured',
        description: "Adapt your content for Google AI Overviews with comprehensive coverage, clear structure, and local intent optimization.",
        features: ['Comprehensive coverage', 'Structured headings', 'Local intent signals', 'Multi-perspective analysis']
    },
    {
        id: 'claude',
        icon: '💬',
        title: 'Claude Optimized',
        subtitle: 'In-Depth & Contextual',
        description: "Optimize for Claude's large context window and deep reasoning, focusing on rich background and nuanced analysis.",
        features: ['Deep contextual background', 'Multi-faceted analysis', 'Logical flow for reasoning', 'Nuanced explanations']
    },
    {
        id: 'copilot',
        icon: '©️',
        title: 'Copilot Ready',
        subtitle: 'Actionable & Workflow-centric',
        description: "Restructure for productivity and integration, providing actionable steps and examples for workflow assistance.",
        features: ['Actionable step-by-step guides', 'Code snippets and examples', 'Workflow integration tips', 'Productivity hacks']
    },
    {
        id: 'deepseek',
        icon: '🧠',
        title: 'DeepSeek Specialist',
        subtitle: 'Technical & Code-focused',
        description: "Aim at a technical audience by restructuring for deep dives into code, algorithms, and architecture.",
        features: ['Technical architecture breakdown', 'Algorithm explanations', 'Structured data formats', 'Code-heavy examples']
    },
    {
        id: 'mistral',
        icon: '🌬️',
        title: 'Mistral Balanced',
        subtitle: 'Efficient & Multi-faceted',
        description: "Create a versatile structure balancing technical depth with practical use cases, suitable for Mistral's efficient models.",
        features: ['Concise concept explanations', 'Balanced pros-and-cons lists', 'Practical applications', 'Future outlook']
    },
    {
        id: 'llama',
        icon: '🦙',
        title: 'Llama Community',
        subtitle: 'Accessible & Open',
        description: "Adopt an accessible structure designed for community engagement and open-source documentation, like for Llama models.",
        features: ['Beginner-friendly guides', 'Community FAQ sections', 'Contribution guidelines', 'Clear, simple language']
    },
    {
        id: 'poe',
        icon: '✨',
        title: 'Poe Adaptable',
        subtitle: 'Modular & Reusable',
        description: "Design modular, reusable content snippets for Poe's multi-bot platform, ideal for various AI personalities.",
        features: ['Self-contained content blocks', 'Reusable definitions', 'Adaptable examples', 'Bot-agnostic format']
    }
];

export const PlatformTemplates: React.FC<PlatformTemplatesProps> = ({ onApplyTemplate, isApplyingTemplate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
                <div key={template.id} className="bg-dark-bg p-6 rounded-lg border border-dark-border flex flex-col hover:border-brand-primary hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{template.icon}</span>
                        <div>
                            <h4 className="text-lg font-bold text-light-text">{template.title}</h4>
                            <p className="text-sm text-medium-text">{template.subtitle}</p>
                        </div>
                    </div>
                    <p className="text-sm text-medium-text mb-4 flex-grow">{template.description}</p>
                    <ul className="space-y-2 text-sm mb-6">
                        {template.features.map(feature => (
                            <li key={feature} className="flex items-start">
                                <span className="text-green-400 mr-2">✓</span>
                                <span className="text-medium-text">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => onApplyTemplate(template.id)} 
                        disabled={isApplyingTemplate !== null}
                        className="mt-auto w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2 disabled:bg-brand-primary/50 disabled:cursor-not-allowed"
                    >
                        {isApplyingTemplate === template.id ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Applying...</span>
                            </>
                        ) : (
                            `Apply ${template.title.split(' ')[0]} Structure`
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
};
