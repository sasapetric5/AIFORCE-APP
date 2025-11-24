import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import { MOCK_SCORECARD_DATA } from '../../constants/brandPowerScorecardData';
import type { BrandPowerScorecardData, BrandPowerScorecardHistoricalData } from '../../types';
import { ActionModal } from '../competitive_intelligence/ActionModal';

declare const Chart: any;

// --- SUB-COMPONENTS ---

const HistoricalTrendChart: React.FC<{ data: BrandPowerScorecardHistoricalData[] }> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (chartRef.current && typeof Chart !== 'undefined') {
            const ctx = chartRef.current.getContext('2d');
            const isDarkMode = document.documentElement.classList.contains('dark');
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const textColor = isDarkMode ? '#cbd5e1' : '#475569';

            if (chartInstance.current) chartInstance.current.destroy();

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => d.month),
                    datasets: [
                        {
                            label: 'Your Brand Score',
                            data: data.map(d => d.userScore),
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: '#8b5cf6'
                        },
                        {
                            label: 'Industry Average',
                            data: data.map(d => d.averageScore),
                            borderColor: '#64748b',
                            backgroundColor: 'rgba(100, 116, 139, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderDash: [5, 5],
                            pointRadius: 4,
                            pointBackgroundColor: '#64748b'
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: false, grid: { color: gridColor }, ticks: { color: textColor } },
                        x: { grid: { color: gridColor }, ticks: { color: textColor } }
                    },
                    plugins: { legend: { labels: { color: textColor } } }
                }
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data]);

    return <div className="h-80"><canvas ref={chartRef}></canvas></div>;
};


