import type { CopilotCapability, CopilotGuide, CopilotWorkflowTool, CopilotStats, CopilotQuickAction } from '../types';

export const COPILOT_DATA = {
    capabilities: [
        { id: 'guides', icon: 'fas fa-list-ol', title: 'Actionable Step-by-Step Guides', description: 'Clear, sequential instructions for complex tasks with measurable outcomes.', features: ['Task breakdown & sequencing', 'Progress tracking', 'Success metrics', 'Time estimates'] },
        { id: 'snippets', icon: 'fas fa-code', title: 'Code Snippets & Examples', description: 'Ready-to-use code examples with context and integration points.', features: ['Multiple languages', 'Best practices', 'Error handling', 'Testing examples'] },
        { id: 'integration', icon: 'fas fa-random', title: 'Workflow Integration Tips', description: 'Seamless integration strategies for existing tools and processes.', features: ['Tool compatibility', 'Automation scripts', 'API integration', 'Migration strategies'] },
        { id: 'hacks', icon: 'fas fa-bolt', title: 'Productivity Hacks', description: 'Time-saving techniques and efficiency improvements for daily tasks.', features: ['Keyboard shortcuts', 'Automation templates', 'Batch processing', 'Performance tips'] }
    ] as CopilotCapability[],
    guides: [
        { title: 'API Integration Setup', steps: [ { title: 'Get API Credentials', description: 'Register application and obtain API keys' }, { title: 'Configure Environment', description: 'Set up environment variables and dependencies' }, { title: 'Test Endpoints', description: 'Validate API connectivity and response formats' } ] },
        { title: 'Database Migration', steps: [ { title: 'Backup Data', description: 'Create complete database backup' }, { title: 'Schema Analysis', description: 'Review and map database structures' }, { title: 'Execute Migration', description: 'Run migration scripts with validation' } ] }
    ] as CopilotGuide[],
    workflowTools: [
        { name: 'Slack', icon: 'fab fa-slack', url: 'https://slack.com/apps/new', connected: false },
        { name: 'Trello', icon: 'fab fa-trello', url: 'https://trello.com/power-ups/admin', connected: false },
        { name: 'GitHub', icon: 'fab fa-github', url: 'https://github.com/apps/new', connected: false },
        { name: 'Jira', icon: 'fab fa-jira', url: 'https://marketplace.atlassian.com/', connected: false },
        { name: 'VS Code', icon: 'fas fa-code', url: 'https://marketplace.visualstudio.com/vscode', connected: false },
        { name: 'Figma', icon: 'fab fa-figma', url: 'https://www.figma.com/community/plugins', connected: false }
    ] as CopilotWorkflowTool[],
    stats: {
        productivityGain: '3.2x',
        taskCompletion: 89,
        guidesCreated: 156,
        efficiencyBoost: '+47%'
    } as CopilotStats,
    quickActions: [
        { id: 'generate-guide', icon: 'fas fa-play', text: 'Generate Guide' },
        { id: 'get-code', icon: 'fas fa-code-branch', text: 'Get Code Examples' },
        { id: 'optimize-workflow', icon: 'fas fa-puzzle-piece', text: 'Optimize Workflow' },
        { id: 'boost-productivity', icon: 'fas fa-magic', text: 'Boost Productivity' }
    ] as CopilotQuickAction[]
};