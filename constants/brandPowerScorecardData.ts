import type { BrandPowerScorecardData } from '../types';

export const MOCK_SCORECARD_DATA: BrandPowerScorecardData = {
    mainScore: 78,
    scoreChange: 8,
    industryAverage: 62,
    components: [
        { label: 'AI Visibility', value: 85 },
        { label: 'Share of Voice', value: 72 },
        { label: 'Citation Quality', value: 81 },
        { label: 'Platform Coverage', value: 74 },
    ],
    breakdownChartData: {
        labels: ['AI Visibility', 'Share of Voice', 'Citation Quality', 'Platform Coverage', 'Content Authority', 'Technical SEO'],
        userScores: [85, 72, 81, 74, 78, 82],
        averageScores: [62, 58, 65, 60, 55, 68],
    },
    platformScores: [
        { name: 'ChatGPT', score: 82, change: 8, icon: 'fa-robot', color: '#10a37f' },
        { name: 'Perplexity', score: 78, change: 12, icon: 'fa-search', color: '#8b5cf6' },
        { name: 'Gemini', score: 85, change: 15, icon: 'fa-google', color: '#4285f4' },
        { name: 'Claude', score: 71, change: 5, icon: 'fa-brain', color: '#f97316' }
    ],
    marketPosition: 2,
    competitors: [
        { rank: 1, name: 'AI Marketing Pro', score: 85 },
        { rank: 2, name: 'Your Brand', score: 78, isUserBrand: true },
        { rank: 3, name: 'SEO Master', score: 72 },
        { rank: 4, name: 'Content Genius', score: 68 },
    ],
    historicalData: [
        { month: 'Jan', userScore: 65, averageScore: 60 },
        { month: 'Feb', userScore: 68, averageScore: 61 },
        { month: 'Mar', userScore: 70, averageScore: 61 },
        { month: 'Apr', userScore: 72, averageScore: 62 },
        { month: 'May', userScore: 75, averageScore: 62 },
        { month: 'Jun', userScore: 78, averageScore: 62 },
    ]
};
