import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import type { GlobalGeoAnalysisResult, RegionalAiOptimizationResult, CulturalAdaptationResult, TranslationLocalizationResult, RegulatoryComplianceChecklistItem } from '../../types';

// --- SUB-COMPONENTS ---

const DiffViewer: React.FC<{ original: string; rewritten: string }> = ({ original, rewritten }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(rewritten);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 font-mono text-sm">
            <div>
                <h5 className="font-semibold mb-2 text-medium-text">Original Text</h5>
                <div className="bg-slate-950 border border-dark-border rounded-md p-4 h-48 overflow-y-auto whitespace-pre-wrap">
                    {original}
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-green-400">Optimized Version</h5>
                    <button onClick={handleCopy} className="text-xs bg-dark-border text-medium-text py-1 px-2 rounded hover:bg-slate-600 transition-colors font-sans">
                        {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-md p-4 h-48 overflow-y-auto whitespace-pre-wrap">
                    {rewritten}
                </div>
            </div>
        </div>
    );
};


const ScoreGauge: React.FC<{ score: number; label: string; color: string; }> = ({ score, label, color }) => {
    const circumference = 2 * Math.PI * 28; // 2 * pi * r
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 64 64">
                <circle className="text-light-border dark:text-dark-border" strokeWidth="6" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
                <circle
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                    stroke={color}
                    fill="transparent"
                    r="28" cx="32" cy="32"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold" style={{ color }}>{score}</span>
                <span className="text-xs text-medium-text-light dark:text-medium-text mt-1 max-w-[80px]">{label}</span>
            </div>
        </div>
    );
};

const LoadingState: React.FC = () => (
    <Card title="Analyzing Global Readiness">
        <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-light-text mb-4">AI Is Analyzing Your Content...</h2>
            <p className="text-medium-text max-w-2xl mx-auto">
                This may take a moment. Our AI is evaluating cultural context, regional AI model compatibility, translation quality, and regulatory signals.
            </p>
        </div>
    </Card>
);

