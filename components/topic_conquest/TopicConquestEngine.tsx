
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import type { TopicConquestAnalysis, TopicOpportunity } from '../../types';
import { MOCK_TOPIC_CONQUEST_DATA } from '../../constants/topicConquestData';

// --- SUB-COMPONENTS ---

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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1001] p-4" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{title}</h3>
                    <button onClick={onClose} className="text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {isLoading ? <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-conquest-orange mx-auto"></div><p className="mt-4 text-medium-text-light dark:text-medium-text">AI is strategizing...</p></div> : <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content || '' }} />}
                </main>
            </div>
        </div>
    );
};

const LoadingPlaceholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-conquest-orange mx-auto"></div>
        <p className="mt-4 text-medium-text">{message}</p>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="text-center py-16">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-light-text mb-4">Start Your Topic Conquest</h2>
        <p className="text-medium-text max-w-2xl mx-auto">
            Enter your domain and up to 3 competitor domains above to uncover high-potential content gaps and strategic topic opportunities in your niche.
        </p>
    </div>
);


// --- MAIN COMPONENT ---

export const TopicConquestEngine: React.FC = () => {
    const [yourDomain, setYourDomain] = useState('yourbrand.com');
    const [competitors, setCompetitors] = useState(['competitor-a.com', 'competitor-b.com', '']);
    const [analysisData, setAnalysisData] = useState<TopicConquestAnalysis | null>(MOCK_TOPIC_CONQUEST_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const handleCompetitorChange = (index: number, value: string) => {
        const newCompetitors = [...competitors];
        newCompetitors[index] = value;
        setCompetitors(newCompetitors);
    };

    const handleAnalyze = async () => {
        const validCompetitors = competitors.filter(c => c.trim() !== '');
        if (!yourDomain.trim() || validCompetitors.length === 0) {
            setError("Please provide your domain and at least one competitor.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisData(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert AI Content Strategist for a SaaS platform called "AI FORCE". Your task is to analyze a user's domain against their competitors to identify strategic content opportunities.

                User Domain: "${yourDomain}"
                Competitors: ${JSON.stringify(validCompetitors)}
                Niche: Tech/SaaS (assume this if not obvious)

                Generate a comprehensive analysis in a single JSON object. The analysis must include:
                1.  'topicOpportunities': An array of 5-7 high-potential topics. For each topic, provide an opportunity score (0-100), the user's current coverage ('High', 'Medium', 'Low', 'None'), the top competitor for that topic, the estimated visibility impact (0-100), the required investment ('Low', 'Medium', 'High'), and the AI model preference score for this topic (0-100).
                2.  'aiNichePreferences': An array of 5 popular themes/topics that AI models prefer in this niche, with a preference score (0-100).
                3.  'contentDepthComparison': An array of 3 topics comparing content depth. For each, provide a score (0-100) for the user's domain and each competitor.

                The JSON output must conform to the provided schema. Generate realistic but plausible data.
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            topicOpportunities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, topic: { type: Type.STRING }, opportunityScore: { type: Type.NUMBER }, yourCoverage: { type: Type.STRING }, topCompetitor: { type: Type.STRING }, visibilityImpact: { type: Type.NUMBER }, investment: { type: Type.STRING }, aiPreference: { type: Type.NUMBER } }, required: ['id', 'topic', 'opportunityScore', 'yourCoverage', 'topCompetitor', 'visibilityImpact', 'investment', 'aiPreference'] } },
                            aiNichePreferences: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, preference: { type: Type.NUMBER } }, required: ['topic', 'preference'] } },
                            contentDepthComparison: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, yourDepth: { type: Type.NUMBER }, competitorADepth: { type: Type.NUMBER }, competitorBDepth: { type: Type.NUMBER } }, required: ['topic', 'yourDepth', 'competitorADepth', 'competitorBDepth'] } },
                        },
                        required: ['topicOpportunities', 'aiNichePreferences', 'contentDepthComparison']
                    }
                }
            });

            const result = JSON.parse(response.text) as TopicConquestAnalysis;
            setAnalysisData(result);

        } catch (e) {
            console.error(e);
            setError("AI analysis failed. This could be due to a network issue or an API error. Please try again.");
            setAnalysisData(MOCK_TOPIC_CONQUEST_DATA); // Show mock data on error
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateBrief = async (topic: TopicOpportunity) => {
        setIsModalLoading(true);
        setIsModalOpen(true);
        setModalTitle(`AI Content Brief: "${topic.topic}"`);
        setModalContent(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are an AI Content Strategist. Create a detailed content brief for the topic: "${topic.topic}". The brief should include: a target audience, primary and secondary keywords, a suggested H1 title, a structured outline with H2 and H3 headings, key questions to answer, and a suggested content format (e.g., blog post, guide, tutorial). Format the output as a clean, well-structured HTML document using Tailwind CSS classes.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setModalContent(response.text);
        } catch(e) {
            console.error(e);
            setModalContent('<p class="text-red-400">Failed to generate brief. Please try again.</p>');
        } finally {
            setIsModalLoading(false);
        }
    };
    
    const handleGenerateRoadmap = async () => {
        if (!analysisData) return;
        setIsModalLoading(true);
        setIsModalOpen(true);
        setModalTitle(`AI-Generated Strategic Topic Roadmap`);
        setModalContent(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are an expert AI Content Strategist. Based on the following topic opportunities, create a prioritized 3-month strategic content roadmap. Group the topics by month, prioritizing high-impact, low-investment topics first. For each month, list the target topics and a brief strategic focus. Data: ${JSON.stringify(analysisData.topicOpportunities)}. Format the output as a clean, well-structured HTML document using Tailwind CSS classes.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setModalContent(response.text);
        } catch(e) {
            console.error(e);
            setModalContent('<p class="text-red-400">Failed to generate roadmap. Please try again.</p>');
        } finally {
            setIsModalLoading(false);
        }
    };

    const getScoreColor = (score: number) => score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-wider flex items-center gap-3">
                <i className="fas fa-crosshairs text-conquest-orange"></i> Topic Conquest Engine
            </h1>

            <Card title="Competitor Analysis Input">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="your-domain" className="block text-sm font-medium text-medium-text mb-1">Your Domain</label>
                        <input type="text" id="your-domain" value={yourDomain} onChange={e => setYourDomain(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                    <div>
                         <label htmlFor="competitor-1" className="block text-sm font-medium text-medium-text mb-1">Competitor 1</label>
                         <input type="text" id="competitor-1" value={competitors[0]} onChange={e => handleCompetitorChange(0, e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                     <div>
                         <label htmlFor="competitor-2" className="block text-sm font-medium text-medium-text mb-1">Competitor 2</label>
                         <input type="text" id="competitor-2" value={competitors[1]} onChange={e => handleCompetitorChange(1, e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                     <div>
                         <label htmlFor="competitor-3" className="block text-sm font-medium text-medium-text mb-1">Competitor 3</label>
                         <input type="text" id="competitor-3" value={competitors[2]} onChange={e => handleCompetitorChange(2, e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-conquest-orange text-white font-semibold py-3 px-6 rounded-md hover:bg-conquest-orange-dark transition-colors disabled:bg-conquest-orange/50 flex items-center justify-center gap-2">
                    {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Mining Opportunities...</> : <><i className="fas fa-search-plus"></i> Analyze & Find Gaps</>}
                </button>
            </Card>

            {isLoading && <LoadingPlaceholder message="AI is mining competitor data and identifying topic opportunities..." />}

            {!isLoading && !analysisData && <EmptyState />}

            {analysisData && (
                <>
                    <Card title="Topic Opportunity Feed">
                        <div className="overflow-x-auto">
                             <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b border-dark-border">
                                        <th className="p-3">Topic</th>
                                        <th className="p-3 text-center">Opp. Score</th>
                                        <th className="p-3 text-center">Your Coverage</th>
                                        <th className="p-3 text-center">AI Preference</th>
                                        <th className="p-3 text-center">Investment</th>
                                        <th className="p-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analysisData.topicOpportunities.map(topic => (
                                        <tr key={topic.id} className="border-b border-dark-border hover:bg-dark-border/30">
                                            <td className="p-3 font-semibold">{topic.topic}</td>
                                            <td className={`p-3 text-center font-bold text-lg ${getScoreColor(topic.opportunityScore)}`}>{topic.opportunityScore}</td>
                                            <td className="p-3 text-center"><span className={`px-2 py-1 text-xs rounded-full ${topic.yourCoverage === 'None' || topic.yourCoverage === 'Low' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{topic.yourCoverage}</span></td>
                                            <td className="p-3 text-center"><div className="w-full bg-dark-border rounded-full h-2"><div className="bg-conquest-orange h-2 rounded-full" style={{width: `${topic.aiPreference}%`}}></div></div></td>
                                            <td className="p-3 text-center">{topic.investment}</td>
                                            <td className="p-3 text-right">
                                                <button onClick={() => handleGenerateBrief(topic)} className="bg-brand-secondary text-white text-xs font-semibold py-1 px-3 rounded-md hover:bg-brand-secondary/80">Get Brief</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                         <div className="mt-6 text-center">
                            <button onClick={handleGenerateRoadmap} className="bg-brand-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-brand-primary/90 flex items-center justify-center gap-2 mx-auto">
                                <i className="fas fa-road"></i> Generate Strategic Roadmap
                            </button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="AI Niche Preferences">
                            <div className="flex flex-wrap gap-3">
                                {analysisData.aiNichePreferences.sort((a,b) => b.preference - a.preference).map(item => (
                                    <div key={item.topic} className="bg-dark-bg border border-dark-border rounded-lg p-3 text-sm font-semibold" style={{opacity: item.preference / 100}}>{item.topic}</div>
                                ))}
                            </div>
                        </Card>
                         <Card title="Content Depth Comparison">
                            <div className="space-y-4">
                                {analysisData.contentDepthComparison.map(item => (
                                    <div key={item.topic}>
                                        <h4 className="font-semibold mb-2">{item.topic}</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-28">Your Depth</span>
                                                <div className="w-full bg-dark-border rounded-full h-4"><div className="bg-brand-primary h-4 rounded-full text-right px-2 text-xs text-white" style={{width: `${item.yourDepth}%`}}>{item.yourDepth}</div></div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-28">Competitor A</span>
                                                <div className="w-full bg-dark-border rounded-full h-4"><div className="bg-red-500 h-4 rounded-full text-right px-2 text-xs text-white" style={{width: `${item.competitorADepth}%`}}>{item.competitorADepth}</div></div>
                                            </div>
                                             <div className="flex items-center gap-2">
                                                <span className="w-28">Competitor B</span>
                                                <div className="w-full bg-dark-border rounded-full h-4"><div className="bg-red-500/70 h-4 rounded-full text-right px-2 text-xs text-white" style={{width: `${item.competitorBDepth}%`}}>{item.competitorBDepth}</div></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </>
            )}
            
             <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} isLoading={isModalLoading} content={modalContent} />
        </div>
    );
};
