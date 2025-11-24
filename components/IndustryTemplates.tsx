import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card } from './Card';
import { ActionModal } from './competitive_intelligence/ActionModal';

const INDUSTRY_DATA = [
    {
        id: 'healthcare',
        title: 'Healthcare AI Visibility',
        icon: 'fas fa-heartbeat',
        color: 'text-red-400',
        borderColor: 'border-red-500',
        description: 'Ensure your medical content meets the highest standards for accuracy, compliance, and patient trust.',
        features: [
            'HIPAA-compliant optimization',
            'Medical citation formatting',
            'Clinical trial visibility',
            'Patient education content'
        ]
    },
    {
        id: 'legal',
        title: 'Legal AI Optimization',
        icon: 'fas fa-gavel',
        color: 'text-amber-400',
        borderColor: 'border-amber-500',
        description: 'Enhance the visibility and authority of legal content for AI search and analysis platforms.',
        features: [
            'Case law citation optimization',
            'Regulatory update visibility',
            'Legal precedent highlighting',
            'Jurisdiction-specific formatting'
        ]
    },
    {
        id: 'finance',
        title: 'Finance AI Compliance',
        icon: 'fas fa-piggy-bank',
        color: 'text-green-400',
        borderColor: 'border-green-500',
        description: 'Optimize financial content for accuracy, regulatory compliance, and investor confidence.',
        features: [
            'Financial disclosure templates',
            'Regulatory reporting optimization',
            'Risk factor visibility',
            'Investment insight formatting'
        ]
    },
    {
        id: 'ecommerce',
        title: 'E-commerce Product AI',
        icon: 'fas fa-shopping-cart',
        color: 'text-blue-400',
        borderColor: 'border-blue-500',
        description: 'Drive product discovery and sales by optimizing your e-commerce listings for AI shopping assistants.',
        features: [
            'Product attribute optimization',
            'Review sentiment structuring',
            'Price comparison visibility',
            'Inventory status updates'
        ]
    },
    {
        id: 'education',
        title: 'Education AI Strategy',
        icon: 'fas fa-graduation-cap',
        color: 'text-purple-400',
        borderColor: 'border-purple-500',
        description: 'Adapt educational materials for e-learning platforms and AI-driven tutoring systems.',
        features: [
            'Curriculum structuring',
            'E-learning content optimization',
            'Academic citation standards',
            'Student engagement prompts'
        ]
    },
    {
        id: 'saas',
        title: 'SaaS & Tech AI Blueprints',
        icon: 'fas fa-laptop-code',
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500',
        description: 'Structure technical content for clarity, discoverability, and adoption by developers and tech professionals.',
        features: [
            'Technical documentation clarity',
            'Feature announcement templates',
            'API guide formatting',
            'Developer-focused content'
        ]
    }
];