const AnalysisResults: React.FC<{ result: GlobalGeoAnalysisResult }> = ({ result }) => {
    const [activeTab, setActiveTab] = useState('regional');
    const { regionalAiOptimization, culturalAdaptation, translationLocalization, regulatoryCompliance } = result;

    const complianceStatusClasses: Record<string, string> = {
        'PASS': 'bg-green-500/20 text-green-300',
        'WARNING': 'bg-yellow-500/20 text-yellow-300',
        'FAIL': 'bg-red-500/20 text-red-300',
        'N/A': 'bg-gray-500/20 text-gray-400'
    };
    
    const riskClasses: Record<string, string> = {
        'Low': 'text-green-400',
        'Medium': 'text-yellow-400',
        'High': 'text-red-400',
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'regional':
                return (
                    <div className="animate-fade-in">
                        <h4 className="text-xl font-semibold mb-4 text-sky-400">{regionalAiOptimization.modelName} Compatibility</h4>
                        <p className="mb-6 text-medium-text">{regionalAiOptimization.analysis}</p>
                        <h5 className="font-semibold mb-3">Optimization Suggestions:</h5>
                        <ul className="space-y-3">
                            {regionalAiOptimization.suggestions.map((s, i) => <li key={i} className="flex items-start bg-dark-border/30 p-3 rounded-md"><span className="text-sky-400 mr-3 mt-1">›</span>{s}</li>)}
                        </ul>
                    </div>
                );
            case 'cultural':
                 return (
                    <div className="animate-fade-in">
                        <h4 className="text-xl font-semibold mb-4 text-sky-400">Cultural Context Adaptation</h4>
                        <p className="mb-6 text-medium-text">{culturalAdaptation.analysis}</p>
                        <h5 className="font-semibold mb-3">Adaptation Suggestions:</h5>
                        <ul className="space-y-3">
                            {culturalAdaptation.suggestions.map((s, i) => <li key={i} className="flex items-start bg-dark-border/30 p-3 rounded-md"><span className="text-sky-400 mr-3 mt-1">›</span>{s}</li>)}
                        </ul>
                    </div>
                );
            case 'translation':
                 return (
                    <div className="animate-fade-in">
                        <h4 className="text-xl font-semibold mb-4 text-sky-400">Translation & Localization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="font-semibold mb-2">AI-Generated Translation:</h5>
                                <p className="bg-dark-border/30 p-4 rounded-md text-sm italic">{translationLocalization.suggestedTranslation}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold mb-2">Localization Notes:</h5>
                                <ul className="space-y-2">
                                    {translationLocalization.localizationNotes.map((note, i) => <li key={i} className="flex items-start text-sm"><span className="text-sky-400 mr-2 mt-1">»</span>{note}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 'compliance':
                 return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-semibold text-sky-400">Regulatory Compliance Overview</h4>
                            <p className="text-lg">Overall Risk: <span className={`font-bold ${riskClasses[regulatoryCompliance.complianceRisk]}`}>{regulatoryCompliance.complianceRisk}</span></p>
                        </div>
                        <div className="space-y-3">
                            {regulatoryCompliance.checklist.map(item => (
                                <div key={item.area} className="bg-dark-border/30 p-3 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-semibold">{item.area}</h5>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${complianceStatusClasses[item.status]}`}>{item.status}</span>
                                    </div>
                                    <p className="text-sm text-medium-text mt-1">{item.notes}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    const tabs = [
        { id: 'regional', label: 'Regional AI', icon: 'fa-robot' },
        { id: 'cultural', label: 'Cultural Fit', icon: 'fa-handshake' },
        { id: 'translation', label: 'Translation', icon: 'fa-language' },
        { id: 'compliance', label: 'Compliance', icon: 'fa-balance-scale' },
    ];
    
    return (
        <Card title="Global Readiness Report">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 flex flex-col items-center justify-around bg-dark-bg p-4 rounded-lg">
                     <ScoreGauge score={regionalAiOptimization.compatibilityScore} label="AI Compatibility" color="#0ea5e9" />
                     <ScoreGauge score={culturalAdaptation.culturalFitScore} label="Cultural Fit" color="#8b5cf6" />
                     <ScoreGauge score={translationLocalization.qualityScore} label="Translation Quality" color="#10b981" />
                </div>
                <div className="lg:col-span-3">
                    <div className="border-b border-dark-border mb-4 flex space-x-2">
                        {tabs.map(tab => (
                             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-sky-500 text-sky-400' : 'border-transparent text-medium-text hover:text-light-text'}`}>
                                <i className={`fas ${tab.icon}`}></i> {tab.label}
                            </button>
                        ))}
                    </div>
                    <div>{renderTabContent()}</div>
                </div>
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out; }`}</style>
        </Card>
    );
};


export const GlobalExpansionEngine: React.FC = () => {
    const [sourceText, setSourceText] = useState('Our new SaaS platform leverages cutting-edge AI to revolutionize SEO. We guarantee top rankings and a massive ROI for all our clients.');
    const [targetRegion, setTargetRegion] = useState('China');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<GlobalGeoAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [isRewriting, setIsRewriting] = useState(false);
    const [rewrittenText, setRewrittenText] = useState<string | null>(null);
    const [rewriteError, setRewriteError] = useState<string | null>(null);


    const handleAnalyze = async () => {
        if (!sourceText.trim()) {
            setError("Please enter some content to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setRewrittenText(null);
        setRewriteError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert in Global Generative Engine Optimization (GEO) for a SaaS platform called "AI FORCE". Analyze the provided text for global readiness for the target region.

                Source Text: "${sourceText}"
                Target Region: "${targetRegion}"

                Provide a comprehensive analysis in a single JSON object. Generate realistic but plausible data for all scores and suggestions. The JSON output must conform to the provided schema.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            regionalAiOptimization: { type: Type.OBJECT, properties: { modelName: { type: Type.STRING }, compatibilityScore: { type: Type.NUMBER }, analysis: { type: Type.STRING }, suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['modelName', 'compatibilityScore', 'analysis', 'suggestions'] },
                            culturalAdaptation: { type: Type.OBJECT, properties: { culturalFitScore: { type: Type.NUMBER }, analysis: { type: Type.STRING }, suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['culturalFitScore', 'analysis', 'suggestions'] },
                            translationLocalization: { type: Type.OBJECT, properties: { qualityScore: { type: Type.NUMBER }, suggestedTranslation: { type: Type.STRING }, localizationNotes: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['qualityScore', 'suggestedTranslation', 'localizationNotes'] },
                            regulatoryCompliance: { type: Type.OBJECT, properties: { complianceRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }, checklist: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { area: { type: Type.STRING }, status: { type: Type.STRING, enum: ['PASS', 'WARNING', 'FAIL', 'N/A'] }, notes: { type: Type.STRING } }, required: ['area', 'status', 'notes'] } } }, required: ['complianceRisk', 'checklist'] }
                        },
                        required: ['regionalAiOptimization', 'culturalAdaptation', 'translationLocalization', 'regulatoryCompliance']
                    }
                }
            });
            setAnalysisResult(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setError("AI analysis failed. This could be due to a network issue or an API error. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRewrite = async () => {
        if (!analysisResult) return;

        setIsRewriting(true);
        setRewriteError(null);
        setRewrittenText(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert in Global Generative Engine Optimization (GEO). Your task is to rewrite the 'Original Text' to be perfectly optimized for the '${targetRegion}'.
                Use the provided 'Analysis Insights' to guide your rewrite. You must incorporate the suggestions for cultural adaptation, regional AI model compatibility, and localization.

                **Original Text:**
                "${sourceText}"

                **Analysis Insights:**
                - Regional AI Model (${analysisResult.regionalAiOptimization.modelName}): ${analysisResult.regionalAiOptimization.suggestions.join('. ')}
                - Cultural Adaptation: ${analysisResult.culturalAdaptation.suggestions.join('. ')}
                - Localization Notes: ${analysisResult.translationLocalization.localizationNotes.join('. ')}
                - Suggested Translation for reference: ${analysisResult.translationLocalization.suggestedTranslation}

                **Your Task:**
                Generate ONLY the rewritten, optimized text in the target language suggested by the translation. Do not add any explanation, titles, or markdown. Just the raw text output.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setRewrittenText(response.text);

        } catch (e) {
            console.error(e);
            setRewriteError("AI rewrite failed. This could be due to a network issue or an API error. Please try again.");
        } finally {
            setIsRewriting(false);
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-wider flex items-center gap-3">
                <i className="fas fa-globe-americas text-sky-400"></i> Global Expansion Engine
            </h1>
            
            <Card title="Analyze Content for Global Readiness">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="source-text" className="block text-sm font-medium text-medium-text mb-1">Content to Analyze</label>
                        <textarea
                            id="source-text"
                            value={sourceText}
                            onChange={e => setSourceText(e.target.value)}
                            rows={6}
                            className="w-full bg-dark-bg border border-dark-border rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="target-region" className="block text-sm font-medium text-medium-text mb-1">Target Region</label>
                        <select id="target-region" value={targetRegion} onChange={e => setTargetRegion(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md p-2 mb-4">
                            <option value="Brazil">Brazil (Local Models)</option>
                            <option value="China">China (Baidu ERNIE)</option>
                            <option value="France">France (Local Models)</option>
                            <option value="Germany">Germany (Local Models)</option>
                            <option value="Italy">Italy (Local Models)</option>
                            <option value="Japan">Japan (Local Models)</option>
                            <option value="Russia">Russia (YandexGPT)</option>
                            <option value="Serbia">Serbia (Local Models)</option>
                            <option value="South Korea">South Korea (Naver CLOVA)</option>
                            <option value="Spain">Spain (Local Models)</option>
                        </select>
                        <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-sky-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-sky-700 transition-colors disabled:bg-sky-600/50 flex items-center justify-center gap-2">
                            {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Analyzing...</> : <><i className="fas fa-search-plus"></i> Analyze Readiness</>}
                        </button>
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </Card>

            <Card title="AI Geo-Rewrite">
                <p className="text-medium-text -mt-4 mb-6">Automatically rewrite your content for the target market based on the AI analysis.</p>

                {!analysisResult && !isLoading && (
                    <div className="text-center bg-dark-border/20 border border-dark-border rounded-lg p-6 my-4">
                        <p className="text-medium-text"><i className="fas fa-info-circle mr-2"></i>Please run an analysis first to enable the AI Geo-Rewrite feature.</p>
                    </div>
                )}

                <div className="text-center">
                    <button onClick={handleRewrite} disabled={!analysisResult || isRewriting} className="bg-brand-secondary text-white font-semibold py-3 px-6 rounded-md hover:bg-brand-secondary/90 transition-colors disabled:bg-brand-secondary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto">
                       {isRewriting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Generating Optimized Version...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-magic"></i>
                                <span>Generate Optimized Version with AI</span>
                            </>
                        )}
                    </button>
                </div>
                {rewriteError && <p className="text-red-400 text-sm text-center mt-4">{rewriteError}</p>}
                {rewrittenText && <DiffViewer original={sourceText} rewritten={rewrittenText} />}
            </Card>

            {isLoading && <LoadingState />}
            {analysisResult && <AnalysisResults result={analysisResult} />}

        </div>
    );
};