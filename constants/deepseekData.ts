import type { DeepSeekData, DeepSeekQuickAction } from '../types';

export const DEEPSEEK_DATA: DeepSeekData = {
    capabilities: [
        {
            id: 'architecture',
            icon: 'fas fa-sitemap',
            title: 'Technical Architecture',
            description: 'Detailed system architecture breakdowns and infrastructure analysis for technical audiences.',
            metric1: { value: '92%', label: 'Completeness' },
            metric2: { value: '15', label: 'Diagrams' }
        },
        {
            id: 'algorithms',
            icon: 'fas fa-calculator',
            title: 'Algorithm Explanations',
            description: 'In-depth algorithm analysis with complexity breakdowns and optimization strategies.',
            metric1: { value: '88%', label: 'Clarity' },
            metric2: { value: '24', label: 'Algorithms' }
        },
        {
            id: 'structured-data',
            icon: 'fas fa-database',
            title: 'Structured Data Formats',
            description: 'JSON-LD, Schema.org, and custom structured data implementation for technical content.',
            metric1: { value: '95%', label: 'Validated' },
            metric2: { value: '32', label: 'Schemas' }
        },
        {
            id: 'code-examples',
            icon: 'fas fa-terminal',
            title: 'Code-Heavy Examples',
            description: 'Comprehensive code examples with multiple language support and best practices.',
            metric1: { value: '85%', label: 'Coverage' },
            metric2: { value: '8', label: 'Languages' }
        }
    ],
    stats: {
        technicalAccuracy: 96,
        codeExamples: 142,
        languagesSupported: 8,
        developerEngagement: '+42%'
    }
};

export const DEEPSEEK_QUICK_ACTIONS_DATA: DeepSeekQuickAction[] = [
    { id: 'generate-code-snippet', icon: 'fas fa-laptop-code', text: 'Generate Snippet' },
    { id: 'refactor-code', icon: 'fas fa-recycle', text: 'Refactor Code' },
    { id: 'explain-algorithm', icon: 'fas fa-project-diagram', text: 'Explain Algorithm' },
    { id: 'create-architecture-diagram', icon: 'fas fa-sitemap', text: 'Create Diagram' },
];