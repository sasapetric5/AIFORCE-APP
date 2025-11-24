import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ANALYZER_DATA } from '../../constants/analyzerData';
import type { AnalyzerPlatform, CitationData, Competitor, AnalyzerContent, Insight, AnalyzerData } from '../../types';
import { Card } from '../Card';
import { LineChart, BarChart, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisInput } from '../analysis/AnalysisInput';

interface AiVisibilityAnalyzerProps {
    data?: AnalyzerData;
    onAnalyze: (url: string) => void;
    isLoading: boolean;
}

const platformColors: Record<string, { border: string; bg: string; chart: string; }> = {
    chatgpt: { border: 'border-teal-500', bg: 'bg-teal-500/10', chart: '#14B8A6' },
    perplexity: { border: 'border-purple-500', bg: 'bg-purple-500/10', chart: '#A855F7' },
    gemini: { border: 'border-blue-500', bg: 'bg-blue-500/10', chart: '#3B82F6' },
    claude: { border: 'border-orange-500', bg: 'bg-orange-500/10', chart: '#F97316' },
    copilot: { border: 'border-cyan-500', bg: 'bg-cyan-500/10', chart: '#06B6D4' },
    deepseek: { border: 'border-gray-400', bg: 'bg-gray-400/10', chart: '#9CA3AF' },
    mistral: { border: 'border-rose-500', bg: 'bg-rose-500/10', chart: '#F43F5E' },
    llama: { border: 'border-yellow-500', bg: 'bg-yellow-500/10', chart: '#EAB308' },
    poe: { border: 'border-indigo-500', bg: 'bg-indigo-500/10', chart: '#6366F1' },
};

const TrendArrow: React.FC<{ trend: 'up' | 'stable' | 'down' }> = ({ trend }) => {
    if (trend === 'up') return <span className="text-green-400">▲ Up</span>;
    if (trend === 'down') return <span className="text-red-400">▼ Down</span>;
    return <span className="text-medium-text">● Stable</span>;
};

const AnalyzerHeader: React.FC = () => (
    <div className="bg-gradient-to-r from-gray-800 via-slate-800 to-slate-900 text-white p-6 text-center rounded-xl">
        <h1 className="text-4xl font-bold tracking-wider">AI Visibility Analyzer</h1>
        <p className="text-lg text-medium-text tracking-wide mt-2">Deep analysis of your content's performance across all AI platforms.</p>
    </div>
);

