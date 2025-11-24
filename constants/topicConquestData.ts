
import type { TopicConquestAnalysis } from '../types';

export const MOCK_TOPIC_CONQUEST_DATA: TopicConquestAnalysis = {
    topicOpportunities: [
        { id: '1', topic: 'AI in Predictive Analytics', opportunityScore: 92, yourCoverage: 'Low', topCompetitor: 'Competitor A', visibilityImpact: 85, investment: 'Medium', aiPreference: 90 },
        { id: '2', topic: 'Ethical AI Frameworks', opportunityScore: 88, yourCoverage: 'None', topCompetitor: 'Competitor B', visibilityImpact: 80, investment: 'Medium', aiPreference: 85 },
        { id: '3', topic: 'Automated Content Generation APIs', opportunityScore: 85, yourCoverage: 'Medium', topCompetitor: 'Competitor A', visibilityImpact: 75, investment: 'High', aiPreference: 95 },
        { id: '4', topic: 'LLM Fine-Tuning for Small Business', opportunityScore: 82, yourCoverage: 'None', topCompetitor: 'Competitor C', visibilityImpact: 78, investment: 'Low', aiPreference: 80 },
        { id: '5', topic: 'Comparative Analysis: GPT-4 vs Claude 3', opportunityScore: 75, yourCoverage: 'High', topCompetitor: 'Competitor B', visibilityImpact: 60, investment: 'Low', aiPreference: 70 },
    ],
    aiNichePreferences: [
        { topic: 'Practical Implementation Guides', preference: 95 },
        { topic: 'Technical Deep Dives', preference: 92 },
        { topic: 'Business Use Cases', preference: 88 },
        { topic: 'Future Trends & Predictions', preference: 85 },
        { topic: 'Beginner-Friendly Explainers', preference: 80 },
    ],
    contentDepthComparison: [
        { topic: 'AI SEO Strategies', yourDepth: 65, competitorADepth: 85, competitorBDepth: 75 },
        { topic: 'Machine Learning Tutorials', yourDepth: 78, competitorADepth: 72, competitorBDepth: 80 },
        { topic: 'AI Platform Reviews', yourDepth: 55, competitorADepth: 90, competitorBDepth: 82 },
    ]
};
