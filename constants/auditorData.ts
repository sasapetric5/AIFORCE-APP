import type { 
    AuditorOverviewMetric, 
    CrawlerCompatibilityData, 
    SchemaAuditItem, 
    RecommendedSchema,
    CoreVital,
    PerformanceTrendPoint,
    SecuritySection,
    AuditorQuickActionItem
} from '../types';

export const AUDITOR_OVERVIEW_DATA: AuditorOverviewMetric[] = [
    { id: 'crawler-score', icon: '🤖', value: '87%', label: 'AI Crawler Score', trend: '↑ 5% this month', trendDirection: 'up', borderColor: 'border-blue-500' },
    { id: 'performance-score', icon: '⚡', value: '92', label: 'Performance Score', trend: '↑ 3% this month', trendDirection: 'up', borderColor: 'border-green-500' },
    { id: 'critical-issues', icon: '🔧', value: '12', label: 'Critical Issues', trend: '↑ 2 new issues', trendDirection: 'down', borderColor: 'border-red-500' },
    { id: 'structured-data', icon: '📈', value: '78%', label: 'Structured Data', trend: '↑ 8% this month', trendDirection: 'up', borderColor: 'border-amber-500' },
];

export const CRAWLER_COMPATIBILITY_DATA: CrawlerCompatibilityData = {
    tests: [
        { id: 'google-ai', icon: '🌐', name: 'Google AI Crawler', description: 'Googlebot-AI compatibility test', status: 'PASS' },
        { id: 'chatgpt', icon: '🤖', name: 'ChatGPT Crawler', description: 'OpenAI GPTBot accessibility', status: 'WARNING' },
        { id: 'perplexity', icon: '🔮', name: 'Perplexity AI', description: 'PerplexityBot rendering test', status: 'PASS' },
        { id: 'claude', icon: '💬', name: 'Claude Web Crawler', description: 'Anthropic crawler compatibility', status: 'FAIL' },
        { id: 'copilot', icon: '©️', name: 'Copilot Indexing', description: 'Microsoft Bing AI crawler', status: 'PASS' },
    ],
    overallScore: 87,
    chartData: [
        { name: 'Compatible', value: 70, fill: '#22C55E' },
        { name: 'Warnings', value: 20, fill: '#FBBF24' },
        { name: 'Issues', value: 10, fill: '#EF4444' },
    ]
};

export const SCHEMA_AUDIT_DATA: SchemaAuditItem[] = [
    { id: 'article', name: 'Article Schema', description: 'NewsArticle, BlogPosting markup', status: 'PRESENT' },
    { id: 'faq', name: 'FAQ Schema', description: 'Question & Answer markup', status: 'PARTIAL' },
    { id: 'howto', name: 'How-to Schema', description: 'Step-by-step instructions', status: 'MISSING' },
    { id: 'product', name: 'Product Schema', description: 'Product information markup', status: 'PRESENT' },
    { id: 'organization', name: 'Organization Schema', description: 'Company and brand markup', status: 'PRESENT' },
];

export const RECOMMENDED_SCHEMA_DATA: RecommendedSchema[] = [
    { id: 'howto', name: 'How-to Schema' },
    { id: 'course', name: 'Course Schema' },
    { id: 'recipe', name: 'Recipe Schema' },
    { id: 'event', name: 'Event Schema' },
];

export const CORE_VITALS_DATA: CoreVital[] = [
    { id: 'lcp', name: 'Largest Contentful Paint (LCP)', value: '2.1s', rating: 'good', target: 'Loads within 2.5s', score: 85 },
    { id: 'fid', name: 'First Input Delay (FID)', value: '85ms', rating: 'needs_improvement', target: 'Responds within 100ms', score: 92 },
    { id: 'cls', name: 'Cumulative Layout Shift (CLS)', value: '0.18', rating: 'poor', target: 'Target 0.1', score: 70 },
    { id: 'fcp', name: 'First Contentful Paint (FCP)', value: '1.2s', rating: 'good', target: 'Loads within 1.8s', score: 88 },
];

export const PERFORMANCE_TREND_DATA: PerformanceTrendPoint[] = [
    { name: 'Jan', 'Performance Score': 75, 'AI Crawler Score': 70 },
    { name: 'Feb', 'Performance Score': 78, 'AI Crawler Score': 72 },
    { name: 'Mar', 'Performance Score': 82, 'AI Crawler Score': 75 },
    { name: 'Apr', 'Performance Score': 85, 'AI Crawler Score': 78 },
    { name: 'May', 'Performance Score': 88, 'AI Crawler Score': 82 },
    { name: 'Jun', 'Performance Score': 90, 'AI Crawler Score': 85 },
    { name: 'Jul', 'Performance Score': 92, 'AI Crawler Score': 87 },
];

export const SECURITY_TRUST_DATA: SecuritySection[] = [
    {
        id: 'protocols',
        title: 'Security Protocols',
        signals: [
            { id: 'https', name: 'HTTPS Encryption', score: 'A+', rating: 'excellent' },
            { id: 'ssl', name: 'SSL Certificate', score: 'VALID', rating: 'excellent' },
            { id: 'headers', name: 'Security Headers', score: 'B+', rating: 'good' },
            { id: 'malware', name: 'Malware Scan', score: 'CLEAN', rating: 'excellent' },
        ],
    },
    {
        id: 'authority',
        title: 'Trust & Authority',
        signals: [
            { id: 'age', name: 'Domain Age', score: '3 Years', rating: 'good' },
            { id: 'backlinks', name: 'Backlink Quality', score: 'C+', rating: 'fair' },
            { id: 'social', name: 'Social Signals', score: 'B', rating: 'good' },
            { id: 'freshness', name: 'Content Freshness', score: 'A', rating: 'excellent' },
        ],
    },
    {
        id: 'ai-trust',
        title: 'AI Trust Factors',
        signals: [
            { id: 'eeat', name: 'E-E-A-T Signals', score: 'B+', rating: 'good' },
            { id: 'author', name: 'Author Authority', score: 'C+', rating: 'fair' },
            { id: 'accuracy', name: 'Content Accuracy', score: 'A', rating: 'excellent' },
            { id: 'credibility', name: 'Source Credibility', score: 'B', rating: 'good' },
        ],
    },
];

export const AUDITOR_QUICK_ACTIONS_DATA: AuditorQuickActionItem[] = [
    { id: 'fix-crawlers', icon: '🤖', text: 'Fix Crawler Issues' },
    { id: 'optimize-perf', icon: '⚡', text: 'Optimize Performance' },
    { id: 'add-schema', icon: '🧩', text: 'Add Schema Markup' },
    { id: 'enhance-security', icon: '🛡️', text: 'Enhance Security' },
    { id: 'generate-report', icon: '📋', text: 'Generate Report' },
];