const PlatformComparison: React.FC<{ platforms: AnalyzerPlatform[] }> = ({ platforms }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-4">
        {platforms.map(p => (
            <div key={p.id} className={`p-4 rounded-lg border-l-4 ${platformColors[p.id]?.border || 'border-gray-500'} ${platformColors[p.id]?.bg || 'bg-gray-500/10'}`}>
                <div className="flex justify-between items-start">
                    <div className="font-bold text-light-text flex items-center gap-2">
                        <span className="text-2xl">{p.icon}</span> {p.name}
                    </div>
                    <span className="text-xs font-semibold"><TrendArrow trend={p.trend} /></span>
                </div>
                <div className="text-4xl font-bold my-3">{p.score}</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-medium-text">
                    <div className="text-center p-2 bg-dark-bg/50 rounded">
                        <div className="font-bold text-light-text text-base">{p.citations}</div>
                        <div>Citations</div>
                    </div>
                    <div className="text-center p-2 bg-dark-bg/50 rounded">
                        <div className={`font-bold text-base ${p.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>{p.growth > 0 ? '+' : ''}{p.growth}%</div>
                        <div>Growth</div>
                    </div>
                    <div className="text-center p-2 bg-dark-bg/50 rounded">
                        <div className="font-bold text-light-text text-base">{p.metrics.answer_appearance}%</div>
                        <div>Answer Rate</div>
                    </div>
                    <div className="text-center p-2 bg-dark-bg/50 rounded">
                        <div className="font-bold text-light-text text-base">{p.metrics.citation_quality}</div>
                        <div>Quality</div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const CitationAnalysis: React.FC<{ citations: CitationData }> = ({ citations }) => {
    const chartData = citations.trend.map((value, index) => ({ name: `Day ${index + 1}`, Citations: value }));
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }} labelStyle={{ color: '#E2E8F0' }} />
                        <Line type="monotone" dataKey="Citations" stroke="#4F46E5" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-4">
                <div className="bg-dark-border/50 p-4 rounded-lg text-center"><div className="text-3xl font-bold text-brand-primary">{citations.total}</div><div className="text-sm text-medium-text">Total Citations</div></div>
                <div className="bg-dark-border/50 p-4 rounded-lg text-center"><div className="text-3xl font-bold text-brand-secondary">{citations.average.toFixed(1)}</div><div className="text-sm text-medium-text">Avg per Platform</div></div>
                <div className="bg-dark-border/50 p-4 rounded-lg text-center"><div className="text-3xl font-bold text-green-400">+{citations.growth}%</div><div className="text-sm text-medium-text">Growth (30d)</div></div>
            </div>
        </div>
    );
};

const ScoreBar: React.FC<{ score: number, colorClass: string }> = ({ score, colorClass }) => (
    <div className="flex items-center gap-2">
        <div className="w-24 bg-dark-border rounded-full h-2"><div className={`${colorClass} h-2 rounded-full`} style={{ width: `${score}%` }}></div></div>
        <span className="font-semibold w-8 text-right">{score}</span>
    </div>
);

const CompetitorBenchmarking: React.FC<{ competitors: Competitor[] }> = ({ competitors }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-medium-text uppercase">
                <tr>
                    <th className="px-4 py-3">Competitor</th>
                    <th className="px-4 py-3">Overall</th>
                    <th className="px-4 py-3">ChatGPT</th>
                    <th className="px-4 py-3">Perplexity</th>
                    <th className="px-4 py-3">Gemini</th>
                    <th className="px-4 py-3">Claude</th>
                    <th className="px-4 py-3">Copilot</th>
                    <th className="px-4 py-3">DeepSeek</th>
                    <th className="px-4 py-3">Mistral</th>
                    <th className="px-4 py-3">Llama</th>
                    <th className="px-4 py-3">Poe</th>
                </tr>
            </thead>
            <tbody>
                {competitors.map(c => (
                    <tr key={c.name} className="border-b border-dark-border hover:bg-dark-border/50">
                        <td className="px-4 py-3 font-medium text-light-text">{c.name}</td>
                        <td className="px-4 py-3"><ScoreBar score={c.overall} colorClass="bg-brand-primary" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.chatgpt ?? 0} colorClass="bg-teal-500" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.perplexity ?? 0} colorClass="bg-purple-500" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.gemini ?? 0} colorClass="bg-blue-500" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.claude ?? 0} colorClass="bg-orange-500" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.copilot ?? 0} colorClass="bg-cyan-500" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.deepseek ?? 0} colorClass="bg-gray-400" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.mistral ?? 0} colorClass="bg-rose-500" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.llama ?? 0} colorClass="bg-yellow-500" /></td>
                        <td className="px-4 py-3"><ScoreBar score={c.platforms.poe ?? 0} colorClass="bg-indigo-500" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const TrendAnalysis: React.FC<{ platforms: AnalyzerPlatform[] }> = ({ platforms }) => {
    const [timeRange, setTimeRange] = useState('30d');
    const performanceData = [{ name: 'Jan', Your: 65, Avg: 58}, { name: 'Feb', Your: 68, Avg: 60}, { name: 'Mar', Your: 72, Avg: 62}, { name: 'Apr', Your: 75, Avg: 65}, { name: 'May', Your: 82, Avg: 69}, { name: 'Jun', Your: 88, Avg: 76}];
    const platformData = platforms.map(p => ({ name: p.name, Score: p.score, Growth: p.growth }));

    return (
        <div>
            <div className="flex space-x-2 mb-4">
                {(['30d', '90d', '1y']).map(range => (
                    <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 text-sm rounded-md ${timeRange === range ? 'bg-brand-primary text-white' : 'bg-dark-border text-medium-text'}`}>
                        {range === '1y' ? '1 Year' : `${range.replace('d','')} Days`}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-72">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }} />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Line type="monotone" dataKey="Your" name="Your Visibility" stroke="#4F46E5" strokeWidth={2} />
                        <Line type="monotone" dataKey="Avg" name="Industry Average" stroke="#7C3AED" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <YAxis yAxisId="left" orientation="left" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }} />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Bar yAxisId="left" dataKey="Score" barSize={20} fill="#4F46E5" />
                        <Line yAxisId="right" type="monotone" dataKey="Growth" stroke="#22c55e" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const ContentPerformanceDeepDive: React.FC<{ content: AnalyzerContent[] }> = ({ content: initialContent }) => {
    const [contentList, setContentList] = useState<AnalyzerContent[]>(initialContent);
    const [platform, setPlatform] = useState('all');
    const [sort, setSort] = useState('citations');

    const [analysisText, setAnalysisText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    React.useEffect(() => {
        setContentList(initialContent);
    }, [initialContent]);

    const handleAnalyzeContent = async () => {
        if (!analysisText.trim()) {
            setError("Please paste some content to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                You are an expert AI Visibility and SEO analyst for a SaaS platform called "AI FORCE".
                Analyze the following text content and provide a detailed performance analysis.
                The output must be a single JSON object.

                Content to analyze:
                "${analysisText}"
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "A concise, compelling title for the content, under 10 words." },
                            platforms: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "An array of 2-3 platform names (e.g., 'Gemini', 'ChatGPT') where this content would perform best."
                            },
                            citations: { type: Type.NUMBER, description: "An estimated citation score from 0 to 100." },
                            visibility: { type: Type.NUMBER, description: "An estimated visibility score from 0 to 100." },
                            growth: { type: Type.NUMBER, description: "An estimated growth potential score as a number (e.g., 15 for +15%)." },
                            metrics: {
                                type: Type.OBJECT,
                                properties: {
                                    engagement: { type: Type.NUMBER, description: "An engagement score from 0 to 100." },
                                    depth: { type: Type.NUMBER, description: "A content depth score from 0 to 100." },
                                    relevance: { type: Type.NUMBER, description: "A relevance score from 0 to 100." },
                                },
                                required: ['engagement', 'depth', 'relevance']
                            }
                        },
                        required: ['title', 'platforms', 'citations', 'visibility', 'growth', 'metrics']
                    }
                }
            });

            if (!response) {
                throw new Error("Received an empty or invalid response from the AI model.");
            }

            const result = JSON.parse(response.text);
            
            const newContentItem: AnalyzerContent = {
                id: Date.now(),
                url: '/analyzed-content',
                ...result
            };

            setContentList(prev => [newContentItem, ...prev]);
            setAnalysisText('');

        } catch (e) {
            console.error(e);
            setError("Analysis failed. The AI couldn't process the request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredContent = useMemo(() => {
        return contentList
            .filter(c => platform === 'all' || c.platforms.some(p => p.toLowerCase() === platform.toLowerCase()))
            .sort((a, b) => {
                if (sort === 'citations') return b.citations - a.citations;
                if (sort === 'visibility') return b.visibility - a.visibility;
                if (sort === 'growth') return b.growth - a.growth;
                return 0;
            });
    }, [contentList, platform, sort]);

    return (
        <div>
            <div className="bg-dark-border/30 p-4 rounded-lg mb-6 border-l-4 border-brand-secondary">
                <h4 className="text-lg font-semibold text-light-text mb-2">Analyze New Content</h4>
                <p className="text-sm text-medium-text mb-4">Paste your content below to get an instant AI-powered performance analysis.</p>
                <textarea
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                    rows={5}
                    className="w-full bg-dark-bg border border-dark-border text-light-text rounded-md p-3 focus:ring-brand-primary focus:border-brand-primary resize-vertical"
                    placeholder="Paste content here..."
                    disabled={isLoading}
                />
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <button
                    onClick={handleAnalyzeContent}
                    disabled={isLoading || !analysisText}
                    className="w-full mt-4 bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 transition-colors disabled:bg-brand-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                         <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        'Analyze Content with AI'
                    )}
                </button>
            </div>

            <div className="flex gap-4 mb-4 flex-wrap">
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="bg-dark-border text-light-text p-2 rounded-md">
                    <option value="all">All Platforms</option>
                    <option value="ChatGPT">ChatGPT</option>
                    <option value="Perplexity">Perplexity</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Claude">Claude</option>
                    <option value="Copilot">Copilot</option>
                    <option value="DeepSeek">DeepSeek</option>
                    <option value="Mistral">Mistral</option>
                    <option value="Llama">Llama</option>
                    <option value="Poe">Poe</option>
                </select>
                <select value={sort} onChange={e => setSort(e.target.value)} className="bg-dark-border text-light-text p-2 rounded-md">
                    <option value="citations">Sort by Citations</option>
                    <option value="visibility">Sort by Visibility</option>
                    <option value="growth">Sort by Growth</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map(c => (
                    <div key={c.id} className="bg-dark-border/50 rounded-lg p-4 border-l-4 border-brand-primary animate-fade-in">
                        <h4 className="font-bold text-light-text">{c.title}</h4>
                        <p className="text-xs text-medium-text truncate mb-2">{c.url}</p>
                        <div className="flex flex-wrap gap-1 my-2">
                            {c.platforms.map(p => <span key={p} className="text-xs bg-dark-border px-2 py-1 rounded-full">{p}</span>)}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center mt-3">
                            <div><div className="font-bold text-lg">{c.citations}</div><div className="text-xs text-medium-text">Citations</div></div>
                            <div><div className="font-bold text-lg">{c.visibility}</div><div className="text-xs text-medium-text">Visibility</div></div>
                            <div><div className={`font-bold text-lg ${c.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>{c.growth > 0 ? '+' : ''}{c.growth}%</div><div className="text-xs text-medium-text">Growth</div></div>
                        </div>
                    </div>
                ))}
            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const AiPoweredInsights: React.FC<{ initialInsights: Insight[], fullData: any }> = ({ initialInsights, fullData }) => {
    const [insights, setInsights] = useState<Insight[]>(initialInsights);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        setInsights(initialInsights);
    }, [initialInsights]);

    const handleInsightAction = (action: string) => alert(`Executing: ${action}...`);

    const generateNewInsights = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const dataSummary = JSON.stringify({
                platforms: fullData.platforms.map((p: any) => ({ name: p.name, score: p.score, growth: p.growth })),
                competitors: fullData.competitors.map((c: any) => ({ name: c.name, overall: c.overall })),
                topContent: fullData.content_performance.map((c: any) => ({ title: c.title, visibility: c.visibility, growth: c.growth })).slice(0, 2),
            }, null, 2);

            const prompt = `
                You are an expert AI Visibility and SEO analyst for a SaaS platform called "AI FORCE".
                Based on the following performance data summary, generate 4 actionable and insightful recommendations.
                For each insight, provide a relevant emoji icon, a concise title, a brief description, and a short call-to-action button text.

                Data Summary:
                ${dataSummary}

                The insights should be diverse, covering optimization opportunities, growth trends, competitive analysis, or quick wins.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            insights: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        icon: { type: Type.STRING, description: 'A single emoji character.' },
                                        title: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        action: { type: Type.STRING, description: 'A short call-to-action text for a button.' },
                                    },
                                    required: ['icon', 'title', 'description', 'action'],
                                },
                            },
                        },
                        required: ['insights'],
                    },
                },
            });

            if (!response) {
                throw new Error("Received an empty or invalid response from the AI model.");
            }

            const jsonResponse = JSON.parse(response.text);
            if (jsonResponse.insights && Array.isArray(jsonResponse.insights)) {
                setInsights(jsonResponse.insights);
            } else {
                throw new Error("Invalid response format from AI.");
            }
        } catch (e) {
            console.error(e);
            setError("Failed to generate new insights. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl p-6">
            <div className="flex justify-between items-start md:items-center mb-6 flex-col md:flex-row gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-light-text">AI-Powered Insights & Recommendations</h3>
                    <p className="text-indigo-200">Actionable intelligence based on your performance data</p>
                </div>
                <button 
                    onClick={generateNewInsights} 
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors disabled:bg-white/10 disabled:cursor-not-allowed shrink-0"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                           </svg>
                           <span>Generate New Insights</span>
                        </>
                    )}
                </button>
            </div>
            {error && <div className="bg-red-500/30 text-red-200 p-4 rounded-lg text-center mb-4">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-black/20 p-4 rounded-lg backdrop-blur-sm animate-pulse">
                            <div className="h-8 w-8 bg-white/10 rounded mb-2"></div>
                            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-white/10 rounded w-full mb-1"></div>
                            <div className="h-3 bg-white/10 rounded w-5/6 mb-3"></div>
                            <div className="h-6 bg-white/20 rounded w-1/2"></div>
                        </div>
                    ))
                ) : (
                    insights.map((insight, i) => (
                        <div key={i} className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                            <div className="text-3xl mb-2">{insight.icon}</div>
                            <h4 className="font-bold text-white mb-1">{insight.title}</h4>
                            <p className="text-sm text-indigo-200 mb-3">{insight.description}</p>
                            <button onClick={() => handleInsightAction(insight.action)} className="text-sm font-semibold text-white bg-white/20 px-3 py-1 rounded-md hover:bg-white/30">{insight.action}</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const AiVisibilityAnalyzer: React.FC<AiVisibilityAnalyzerProps> = ({ data, onAnalyze, isLoading }) => {
    const displayData = data || ANALYZER_DATA;

    return (
        <div className="space-y-6">
            <AnalyzerHeader />
            
            {!data && (
                <div className="space-y-6">
                    <AnalysisInput onAnalyze={onAnalyze} isLoading={isLoading} />
                    <Card title="Welcome to the AI Visibility Analyzer">
                        <div className="text-center py-16 text-medium-text">
                            <div className="text-6xl mb-4">📊</div>
                            <h2 className="text-2xl font-bold text-light-text mb-4">Analysis Required to View Live Data</h2>
                            <p className="max-w-2xl mx-auto">
                                Enter a URL above to populate this dashboard with live data. You are currently viewing a demo layout.
                            </p>
                        </div>
                    </Card>
                </div>
            )}
            
            <div className={!data ? 'opacity-40 pointer-events-none' : ''}>
                <Card title="Platform-Specific Analytics">
                    <p className="text-medium-text -mt-4 mb-6">Deep performance metrics across all AI platforms</p>
                    <PlatformComparison platforms={displayData.platforms} />
                </Card>
                <div className="mt-6">
                    <Card title="Citation Frequency Tracking">
                        <p className="text-medium-text -mt-4 mb-6">Monitor citation patterns and growth trends</p>
                        <CitationAnalysis citations={displayData.citations} />
                    </Card>
                </div>
                <div className="mt-6">
                    <Card title="Competitor Benchmarking">
                        <p className="text-medium-text -mt-4 mb-6">Compare your performance against industry competitors</p>
                        <CompetitorBenchmarking competitors={displayData.competitors} />
                    </Card>
                </div>
                <div className="mt-6">
                    <Card title="Trend Analysis">
                        <p className="text-medium-text -mt-4 mb-6">Historical performance and predictive insights</p>
                        <TrendAnalysis platforms={displayData.platforms} />
                    </Card>
                </div>
                 <div className="mt-6">
                    <Card title="Content Performance Deep Dive">
                        <p className="text-medium-text -mt-4 mb-6">Detailed analysis of individual content pieces</p>
                        <ContentPerformanceDeepDive content={displayData.content_performance} />
                    </Card>
                </div>
                 <div className="mt-6">
                    <AiPoweredInsights initialInsights={displayData.insights} fullData={displayData} />
                </div>
            </div>
        </div>
    );
};
