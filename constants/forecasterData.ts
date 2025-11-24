import type { ForecasterData } from '../types';

export const FORECASTER_DATA: ForecasterData = {
    overviewCards: [
        { value: '+18%', label: 'Visibility Growth', trend: '92% Confidence', trendDirection: 'up' },
        { value: '85', label: 'Target Score', trend: '+7 Points', trendDirection: 'up' },
        { value: '#1', label: 'Market Position', trend: '45 Days ETA', trendDirection: 'up' },
        { value: '3.8x', label: 'ROI Multiplier', trend: 'High Impact', trendDirection: 'up' },
    ],
    predictionConfidence: [
        { platform: 'ChatGPT Visibility', confidence: 94, icon: 'fas fa-robot', color: '#10b981' },
        { platform: 'Gemini Performance', confidence: 88, icon: 'fab fa-google', color: '#0ea5e9' },
        { platform: 'Perplexity Growth', confidence: 91, icon: 'fas fa-search', color: '#8b5cf6' },
        { platform: 'Market Position', confidence: 85, icon: 'fas fa-brain', color: '#f97316' },
    ],
    alerts: [
        { type: 'critical', icon: 'fas fa-exclamation-triangle', title: 'Visibility Drop Predicted', description: '15% decrease in Perplexity visibility forecasted in 14 days due to competitor content surge.' },
        { type: 'opportunity', icon: 'fas fa-bullseye', title: 'Opportunity Window', description: 'High-growth potential identified in "AI Healthcare" niche. 28% market gap available.' },
        { type: 'warning', icon: 'fas fa-chess-knight', title: 'Competitor Threat', description: '#1 competitor planning major AI tool launch in 21 days. Preemptive action recommended.' },
    ],
    scenarios: [
        {
            id: 'aggressive',
            icon: 'fas fa-rocket',
            title: 'Aggressive Growth',
            description: 'Maximum investment scenario with accelerated content production and platform expansion.',
            metrics: { visibility: '+25%', eta: '30d', roi: '4.2x' },
        },
        {
            id: 'balanced',
            icon: 'fas fa-balance-scale',
            title: 'Balanced Approach',
            description: 'Optimized resource allocation with focus on high-ROI platforms and content types.',
            metrics: { visibility: '+18%', eta: '45d', roi: '3.8x' },
        },
        {
            id: 'mitigation',
            icon: 'fas fa-shield-alt',
            title: 'Risk Mitigation',
            description: 'Conservative strategy focusing on protecting current position and gradual growth.',
            metrics: { visibility: '+12%', eta: '60d', roi: '2.5x' },
        },
    ],
};
