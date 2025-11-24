import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card } from '../Card';

declare const Chart: any;

// --- ACTION MODAL SUB-COMPONENT ---
interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    isLoading: boolean;
    content: string | null;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, title, isLoading, content }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        if (content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textToCopy = tempDiv.textContent || tempDiv.innerText || '';
            navigator.clipboard.writeText(textToCopy.trim());
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{title}</h3>
                    <button onClick={onClose} className="text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text transition-colors" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {isLoading ? <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div><p className="mt-4 text-medium-text-light dark:text-medium-text">AI is crunching the numbers...</p></div> : <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content || '' }} />}
                </main>
                 <footer className="p-4 border-t border-light-border dark:border-dark-border flex-shrink-0 flex justify-end items-center gap-3">
                    <button
                        onClick={handleCopy}
                        disabled={!content || isLoading}
                        className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-200 dark:bg-dark-border text-dark-text dark:text-light-text hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                    >
                        {copySuccess ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- MODULE SECTIONS as LOCAL COMPONENTS ---

const VisibilityKpis: React.FC<{ onAnalyze: (context: any) => void; }> = ({ onAnalyze }) => {
    const [kpiData, setKpiData] = useState({
        citations: 1200,
        snippetRate: 42,
        credibility: 9.2,
        displaced: 18,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setKpiData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                    <label htmlFor="citations" className="block text-sm font-medium text-medium-text mb-1">Citation Frequency</label>
                    <input type="number" name="citations" id="citations" value={kpiData.citations} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                </div>
                 <div>
                    <label htmlFor="snippetRate" className="block text-sm font-medium text-medium-text mb-1">Answer Snippet Rate (%)</label>
                    <input type="number" name="snippetRate" id="snippetRate" value={kpiData.snippetRate} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                </div>
                 <div>
                    <label htmlFor="credibility" className="block text-sm font-medium text-medium-text mb-1">Source Credibility (/10)</label>
                    <input type="number" step="0.1" name="credibility" id="credibility" value={kpiData.credibility} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                </div>
                 <div>
                    <label htmlFor="displaced" className="block text-sm font-medium text-medium-text mb-1">Competitors Displaced</label>
                    <input type="number" name="displaced" id="displaced" value={kpiData.displaced} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                </div>
            </div>
             <button onClick={() => onAnalyze(kpiData)} className="w-full md:w-auto bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary/90 flex items-center justify-center gap-2 mx-auto">
                <i className="fas fa-brain"></i> Analyze KPIs with AI
            </button>
        </div>
    );
};

interface RoiEngineProps {
    onAnalyze: (context: any) => void;
}

const RoiEngine: React.FC<RoiEngineProps> = ({ onAnalyze }) => {
    const [roiBreakdown, setRoiBreakdown] = useState<Record<string, number>>({
        trafficValue: 18000,
        leadAttribution: 15000,
        cacReduction: 6500,
        brandAuthority: 3000,
    });

    const totalRoi = Object.values(roiBreakdown).reduce((a: number, b: number) => a + b, 0);

    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRoiBreakdown(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const data = [roiBreakdown.trafficValue, roiBreakdown.leadAttribution, roiBreakdown.cacReduction, roiBreakdown.brandAuthority];
            
            if (chartInstance.current) {
                chartInstance.current.data.datasets[0].data = data;
                chartInstance.current.update();
            } else {
                 chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Traffic Value', 'Lead Attribution', 'CAC Reduction', 'Brand Authority'],
                        datasets: [{
                            label: 'ROI Contribution',
                            data: data,
                            backgroundColor: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                        scales: { y: { ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } },
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }
        return () => {
             if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [roiBreakdown]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-light-bg dark:bg-dark-bg p-6 rounded-lg space-y-4">
                 <div>
                    <label htmlFor="trafficValue" className="block text-sm font-medium text-medium-text mb-1">Traffic Value Est. ($)</label>
                    <input type="number" name="trafficValue" id="trafficValue" value={roiBreakdown.trafficValue} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                </div>
                 <div>
                    <label htmlFor="leadAttribution" className="block text-sm font-medium text-medium-text mb-1">Lead Attribution ($)</label>
                    <input type="number" name="leadAttribution" id="leadAttribution" value={roiBreakdown.leadAttribution} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                </div>
                 <div>
                    <label htmlFor="cacReduction" className="block text-sm font-medium text-medium-text mb-1">CAC Reduction ($)</label>
                    <input type="number" name="cacReduction" id="cacReduction" value={roiBreakdown.cacReduction} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                </div>
                 <div>
                    <label htmlFor="brandAuthority" className="block text-sm font-medium text-medium-text mb-1">Brand Authority Value ($)</label>
                    <input type="number" name="brandAuthority" id="brandAuthority" value={roiBreakdown.brandAuthority} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                </div>
                <button onClick={() => onAnalyze(roiBreakdown)} className="w-full mt-2 bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary/90 flex items-center justify-center gap-2">
                    <i className="fas fa-brain"></i> Analyze ROI with AI
                </button>
            </div>
            <div className="lg:col-span-2 h-96 bg-light-bg dark:bg-dark-bg p-4 rounded-lg flex flex-col items-center">
                 <div className="text-6xl font-bold text-emerald-400">${totalRoi.toLocaleString()}</div>
                <div className="text-lg font-semibold text-medium-text-light dark:text-medium-text mt-2">Total Estimated ROI</div>
                <div className="flex-grow w-full mt-4"><canvas ref={chartRef}></canvas></div>
            </div>
        </div>
    );
};

interface PredictiveModelingProps {
    onRecommend: (context: any) => void;
    onGenerateScenarios: (context: any) => void;
}

const PredictiveModeling: React.FC<PredictiveModelingProps> = ({ onRecommend, onGenerateScenarios }) => {
    const [budget, setBudget] = useState({ content: 40, platform: 35, authority: 25 });
    const [scenarios, setScenarios] = useState([
        { icon: 'fa-rocket', title: 'Aggressive Growth', roi: '4.5x', description: 'Maximum investment in content and new platform expansion.' },
        { icon: 'fa-shield-alt', title: 'Defensive Stance', roi: '2.8x', description: 'Focus on protecting current rankings and authority.' },
        { icon: 'fa-balance-scale', title: 'Balanced Optimization', roi: '3.9x', description: 'Optimal mix of growth and protection based on current data.' },
    ]);
    const predictedRoi = (budget.content * 0.5 + budget.platform * 0.4 + budget.authority * 0.3).toFixed(1);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Investment Planning Tool</h4>
                <div className="space-y-4">
                    <div>
                        <label className="flex justify-between text-sm"><span>Content Creation</span> <strong>{budget.content}%</strong></label>
                        <input type="range" min="0" max="100" value={budget.content} onChange={e => setBudget(b => ({...b, content: +e.target.value}))} className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer range-thumb-emerald" />
                    </div>
                    <div>
                        <label className="flex justify-between text-sm"><span>Platform Optimization</span> <strong>{budget.platform}%</strong></label>
                        <input type="range" min="0" max="100" value={budget.platform} onChange={e => setBudget(b => ({...b, platform: +e.target.value}))} className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer range-thumb-emerald" />
                    </div>
                     <div>
                        <label className="flex justify-between text-sm"><span>Authority Building</span> <strong>{budget.authority}%</strong></label>
                        <input type="range" min="0" max="100" value={budget.authority} onChange={e => setBudget(b => ({...b, authority: +e.target.value}))} className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer range-thumb-emerald" />
                    </div>
                </div>
                <div className="mt-6 p-4 bg-light-card dark:bg-dark-card rounded-lg text-center">
                    <div className="text-3xl font-bold text-emerald-400">{predictedRoi}x</div>
                    <div className="text-sm font-semibold text-medium-text-light dark:text-medium-text">Predicted ROI</div>
                </div>
                 <button onClick={() => onRecommend(budget)} className="mt-4 w-full bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary/90 flex items-center justify-center gap-2">
                    <i className="fas fa-magic"></i> Get AI Budget Recommendations
                </button>
            </div>
             <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg flex flex-col">
                <h4 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Scenario Analysis</h4>
                <div className="space-y-3 flex-grow">
                    {scenarios.map(s => (
                        <div key={s.title} className="bg-light-card dark:bg-dark-card p-4 rounded-lg flex items-center">
                             <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mr-4"><i className={`fas ${s.icon}`}></i></div>
                             <div className="flex-grow">
                                 <h5 className="font-semibold text-dark-text dark:text-light-text">{s.title}</h5>
                                 <p className="text-xs text-medium-text-light dark:text-medium-text">{s.description}</p>
                             </div>
                             <div className="text-right">
                                 <div className="font-bold text-lg text-emerald-400">{s.roi}</div>
                                 <div className="text-xs text-medium-text-light dark:text-medium-text">Est. ROI</div>
                             </div>
                        </div>
                    ))}
                </div>
                 <button onClick={() => onGenerateScenarios(budget)} className="mt-4 w-full bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary/90 flex items-center justify-center gap-2">
                    <i className="fas fa-wand-magic-sparkles"></i> Generate Scenarios with AI
                </button>
            </div>
            <style>{`
                .range-thumb-emerald::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #10b981; cursor: pointer; border-radius: 50%;
                }
                .range-thumb-emerald::-moz-range-thumb {
                    width: 20px; height: 20px; background: #10b981; cursor: pointer; border-radius: 50%; border: none;
                }
            `}</style>
        </div>
    );
};


// --- MAIN COMPONENT ---

export const PerformanceAnalytics: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false);

    const handleAiAction = async (title: string, prompt: string, context: any) => {
        setModalTitle(`AI Assistant: ${title}`);
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setModalContent(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const fullPrompt = `${prompt}\n\nContextual Data:\n${JSON.stringify(context, null, 2)}\n\nFormat the response as clean, well-structured HTML using Tailwind CSS classes within a single div. Use headers (h4), paragraphs (p), and lists (ul/li).`
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
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
             <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4">
                    <i className="fas fa-sack-dollar text-emerald-400"></i> Performance Analytics & ROI
                </h1>
                <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">Demonstrate tangible value for C-suite and marketing budgets.</p>
            </div>
            
            <Card title="AI Visibility KPIs">
                 <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Enter your current metrics to get a personalized AI analysis.</p>
                <VisibilityKpis onAnalyze={(context) => handleAiAction('KPI Analysis', 'Analyze the provided Key Performance Indicators. Provide a C-suite level summary highlighting strengths, weaknesses, and a primary action item to improve these scores.', context)} />
            </Card>

            <Card title="ROI Calculation Engine">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Input your financial data to calculate and visualize your ROI. The chart will update automatically.</p>
                <RoiEngine onAnalyze={(context) => handleAiAction('ROI Analysis', 'Analyze the provided ROI data. Provide a C-suite level summary highlighting key wins, opportunities for growth, and areas of concern.', context)} />
            </Card>

            <Card title="Predictive ROI Modeling">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Use the sliders to model your investment strategy and generate AI-powered recommendations and scenarios.</p>
                <PredictiveModeling 
                    onRecommend={(context) => handleAiAction('Budget Recommendations', 'Based on the user\'s budget allocation, analyze the predicted ROI. Provide 3-5 actionable recommendations to optimize their budget for a higher return.', context)}
                    onGenerateScenarios={(context) => handleAiAction('Scenario Generation', 'Based on the user\'s budget allocation, generate three distinct scenarios (e.g., Aggressive, Balanced, Conservative) with predicted outcomes and potential risks.', context)}
                />
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