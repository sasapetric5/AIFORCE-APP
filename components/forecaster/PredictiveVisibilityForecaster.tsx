import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import { FORECASTER_DATA } from '../../constants/forecasterData';
import type { ForecasterData, ProactiveAlertData, ScenarioData, Notification } from '../../types';

declare const Chart: any;

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
                    {isLoading ? <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div><p className="mt-4 text-medium-text-light dark:text-medium-text">AI is working its magic...</p></div> : <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content || '' }} />}
                </main>
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
        <div className="slide-in-right bg-gradient-to-r from-violet-500 to-sky-500 text-white py-3 px-5 rounded-lg shadow-2xl border-l-4 border-teal-400">
            <div className="flex items-center gap-2">
                <i className="fas fa-crystal-ball"></i>
                <span>{message}</span>
            </div>
        </div>
    );
};

export const PredictiveVisibilityForecaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Forecast');
    const [activeTimeframe, setActiveTimeframe] = useState('30 Days');
    const [data, setData] = useState<ForecasterData>(FORECASTER_DATA);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [analysisInput, setAnalysisInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const showNotification = (message: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
    };

    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const isDarkMode = document.documentElement.classList.contains('dark');
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const textColor = isDarkMode ? '#cbd5e1' : '#475569';
            
            if (chartInstance.current) chartInstance.current.destroy();

            chartInstance.current = new Chart(ctx, {
                 type: 'line',
                data: {
                    labels: ['Now', '7 Days', '14 Days', '21 Days', '30 Days', '45 Days', '60 Days'],
                    datasets: [
                        { label: 'Historical Data', data: [78, 80, 82, null, null, null, null], borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderWidth: 3, tension: 0.4, fill: true },
                        { label: 'Predicted Growth', data: [null, null, 82, 84, 85, 87, 88], borderColor: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)', borderWidth: 3, borderDash: [5, 5], tension: 0.4, fill: true },
                        { label: 'Confidence Range', data: [null, null, [81, 83], [83, 85], [84, 86], [86, 88], [87, 89]], borderColor: 'rgba(14, 165, 233, 0)', backgroundColor: 'rgba(14, 165, 233, 0.1)', borderWidth: 1, tension: 0.4, fill: true }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { color: textColor } } },
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { color: textColor } },
                        y: { grid: { color: gridColor }, ticks: { color: textColor }, beginAtZero: false, title: { display: true, text: 'Brand Power Score', color: textColor } }
                    }
                }
            });
        }
    }, []);

    const handleGenerateForecast = async (e: FormEvent) => {
        e.preventDefault();
        if (!analysisInput.trim()) {
            setError("Please enter a brand, URL, or app name to generate a forecast.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        showNotification(`Generating new forecast for ${analysisInput}...`);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert AI Visibility Forecaster for a SaaS platform called "AI FORCE". Your task is to analyze the provided input (which can be a URL, an app name, or a brand name) and generate a complete, realistic but plausible set of predictive data in a single JSON object.

                Input to analyze: "${analysisInput}"

                The JSON output must conform to the structure defined in the response schema. Generate plausible data for all fields.

                - For overviewCards (4 items): Generate metrics for visibility growth, a target score, market position, and ROI.
                - For predictionConfidence (4 items): Generate confidence percentages for platforms like ChatGPT, Gemini, Perplexity, and overall market position.
                - For alerts (3 items): Create one critical, one opportunity, and one warning alert.
                - For scenarios (3 items): Create scenarios for aggressive growth, a balanced approach, and risk mitigation, with corresponding metrics.
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            overviewCards: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, label: { type: Type.STRING }, trend: { type: Type.STRING }, trendDirection: { type: Type.STRING, enum: ['up', 'down'] } }, required: ['value', 'label', 'trend', 'trendDirection'] } },
                            predictionConfidence: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, confidence: { type: Type.NUMBER }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ['platform', 'confidence', 'icon', 'color'] } },
                            alerts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING, enum: ['critical', 'opportunity', 'warning'] }, icon: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['type', 'icon', 'title', 'description'] } },
                            scenarios: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, icon: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, metrics: { type: Type.OBJECT, properties: { visibility: { type: Type.STRING }, eta: { type: Type.STRING }, roi: { type: Type.STRING } }, required: ['visibility', 'eta', 'roi'] } }, required: ['id', 'icon', 'title', 'description', 'metrics'] } },
                        },
                        required: ['overviewCards', 'predictionConfidence', 'alerts', 'scenarios']
                    }
                }
            });

            const result = JSON.parse(response.text) as ForecasterData;
            setData(result);
            showNotification(`Forecast for ${analysisInput} generated successfully!`);
        } catch (e) {
            console.error(e);
            setError("The AI forecast failed. This could be due to a content policy or an issue with the request. Please try a different input.");
            showNotification("Error: Failed to generate forecast.");
            setData(FORECASTER_DATA); // Revert to mock data on failure
        } finally {
            setIsAnalyzing(false);
        }
    };


    const handleAiAction = async (title: string, prompt: string) => {
        setModalTitle(`AI Assistant: ${title}`);
        setIsModalOpen(true);
        setIsLoadingModal(true);
        setModalContent(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Format the response as clean, well-structured HTML using Tailwind CSS classes within a single div. Use headers (h4), paragraphs (p), and lists (ul/li). Use classes like 'bg-dark-bg p-4 rounded-lg', 'text-light-text', 'font-bold', 'list-disc', 'ml-6'.\n\nPROMPT: ${prompt}` });
            setModalContent(response.text);
        } catch (e) {
            console.error(e);
            setModalContent('<p class="text-red-400">An error occurred. Please try again.</p>');
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleAlertAction = (alert: ProactiveAlertData) => {
        handleAiAction(`Mitigate: ${alert.title}`, `You are an AI risk mitigation strategist. For the alert "${alert.title}" with description "${alert.description}", generate a prioritized, step-by-step action plan to mitigate the risk or exploit the opportunity.`);
    };
    
    const handleScenarioAction = (scenario: ScenarioData) => {
        handleAiAction(`Simulate: ${scenario.title}`, `You are an AI business simulation engine. A user wants to simulate the "${scenario.title}" scenario. Based on its description "${scenario.description}", generate a detailed outcome report. Include predicted visibility score changes, an updated ETA to reach the #1 market position, a projected ROI, a list of key initiatives, and potential risks.`);
    };

    const alertConfig = {
        critical: { border: 'border-red-500', iconBg: 'bg-red-500', text: 'text-red-400' },
        opportunity: { border: 'border-green-500', iconBg: 'bg-green-500', text: 'text-green-400' },
        warning: { border: 'border-yellow-500', iconBg: 'bg-yellow-500', text: 'text-yellow-400' },
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
                    <i className="fas fa-crystal-ball text-violet-400"></i> Predictive Visibility Forecaster
                </h1>
                <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">Leverage AI to see the future of your AI visibility.</p>
            </div>

            <Card title="Generate a New Forecast">
                <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Enter a brand name, URL, or app to generate a personalized forecast.</p>
                <form onSubmit={handleGenerateForecast} className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-grow w-full">
                        <label htmlFor="forecast-input" className="sr-only">Enter a brand name, URL, or app to analyze</label>
                        <input
                            id="forecast-input"
                            type="text"
                            value={analysisInput}
                            onChange={(e) => setAnalysisInput(e.target.value)}
                            className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-violet-500 focus:border-violet-500 placeholder-medium-text-light dark:placeholder-medium-text text-base"
                            placeholder="e.g., 'Notion', 'figma.com', 'Slack for iOS'..."
                            disabled={isAnalyzing}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isAnalyzing || !analysisInput.trim()}
                        className="w-full sm:w-auto flex-shrink-0 bg-violet-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-violet-600 transition-all duration-300 disabled:bg-violet-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? (
                            <><i className="fas fa-spinner fa-spin"></i><span>Generating...</span></>
                        ) : 'Generate Forecast'}
                    </button>
                </form>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                <div className="bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs rounded-lg p-3 mt-4 text-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    <strong>Please note:</strong> All data is AI-generated for illustrative purposes and does not reflect live market data.
                </div>
            </Card>
            
            <nav className="bg-light-card/80 dark:bg-slate-900/60 backdrop-blur-xl border border-light-border dark:border-white/10 rounded-lg p-1 flex items-center">
                {['Forecast', 'Predictions', 'Scenarios', 'Insights'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 relative ${activeTab === tab ? 'text-dark-text dark:text-white' : 'text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-white'}`}>
                        {activeTab === tab && <span className="absolute inset-0 bg-slate-200 dark:bg-slate-700/50 rounded-md z-0"></span>}
                        <span className="relative z-10">{tab}</span>
                    </button>
                ))}
            </nav>

            <Card title="AI Visibility Forecast">
                <div className="flex flex-col md:flex-row justify-between items-center -mt-4 mb-6 gap-4">
                    <p className="text-medium-text-light dark:text-medium-text">Your projected performance based on current data and market trends.</p>
                     <div className="bg-light-bg dark:bg-dark-bg p-1 rounded-lg flex items-center self-start md:self-center">
                        {['30 Days', '60 Days', '90 Days'].map(tf => (
                            <button key={tf} onClick={() => { setActiveTimeframe(tf); showNotification(`Forecast updated for ${tf}`); }} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTimeframe === tf ? 'bg-violet-500 text-white' : 'text-medium-text-light dark:text-medium-text'}`}>
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.overviewCards.map(card => (
                        <div key={card.label} className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg text-center border-b-4 border-violet-500">
                            <div className={`text-4xl font-bold ${card.trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}`}>{card.value}</div>
                            <p className="text-medium-text-light dark:text-medium-text mt-2">{card.label}</p>
                            <p className="text-xs text-medium-text-light dark:text-medium-text mt-1">{card.trend}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Predictive Analytics & Trends">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-80"><canvas ref={chartRef}></canvas></div>
                    <div className="space-y-3">
                        <h3 className="font-semibold text-dark-text dark:text-light-text">Prediction Confidence</h3>
                        {data.predictionConfidence.map(p => (
                            <div key={p.platform} className="flex items-center bg-light-bg dark:bg-dark-bg p-3 rounded-lg">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg mr-4" style={{backgroundColor: p.color}}><i className={p.icon}></i></div>
                                <div className="flex-grow"><p className="font-semibold">{p.platform}</p></div>
                                <div className="text-sm font-bold text-medium-text-light dark:text-medium-text">{p.confidence}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card title="Proactive Alert System">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.alerts.map(alert => (
                        <div key={alert.title} className={`bg-light-bg dark:bg-dark-bg p-6 rounded-lg border-l-4 ${alertConfig[alert.type].border}`}>
                            <div className="flex items-center mb-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl mr-4 ${alertConfig[alert.type].iconBg}`}><i className={alert.icon}></i></div>
                                <h3 className={`font-semibold text-lg ${alertConfig[alert.type].text}`}>{alert.title}</h3>
                            </div>
                            <p className="text-sm text-medium-text-light dark:text-medium-text mb-4">{alert.description}</p>
                            <button onClick={() => handleAlertAction(alert)} className={`w-full font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${alertConfig[alert.type].iconBg} text-white hover:opacity-90`}>
                                Get AI Action Plan
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Scenario Planning & Simulation">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.scenarios.map(scenario => (
                        <div key={scenario.title} className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg flex flex-col border-t-4 border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xl mr-4"><i className={scenario.icon}></i></div>
                                <h3 className="font-semibold text-lg">{scenario.title}</h3>
                            </div>
                            <p className="text-sm text-medium-text-light dark:text-medium-text mb-4 flex-grow">{scenario.description}</p>
                            <div className="grid grid-cols-3 gap-2 text-center my-2">
                                <div className="bg-light-card dark:bg-dark-card p-2 rounded"><div className="font-bold text-lg text-green-400">{scenario.metrics.visibility}</div><div className="text-xs text-medium-text-light dark:text-medium-text">Visibility</div></div>
                                <div className="bg-light-card dark:bg-dark-card p-2 rounded"><div className="font-bold text-lg">{scenario.metrics.eta}</div><div className="text-xs text-medium-text-light dark:text-medium-text">#1 ETA</div></div>
                                <div className="bg-light-card dark:bg-dark-card p-2 rounded"><div className="font-bold text-lg">{scenario.metrics.roi}</div><div className="text-xs text-medium-text-light dark:text-medium-text">ROI</div></div>
                            </div>
                            <button onClick={() => handleScenarioAction(scenario)} className="w-full mt-4 bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 transition-colors">
                                Simulate Scenario
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
            
            <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} isLoading={isLoadingModal} content={modalContent} />
            
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