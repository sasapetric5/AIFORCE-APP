import type { CompetitiveIntelligenceData } from '../types';

export const COMPETITIVE_INTELLIGENCE_DATA: CompetitiveIntelligenceData = {
  overview: {
    marketPosition: { value: '#2', trend: '↑ from #3' },
    shareGrowth: { value: '+2.5%', trend: 'Accelerating' },
    activeCompetitors: { value: '4', trend: 'Stable' },
    identifiedOpportunities: { value: '3', trend: 'New' },
  },
  marketShare: [
    { name: 'Competitor A', share: 35 },
    { name: 'Your Brand', share: 28 },
    { name: 'Competitor B', share: 22 },
    { name: 'Competitor C', share: 10 },
  ],
  opportunities: [
    {
      id: 'opp1',
      type: 'Content Gap',
      impact: 'High',
      title: 'Target "AI in Healthcare" Niche',
      description: 'Competitors have low visibility for high-intent keywords related to AI applications in the healthcare industry.',
      metrics: [
        { value: '150K', label: 'Monthly Volume' },
        { value: 'Low', label: 'Competition' },
        { value: '+15%', label: 'Potential Growth' },
      ],
    },
    {
      id: 'opp2',
      type: 'Platform Expansion',
      impact: 'Medium',
      title: 'Optimize for Claude AI',
      description: 'Your brand and competitors are underperforming on Claude. Early optimization could capture significant visibility.',
      metrics: [
        { value: '-25%', label: 'Your Visibility' },
        { value: '70%', label: 'Untapped Market' },
        { value: 'Q3 Goal', label: 'Timeline' },
      ],
    },
     {
      id: 'opp3',
      type: 'Feature Advantage',
      impact: 'High',
      title: 'Promote "Real-time Editor" Feature',
      description: 'Your "Real-time Content Editor" is a key differentiator. A dedicated campaign could capture market share from competitors lacking this feature.',
      metrics: [
        { value: '85%', label: 'Feature Match' },
        { value: '+10%', label: 'Share Gain' },
        { value: 'Unique', label: 'Differentiator' },
      ],
    },
  ],
  alerts: [
    {
      id: 'alert1',
      icon: '📈',
      title: 'Competitor A Surges on Gemini',
      priority: 'High',
      time: '2h ago',
      description: 'Competitor A gained 5 positions for "AI marketing tools" on Gemini AI Overviews.',
    },
    {
      id: 'alert2',
      icon: '🎯',
      title: 'New Competitor Detected',
      priority: 'Medium',
      time: '1d ago',
      description: 'A new player, "AI-Vantage", has started appearing in your tracked keyword set.',
    },
     {
      id: 'alert3',
      icon: '💡',
      title: 'Content Decay Alert',
      priority: 'Low',
      time: '3d ago',
      description: 'Your "Ultimate Guide to AI SEO" has dropped 2 positions on ChatGPT.',
    },
  ],
};
