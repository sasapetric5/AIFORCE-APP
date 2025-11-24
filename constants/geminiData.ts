
import type { EeatSignalData, QuickOptimizationData, FormattingInsight, LocalIntentMetric, LocalTargetingOpportunity, PerspectiveDataPoint } from '../types';

export const GEMINI_EEAT_DATA: EeatSignalData[] = [
    {
        id: 'experience',
        title: 'Experience Demonstration',
        icon: 'fas fa-star',
        score: 7,
        signals: 8,
        description: 'Real-world practice and hands-on knowledge.'
    },
    {
        id: 'expertise',
        title: 'Expertise Enhancement',
        icon: 'fas fa-user-graduate',
        score: 8,
        signals: 12,
        description: 'Author credentials and subject mastery.'
    },
    {
        id: 'authoritativeness',
        title: 'Authoritativeness Boost',
        icon: 'fas fa-trophy',
        score: 9,
        signals: 15,
        description: 'Industry recognition and authority signals.'
    },
    {
        id: 'trustworthiness',
        title: 'Trustworthiness Signals',
        icon: 'fas fa-shield-alt',
        score: 8,
        signals: 18,
        description: 'Security, privacy, and user trust factors.'
    }
];

export const GEMINI_QUICK_OPTIMIZATION_DATA: QuickOptimizationData[] = [
    { id: 'structure', title: 'Optimize Structure', icon: 'fas fa-pencil-ruler' },
    { id: 'local', title: 'Enhance Local Signals', icon: 'fas fa-globe-americas' },
    { id: 'eeat', title: 'Boost E-E-A-T', icon: 'fas fa-star' },
    { id: 'perspectives', title: 'Add Perspectives', icon: 'fas fa-search-plus' },
    { id: 'overview', title: 'Generate Overview', icon: 'fas fa-chart-bar' },
];

export const GEMINI_FORMATTING_INSIGHTS: FormattingInsight[] = [
    { id: 'structure', icon: 'fas fa-pencil-ruler', title: 'Structure Enhancement Needed', description: 'Add clear section headers and subheadings to improve content scannability for AI Overviews.' },
    { id: 'coverage', icon: 'fas fa-search-plus', title: 'Comprehensive Coverage Gap', description: 'Include more detailed explanations and cover multiple aspects of each topic for better AI comprehension.' },
    { id: 'key-points', icon: 'fas fa-bullseye', title: 'Key Point Optimization', description: 'Emphasize key takeaways and main points at the beginning of each section for better feature snippet potential.' },
];

export const GEMINI_LOCAL_INTENT_METRICS: LocalIntentMetric[] = [
    { id: 'relevance', label: 'Geographic Relevance', score: 85, description: 'Strong local context integration' },
    { id: 'coverage', label: 'Local Entity Coverage', score: 68, description: 'Moderate local business mentions' },
    { id: 'language', label: 'Regional Language Optimization', score: 45, description: 'Limited regional terminology' },
    { id: 'schema', label: 'Local Schema Implementation', score: 78, description: 'Good local business markup' },
];

export const GEMINI_LOCAL_TARGETING_OPPORTUNITIES: LocalTargetingOpportunity[] = [
    { id: 'na', market: 'North American Market', coverage: 'US, Canada, Mexico coverage', status: 'STRONG' },
    { id: 'eu', market: 'European Union', coverage: 'Limited regional adaptation', status: 'MODERATE' },
    { id: 'apac', market: 'Asia-Pacific Region', coverage: 'Minimal local optimization', status: 'WEAK' },
];

export const GEMINI_PERSPECTIVE_DATA: PerspectiveDataPoint[] = [
    { subject: 'Technical', current: 85, target: 90 },
    { subject: 'Business', current: 70, target: 80 },
    { subject: 'User', current: 75, target: 85 },
    { subject: 'Comparative', current: 55, target: 75 },
    { subject: 'Historical', current: 60, target: 70 },
    { subject: 'Future', current: 78, target: 85 },
];
