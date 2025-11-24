
import type { PerplexityOverviewData, SourceCredibilityAuditItem, SourceCredibilityInsight, FreshnessMetric, ContentUpdate, ReferenceQualityCardData, PerplexityQuickAction } from '../types';

export const PERPLEXITY_OVERVIEW_DATA: PerplexityOverviewData = {
    score: 89,
    citations: 98,
    position: '#1',
    credibility: 92,
    trend: '↑ 3% this month',
    citationTrend: '↑ 8 new citations',
    positionTrend: '↑ Leading position',
    credibilityTrend: '↑ 5% improved'
};

export const SOURCE_CREDIBILITY_AUDIT_DATA: SourceCredibilityAuditItem[] = [
    { id: 'expertise', icon: '🎓', title: 'Author Expertise', description: 'Author credentials and subject matter authority', score: 'A+' },
    { id: 'research', icon: '🔬', title: 'Research Depth', description: 'Quality and depth of research methodology', score: 'B+' },
    { id: 'data', icon: '📊', title: 'Data Verification', description: 'Accuracy and verification of statistical data', score: 'C+' },
    { id: 'diversity', icon: '🔗', title: 'Source Diversity', description: 'Variety and quality of referenced sources', score: 'B' },
    { id: 'recency', icon: '🕒', title: 'Information Recency', description: 'Timeliness and current relevance of information', score: 'A' },
];

export const SOURCE_CREDIBILITY_INSIGHTS_DATA: SourceCredibilityInsight[] = [
    { id: 'data-opp', icon: '💡', title: 'Data Verification Opportunity', description: 'Improve data verification with third-party sources to increase credibility score by 15%.' },
    { id: 'diversity-gap', icon: '🎯', title: 'Source Diversity Gap', description: 'Add 3-5 additional authoritative sources per article to enhance source diversity.' },
    { id: 'depth-potential', icon: '📈', title: 'Research Depth Potential', description: 'Include more primary research and case studies to improve research depth rating.' },
];

export const FRESHNESS_METRICS_DATA: FreshnessMetric[] = [
    { id: 'timeliness', label: 'Information Timeliness', score: 88, lastUpdated: 'Last updated: 2 days ago' },
    { id: 'currency', label: 'Data Currency', score: 72, lastUpdated: 'Some data from last quarter' },
    { id: 'readiness', label: 'Real-time Readiness', score: 65, lastUpdated: 'Limited live data integration' },
    { id: 'frequency', label: 'Update Frequency', score: 85, lastUpdated: 'Weekly content reviews' },
];

export const CONTENT_UPDATES_DATA: ContentUpdate[] = [
    { id: 'guide-1', title: 'AI SEO Strategies Guide', lastReviewed: '5 days ago', status: 'CURRENT' },
    { id: 'trends-1', title: 'Machine Learning Trends', lastReviewed: '3 weeks ago', status: 'UPDATE NEEDED' },
    { id: 'analysis-1', title: 'LLM Market Analysis', lastReviewed: '2 days ago', status: 'CURRENT' },
    { id: 'tools-1', title: 'AI Tools Comparison', lastReviewed: '1 month ago', status: 'SCHEDULED' },
];

export const REFERENCE_QUALITY_DATA: ReferenceQualityCardData[] = [
    { id: 'academic', icon: '🎓', title: 'Academic References', subtitle: 'Peer-reviewed sources', description: 'Evaluate and enhance academic references including journals, research papers, and peer-reviewed studies.', qualityScore: 8, referenceCount: 12 },
    { id: 'industry', icon: '🏢', title: 'Industry Sources', subtitle: 'Professional and authority', description: 'Optimize industry references including professional publications, expert opinions, and market reports.', qualityScore: 7, referenceCount: 15 },
    { id: 'data-sources', icon: '📊', title: 'Data Sources', subtitle: 'Statistical and data references', description: 'Improve data references including statistics, research data, and verified numerical information.', qualityScore: 6, referenceCount: 9 },
];

export const PERPLEXITY_QUICK_ACTIONS_DATA: PerplexityQuickAction[] = [
    { id: 'add-citations', icon: '📚', text: 'Add Source Citations' },
    { id: 'update-content', icon: '🔄', text: 'Update Outdated Content' },
    { id: 'enhance-data', icon: '✅', text: 'Enhance Data Verification' },
    { id: 'improve-format', icon: '📝', text: 'Improve Reference Format' },
    { id: 'generate-fact-check', icon: '🔍', text: 'Generate Fact-Check' },
];
