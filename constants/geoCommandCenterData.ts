import { GeoPlatform, GeoContent, Goal, GeoAlert, GeoTrendData } from '../types';

export const GEO_PLATFORMS: GeoPlatform[] = [
    { id: 'gemini', name: 'Gemini', score: 92, trend: 1.2, icon: '🌐' },
    { id: 'chatgpt', name: 'ChatGPT', score: 85, trend: -0.5, icon: '🤖' },
    { id: 'perplexity', name: 'Perplexity', score: 89, trend: 2.1, icon: '🔮' },
    { id: 'claude', name: 'Claude', score: 78, trend: 0.2, icon: '💬' },
    { id: 'copilot', name: 'Copilot', score: 81, trend: 0.8, icon: '©️' },
    { id: 'deepseek', name: 'DeepSeek', score: 75, trend: 1.5, icon: '🧠' },
    { id: 'mistral', name: 'Mistral', score: 79, trend: -0.2, icon: '🌬️' },
    { id: 'llama', name: 'Llama', score: 72, trend: 0.9, icon: '🦙' },
    { id: 'poe', name: 'Poe', score: 76, trend: 1.1, icon: '✨' },
];

export const GEO_CONTENT_MATRIX: GeoContent[] = [
    { id: '1', title: 'Ultimate Guide to AI SEO', gemini: 95, chatgpt: 88, perplexity: 91, claude: 82, copilot: 85, deepseek: 78, mistral: 81, llama: 75, poe: 79 },
    { id: '2', title: 'Top 10 LLM Trends in 2024', gemini: 91, chatgpt: 94, perplexity: 85, claude: 88, copilot: 90, deepseek: 82, mistral: 84, llama: 79, poe: 83 },
    { id: '3', title: 'How to Optimize for Perplexity', gemini: 84, chatgpt: 81, perplexity: 96, claude: 79, copilot: 82, deepseek: 88, mistral: 80, llama: 77, poe: 81 },
    { id: '4', title: 'Claude 3 Opus vs GPT-4', gemini: 88, chatgpt: 90, perplexity: 82, claude: 93, copilot: 89, deepseek: 76, mistral: 85, llama: 81, poe: 84 },
];

export const GEO_TREND_DATA: GeoTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    scores: [82, 84, 83, 86, 88, 90],
    competitorScores: [78, 79, 81, 80, 82, 84],
};

export const GEO_ALERTS: GeoAlert[] = [
    { id: '1', icon: '🚨', title: 'Critical: ChatGPT Visibility Drop', description: 'Your "LLM Trends" content dropped 5 positions.', time: '1h ago', type: 'critical' },
    { id: '2', icon: '🎯', title: 'Opportunity: "AI Overviews" Topic', description: 'Low competition for this keyword on Gemini.', time: '4h ago', type: 'opportunity' },
    { id: '3', icon: '✅', title: 'Success: Perplexity Score Increase', description: 'Your overall score increased by 3 points this week.', time: '1d ago', type: 'success' },
];

export const GEO_GOALS: Goal[] = [
    { id: '1', title: 'Overall Visibility Score', target: 95, current: 88, metric: 'Score' },
    { id: '2', title: 'Gemini Citations', target: 200, current: 152, metric: 'Citations' },
    { id: '3', title: 'Reduce Competitor Gap', target: 2, current: 6, metric: 'Avg. Points' },
];