const BrandPowerSection: React.FC<{ data: BrandPowerScorecardData }> = ({ data }) => {
    const [mainScore, setMainScore] = useState(0);

    useEffect(() => {
        const targetScore = data.mainScore;
        let start = 0; // Always start from 0 for the animation effect
        const duration = 1500;
        let startTime: number | null = null;

        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentScore = start + (targetScore - start) * progress;
            setMainScore(Math.floor(currentScore));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [data.mainScore]);

    return (
        <section className="relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-6 text-white bg-gradient-to-br from-slate-900 to-slate-800 dark:from-brand-primary dark:to-brand-secondary">
            <div className="absolute top-0 right-0 w-72 h-72 bg-radial-gradient from-brand-secondary/30 to-transparent rounded-full z-0"></div>
            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h2 className="text-2xl font-bold">AI Brand Power Score</h2>
                    <div className={`mt-2 sm:mt-0 inline-flex items-center gap-2 px-3 py-1 ${data.scoreChange >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} text-sm rounded-full`}>
                        <i className={`fas ${data.scoreChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i> {Math.abs(data.scoreChange)} points this month
                    </div>
                </div>
                <div className="text-center mb-8">
                    <div className="text-7xl lg:text-8xl font-bold tracking-tighter bg-gradient-to-br from-brand-secondary to-purple-400 text-transparent bg-clip-text mb-2">{mainScore}</div>
                    <p className="text-lg text-purple-200/90 mb-2">Overall Brand Power</p>
                    <div className="inline-flex items-center gap-2 text-sm text-purple-200/80">
                        <i className="fas fa-chart-line"></i> Industry Average: {data.industryAverage}
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {data.components.map(comp => (
                        <div key={comp.label} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{comp.value}</div>
                            <div className="text-xs text-purple-200/80">{comp.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ScoreBreakdownSection: React.FC<{ data: BrandPowerScorecardData }> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (chartRef.current && typeof Chart !== 'undefined' && data) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const pointLabelColor = isDarkMode ? '#cbd5e1' : '#475569';
            const ticksColor = isDarkMode ? '#94a3b8' : '#64748b';

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: data.breakdownChartData.labels,
                    datasets: [{
                        label: 'Your Score',
                        data: data.breakdownChartData.userScores,
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        borderColor: '#8b5cf6',
                        pointBackgroundColor: '#8b5cf6',
                    }, {
                        label: 'Industry Average',
                        data: data.breakdownChartData.averageScores,
                        backgroundColor: 'rgba(100, 116, 139, 0.2)',
                        borderColor: '#64748b',
                        pointBackgroundColor: '#64748b',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: gridColor },
                            grid: { color: gridColor },
                            pointLabels: { color: pointLabelColor },
                            ticks: {
                                color: ticksColor,
                                backdropColor: 'transparent',
                                stepSize: 20
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: pointLabelColor }
                        }
                    }
                }
            });
        }
    }, [data]);

    return (
        <Card title="Score Breakdown & Analytics">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <div className="h-96 -mt-8 -mb-4"><canvas ref={chartRef}></canvas></div>
                </div>
                <div className="lg:col-span-2">
                    <h3 className="font-semibold mb-3">Platform-Specific Scores</h3>
                    <ul className="space-y-3">
                        {data.platformScores.map(p => (
                            <li key={p.name} className="flex items-center p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl mr-4" style={{ backgroundColor: p.color }}>
                                    <i className={`fab ${p.icon} fa-fw`}></i>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{p.name}</p>
                                    <p className="text-sm text-medium-text-light dark:text-medium-text">Score: {p.score}</p>
                                </div>
                                <span className={`text-sm font-semibold ${p.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{p.change >= 0 ? '+' : ''}{p.change}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
};

const CompetitivePositionSection: React.FC<{ data: BrandPowerScorecardData }> = ({ data }) => {
    return (
        <Card title="Competitive Position">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-brand-secondary/30 flex-shrink-0">#{data.marketPosition}</div>
                <div>
                    <h3 className="text-xl font-bold">Market Position</h3>
                    <p className="text-medium-text-light dark:text-medium-text">You're currently ranked #{data.marketPosition} in your industry category. You are closing in on the market leader.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.competitors.map(comp => (
                    <div key={comp.rank} className={`bg-light-bg dark:bg-dark-bg p-4 rounded-lg text-center ${comp.isUserBrand ? 'border-2 border-brand-secondary' : ''}`}>
                        <p className="text-2xl font-bold">#{comp.rank}</p>
                        <p>{comp.name}</p>
                        <p className="text-sm text-medium-text-light dark:text-medium-text">Score: {comp.score}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const AIStrategicInsights: React.FC<{ onGenerate: () => void; isLoading: boolean; }> = ({ onGenerate, isLoading }) => (
    <Card title="AI-Powered Strategic Insights">
        <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center text-white text-3xl mx-auto mb-4">
                <i className="fas fa-brain"></i>
            </div>
            <h3 className="text-xl font-bold">Unlock Actionable Strategies</h3>
            <p className="text-medium-text-light dark:text-medium-text max-w-2xl mx-auto my-4">Generate a comprehensive SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) based on your scorecard data to guide your next strategic moves.</p>
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="bg-brand-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-brand-primary/90 transition-all duration-300 disabled:bg-brand-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
                {isLoading ? (
                    <><i className="fas fa-spinner fa-spin"></i><span>Generating SWOT...</span></>
                ) : (
                    <><i className="fas fa-magic"></i><span>Generate SWOT Analysis</span></>
                )}
            </button>
        </div>
    </Card>
);


export const BrandPowerScorecard: React.FC = () => {
    const [brandName, setBrandName] = useState<string>('');
    const [scorecardData, setScorecardData] = useState<BrandPowerScorecardData | null>(MOCK_SCORECARD_DATA);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isSwotLoading, setIsSwotLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<string | null>(null);

    const handleAnalyzeBrand = async (e: FormEvent) => {
        e.preventDefault();
        if (!brandName.trim()) {
            setError("Please enter a brand name to analyze.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setScorecardData(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert AI Brand Power Analyst. For the brand "${brandName}", generate a complete, realistic but plausible Brand Power Scorecard.
                The brand is in the tech/SaaS industry.
                Generate data for its main score, a score change, 4 component scores, scores on 4 AI platforms (ChatGPT, Perplexity, Gemini, Claude), its market position (#2), and data for 3 of its main competitors.
                Generate historical data for the last 6 months for both the user's brand and the industry average.
                The JSON output must conform to the provided schema. Ensure all numeric values are numbers, not strings. The user's brand, "${brandName}", should be one of the competitors.
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            mainScore: { type: Type.NUMBER },
                            scoreChange: { type: Type.NUMBER },
                            industryAverage: { type: Type.NUMBER },
                            components: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, value: { type: Type.NUMBER } }, required: ['label', 'value'] } },
                            breakdownChartData: { type: Type.OBJECT, properties: { labels: { type: Type.ARRAY, items: { type: Type.STRING } }, userScores: { type: Type.ARRAY, items: { type: Type.NUMBER } }, averageScores: { type: Type.ARRAY, items: { type: Type.NUMBER } } }, required: ['labels', 'userScores', 'averageScores'] },
                            platformScores: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, change: { type: Type.NUMBER }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ['name', 'score', 'change', 'icon', 'color'] } },
                            marketPosition: { type: Type.NUMBER },
                            competitors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { rank: { type: Type.NUMBER }, name: { type: Type.STRING }, score: { type: Type.NUMBER }, isUserBrand: { type: Type.BOOLEAN } }, required: ['rank', 'name', 'score'] } },
                            historicalData: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { month: { type: Type.STRING }, userScore: { type: Type.NUMBER }, averageScore: { type: Type.NUMBER } }, required: ['month', 'userScore', 'averageScore'] } },
                        },
                        required: ['mainScore', 'scoreChange', 'industryAverage', 'components', 'breakdownChartData', 'platformScores', 'marketPosition', 'competitors', 'historicalData']
                    }
                }
            });

            const result = JSON.parse(response.text) as BrandPowerScorecardData;
            setScorecardData(result);
        } catch (e) {
            console.error(e);
            setError("The AI analysis failed. This could be due to a content policy or an issue with the request. Please try a different brand name.");
            setScorecardData(MOCK_SCORECARD_DATA);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateSWOT = async () => {
        if (!scorecardData) return;
        
        setIsSwotLoading(true);
        setIsModalOpen(true);
        setModalContent(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert business strategist. Based on the following Brand Power Scorecard data for "${brandName || 'this brand'}", generate a comprehensive SWOT analysis.
                Provide at least 3-4 bullet points for each category (Strengths, Weaknesses, Opportunities, Threats).
                The analysis should be insightful, actionable, and directly related to the provided data.

                Data:
                - Overall Score: ${scorecardData.mainScore} (vs Industry Avg: ${scorecardData.industryAverage})
                - Market Position: #${scorecardData.marketPosition}
                - Key Competitors: ${scorecardData.competitors.map(c => `${c.name} (Score: ${c.score})`).join(', ')}
                - Platform Scores: ${scorecardData.platformScores.map(p => `${p.name} (Score: ${p.score})`).join(', ')}
                - Component Scores: ${scorecardData.components.map(c => `${c.label}: ${c.value}`).join(', ')}

                Format the output as a clean, well-structured HTML document using Tailwind CSS classes. The main container should be a div with a 2x2 grid for the SWOT categories. Each category should have a title, an icon (using Font Awesome classes like 'fas fa-thumbs-up'), and an unordered list of points.
                IMPORTANT: Use Tailwind CSS classes to ensure visibility in both light and dark themes. For example, use 'text-dark-text dark:text-light-text' for paragraph text and 'text-dark-text dark:text-white font-semibold' for headings.
            `;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setModalContent(response.text);
        } catch(e) {
            console.error(e);
            setModalContent('<div class="text-red-400">Failed to generate SWOT analysis. Please try again.</div>');
        } finally {
            setIsSwotLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-wider flex items-center gap-3">
                <i className="fas fa-trophy text-brand-secondary"></i>
                Brand Power Scorecard
            </h1>
            
            <Card title="Analyze Your Brand's Power in the AI Ecosystem">
                <form onSubmit={handleAnalyzeBrand} className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-grow w-full">
                        <label htmlFor="brand-name" className="sr-only">Enter a brand name to analyze</label>
                        <input
                            id="brand-name"
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary placeholder-medium-text-light dark:placeholder-medium-text text-base"
                            placeholder="Enter a brand name (e.g., 'Notion', 'Figma')..."
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !brandName.trim()}
                        className="w-full sm:w-auto flex-shrink-0 bg-brand-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-brand-primary/90 transition-all duration-300 disabled:bg-brand-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <><i className="fas fa-spinner fa-spin"></i><span>Analyzing...</span></>
                        ) : 'Analyze Brand'}
                    </button>
                </form>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                 <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-lg p-3 mt-4 text-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    All data is AI-generated for illustrative purposes and does not reflect live market data.
                </div>
            </Card>

            {isLoading && (
                <div className="text-center py-16">
                    <i className="fas fa-spinner fa-spin text-4xl text-brand-secondary"></i>
                    <p className="mt-4 text-medium-text-light dark:text-medium-text">Generating scorecard for "{brandName}"...</p>
                </div>
            )}

            {!isLoading && scorecardData && (
                <>
                    <BrandPowerSection data={scorecardData} />
                    <Card title="Historical Performance Trend"><HistoricalTrendChart data={scorecardData.historicalData} /></Card>
                    <ScoreBreakdownSection data={scorecardData} />
                    <CompetitivePositionSection data={scorecardData} />
                    <AIStrategicInsights onGenerate={handleGenerateSWOT} isLoading={isSwotLoading} />
                </>
            )}
            
            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`AI-Generated SWOT Analysis for ${brandName || 'Your Brand'}`}
                isLoading={isSwotLoading}
                content={modalContent}
            />
        </div>
    );
};