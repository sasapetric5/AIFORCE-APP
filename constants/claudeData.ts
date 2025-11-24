
import type { ClaudeData, ClaudeQuickAction } from '../types';

export const CLAUDE_DATA: ClaudeData = {
    capabilities: [
        {
            id: 'formatting',
            icon: 'fas fa-file-alt',
            title: 'Detailed Analysis Formatting',
            description: 'Structured formatting for complex analytical content to enhance Claude\'s reasoning capabilities.',
            metric1: { value: '85%', label: 'Optimized' },
            metric2: { value: '12', label: 'Elements' }
        },
        {
            id: 'context',
            icon: 'fas fa-expand-arrows-alt',
            title: 'Context Window Utilization',
            description: 'Maximize effective use of Claude\'s extended context window for comprehensive analysis.',
            metric1: { value: '72%', label: 'Utilization' },
            metric2: { value: '128K', label: 'Tokens' }
        },
        {
            id: 'multi-doc',
            icon: 'fas fa-copy',
            title: 'Multi-document Processing',
            description: 'Optimize content structure for processing multiple documents and cross-referencing.',
            metric1: { value: '68%', label: 'Efficiency' },
            metric2: { value: '5', label: 'Documents' }
        },
        {
            id: 'flow',
            icon: 'fas fa-project-diagram',
            title: 'Logical Flow Enhancement',
            description: 'Improve logical structure and reasoning flow for better Claude comprehension.',
            metric1: { value: '78%', label: 'Coherence' },
            metric2: { value: '15', label: 'Sections' }
        }
    ],
    stats: {
        compatibilityScore: 94,
        optimizedPages: 28,
        avgResponseTime: '3.2s',
        performanceGain: '+18%'
    }
};

export const CLAUDE_QUICK_ACTIONS_DATA: ClaudeQuickAction[] = [
    { id: 'improve-coherence', icon: 'fas fa-link', text: 'Improve Coherence' },
    { id: 'structure-for-analysis', icon: 'fas fa-sitemap', text: 'Structure for Analysis' },
    { id: 'enhance-nuance', icon: 'fas fa-paint-brush', text: 'Enhance Nuance' },
    { id: 'generate-counter-arguments', icon: 'fas fa-balance-scale', text: 'Generate Counter-arguments' },
];