const IndustryTemplateCard: React.FC<{
    template: typeof INDUSTRY_DATA[0];
    onAction: (templateId: string) => void;
    isLoading: boolean;
    loadingId: string | null;
    isInputEmpty: boolean;
}> = ({ template, onAction, isLoading, loadingId, isInputEmpty }) => {
    const isThisCardLoading = isLoading && loadingId === template.id;

    return (
        <div className={`bg-light-bg dark:bg-dark-bg p-6 rounded-lg border-t-4 ${template.borderColor} flex flex-col hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300`}>
            <div className="flex items-center mb-4">
                <div className={`text-3xl ${template.color} mr-4`}><i className={template.icon}></i></div>
                <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{template.title}</h3>
            </div>
            <p className="text-sm text-medium-text-light dark:text-medium-text mb-4 flex-grow">{template.description}</p>
            <ul className="space-y-2 text-sm mb-6">
                {template.features.map(feature => (
                    <li key={feature} className="flex items-start">
                        <span className={`${template.color} mr-2 mt-1 text-xs`}>◆</span>
                        <span className="text-medium-text-light dark:text-medium-text">{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => onAction(template.id)}
                disabled={isLoading || isInputEmpty}
                className="w-full mt-auto bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:bg-brand-secondary/50 disabled:cursor-not-allowed"
                title={isInputEmpty ? "Please enter content in the text box above" : "Analyze & Apply Template"}
            >
                {isThisCardLoading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Analyzing...</>
                ) : (
                    'Analyze & Apply Template'
                )}
            </button>
        </div>
    );
};

export const IndustryTemplates: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);
    const [userInput, setUserInput] = useState('');

    const handleAction = async (templateId: string) => {
        if (!userInput.trim()) {
            alert("Please enter some content to analyze first.");
            return;
        }

        const template = INDUSTRY_DATA.find(t => t.id === templateId);
        if (!template) return;
        
        const prompts: Record<string, string> = {
            healthcare: `You are a specialist in healthcare marketing and compliance. Rewrite the following user-provided text for a healthcare audience, incorporating principles like HIPAA compliance, patient trust, and medical accuracy. Use keywords like 'patient outcomes', 'clinical efficiency', and 'healthcare data security'. Original text: "${userInput}"`,
            legal: `You are a specialist in legal marketing. Rewrite the following user-provided text for a legal industry audience. Emphasize compliance, case management, and legal precedent. Use terminology like 'e-discovery', 'litigation support', and 'regulatory compliance'. Original text: "${userInput}"`,
            finance: `You are a specialist in financial technology marketing. Rewrite the following user-provided text for a finance industry audience. Focus on security, regulatory compliance (e.g., FINRA, SEC), and investment analysis. Use terms like 'portfolio management', 'risk assessment', and 'fintech solutions'. Original text: "${userInput}"`,
            ecommerce: `You are an e-commerce optimization expert. Rewrite the following user-provided text for an e-commerce audience. Focus on product discovery, conversion rates, and customer experience. Use phrases like 'inventory management', 'personalized shopping', and 'omnichannel retail'. Original text: "${userInput}"`,
            education: `You are an expert in educational content design. Rewrite the following user-provided text for an e-learning or academic audience. Structure the content for better learning retention, use clear pedagogical language, and suggest engagement points. Use terms like 'learning outcomes', 'curriculum design', and 'instructional scaffolding'. Original text: "${userInput}"`,
            saas: `You are an expert in SaaS and technical marketing. Rewrite the following user-provided text for a technical audience of developers and IT professionals. Focus on clarity, technical accuracy, and integration possibilities. Use keywords like 'API integration', 'scalable architecture', 'developer workflow', and 'technical documentation'. Original text: "${userInput}"`
        };

        const prompt = prompts[templateId];
        if (!prompt) return;

        setModalTitle(`AI Assistant: Applying ${template.title}`);
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setLoadingTemplateId(templateId);
        setModalContent(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const fullPrompt = `${prompt}\n\nFormat the response as a single block of clean, well-structured HTML using Tailwind CSS classes. Do not include <html> or <body> tags. The main container should be a div. Provide a "Before" and "After" section to show the transformation. The "Before" section should contain the original user-provided text.`;
            
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<div class="bg-red-500/10 text-red-400 p-4 rounded-md">An error occurred while generating the template. Please try again.</div>');
        } finally {
            setIsLoadingModal(false);
            setLoadingTemplateId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4">
                    <i className="fas fa-building text-teal-400"></i> Industry Templates
                </h1>
                <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">Specialized AI visibility solutions tailored for your sector.</p>
            </div>
            
             <Card title="Your Content">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-4">
                    Paste the content you want to adapt for a specific industry below. The AI will rewrite it based on the template you choose.
                </p>
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={8}
                    className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary resize-vertical placeholder-medium-text-light dark:placeholder-medium-text"
                    placeholder="Enter or paste your text here..."
                />
            </Card>

            <Card title="Select Your Industry">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Choose an industry template to automatically analyze and apply sector-specific optimizations to your content.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {INDUSTRY_DATA.map(template => (
                        <IndustryTemplateCard
                            key={template.id}
                            template={template}
                            onAction={handleAction}
                            isLoading={isLoadingModal}
                            loadingId={loadingTemplateId}
                            isInputEmpty={!userInput.trim()}
                        />
                    ))}
                </div>
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