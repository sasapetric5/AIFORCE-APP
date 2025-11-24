import type { AnalyzerPlatform, CitationData, Competitor, AnalyzerContent, Insight } from '../types';

interface AnalyzerData {
    platforms: AnalyzerPlatform[];
    citations: CitationData;
    competitors: Competitor[];
    content_performance: AnalyzerContent[];
    insights: Insight[];
}

export const ANALYZER_DATA: AnalyzerData = {
    platforms: [
        {
            id: 'chatgpt',
            name: "ChatGPT",
            icon: "🤖",
            score: 85,
            citations: 124,
            trend: "up",
            position: "#2",
            growth: 12,
            metrics: {
                answer_appearance: 45,
                citation_quality: 78,
                prompt_coverage: 62
            }
        },
        {
            id: 'perplexity',
            name: "Perplexity",
            icon: "🔮",
            score: 89,
            citations: 98,
            trend: "stable",
            position: "#1",
            growth: 8,
            metrics: {
                answer_appearance: 52,
                citation_quality: 85,
                prompt_coverage: 71
            }
        },
        {
            id: 'gemini',
            name: "Gemini",
            icon: "🌐",
            score: 92,
            citations: 152,
            trend: "up",
            position: "#1",
            growth: 18,
            metrics: {
                answer_appearance: 68,
                citation_quality: 88,
                prompt_coverage: 79
            }
        },
        {
            id: 'claude',
            name: "Claude",
            icon: "💬",
            score: 78,
            citations: 75,
            trend: "down",
            position: "#4",
            growth: -5,
            metrics: {
                answer_appearance: 38,
                citation_quality: 72,
                prompt_coverage: 55
            }
        },
        {
            id: 'copilot',
            name: "Copilot",
            icon: "©️",
            score: 81,
            citations: 88,
            trend: "up",
            position: "#3",
            growth: 9,
            metrics: {
                answer_appearance: 41,
                citation_quality: 76,
                prompt_coverage: 64
            }
        },
        {
            id: 'deepseek',
            name: "DeepSeek",
            icon: "🧠",
            score: 75,
            citations: 65,
            trend: "up",
            position: "#6",
            growth: 15,
            metrics: { answer_appearance: 60, citation_quality: 70, prompt_coverage: 65 }
        },
        {
            id: 'mistral',
            name: "Mistral",
            icon: "🌬️",
            score: 79,
            citations: 70,
            trend: "stable",
            position: "#5",
            growth: 7,
            metrics: { answer_appearance: 55, citation_quality: 74, prompt_coverage: 68 }
        },
        {
            id: 'llama',
            name: "Llama",
            icon: "🦙",
            score: 72,
            citations: 58,
            trend: "down",
            position: "#8",
            growth: -3,
            metrics: { answer_appearance: 48, citation_quality: 68, prompt_coverage: 59 }
        },
        {
            id: 'poe',
            name: "Poe",
            icon: "✨",
            score: 76,
            citations: 62,
            trend: "up",
            position: "#7",
            growth: 11,
            metrics: { answer_appearance: 52, citation_quality: 71, prompt_coverage: 63 }
        }
    ],

    citations: {
        total: 537,
        average: 107.4,
        growth: 15.2,
        trend: [45, 52, 61, 73, 85, 98, 112, 124, 135, 152, 168, 185, 203, 224, 245, 267, 290, 314, 339, 365, 392, 420, 449, 479, 510, 537]
    },

    competitors: [
        {
            name: "AI Marketing Pro",
            overall: 85,
            platforms: { chatgpt: 82, perplexity: 88, gemini: 85, claude: 80, copilot: 83, deepseek: 78, mistral: 80, llama: 75, poe: 79 }
        },
        {
            name: "SEO Master",
            overall: 82,
            platforms: { chatgpt: 85, perplexity: 81, gemini: 79, claude: 78, copilot: 82, deepseek: 75, mistral: 77, llama: 72, poe: 76 }
        },
        {
            name: "Content Genius",
            overall: 79,
            platforms: { chatgpt: 76, perplexity: 82, gemini: 75, claude: 74, copilot: 78, deepseek: 72, mistral: 74, llama: 69, poe: 73 }
        },
        {
            name: "Digital Vision",
            overall: 76,
            platforms: { chatgpt: 72, perplexity: 78, gemini: 74, claude: 71, copilot: 75, deepseek: 69, mistral: 71, llama: 66, poe: 70 }
        },
        {
            name: "Tech Innovators",
            overall: 74,
            platforms: { chatgpt: 70, perplexity: 76, gemini: 72, claude: 69, copilot: 73, deepseek: 67, mistral: 69, llama: 64, poe: 68 }
        }
    ],

    content_performance: [
        {
            id: 1,
            title: "Ultimate Guide to AI SEO",
            url: "/ai-seo-guide",
            platforms: ["Gemini", "ChatGPT", "Perplexity", "Mistral"],
            citations: 45,
            visibility: 95,
            growth: 12,
            metrics: {
                engagement: 88,
                depth: 92,
                relevance: 95
            }
        },
        {
            id: 2,
            title: "How to Optimize for Perplexity",
            url: "/perplexity-optimization",
            platforms: ["Perplexity", "Gemini", "DeepSeek"],
            citations: 32,
            visibility: 89,
            growth: 8,
            metrics: {
                engagement: 85,
                depth: 88,
                relevance: 91
            }
        },
        {
            id: 3,
            title: "Top 10 LLM Trends in 2024",
            url: "/llm-trends-2024",
            platforms: ["ChatGPT", "Copilot", "Llama"],
            citations: 28,
            visibility: 85,
            growth: 15,
            metrics: {
                engagement: 82,
                depth: 84,
                relevance: 87
            }
        },
        {
            id: 4,
            title: "Claude 3 Opus vs GPT-4 Analysis",
            url: "/claude-vs-gpt4",
            platforms: ["Claude", "ChatGPT", "Poe"],
            citations: 22,
            visibility: 78,
            growth: -3,
            metrics: {
                engagement: 75,
                depth: 79,
                relevance: 82
            }
        },
        {
            id: 5,
            title: "Copilot Integration Tutorial",
            url: "/copilot-tutorial",
            platforms: ["Copilot", "Gemini"],
            citations: 18,
            visibility: 82,
            growth: 20,
            metrics: {
                engagement: 80,
                depth: 83,
                relevance: 85
            }
        }
    ],

    insights: [
        {
            icon: "🎯",
            title: "Optimization Opportunity",
            description: "Your Claude content shows 15% lower visibility compared to other platforms. Focus on improving content structure for better AI comprehension.",
            action: "View Recommendations"
        },
        {
            icon: "📈",
            title: "Growth Trend Identified",
            description: "Gemini citations increased by 18% in the last 30 days. Consider doubling down on this platform.",
            action: "Analyze Success"
        },
        {
            icon: "⚡",
            title: "Quick Win Available",
            description: "Adding structured data to 3 underperforming pages could increase overall visibility by 8%.",
            action: "Implement Now"
        },
        {
            icon: "🔍",
            title: "Competitor Insight",
            description: "AI Marketing Pro is outperforming you on Perplexity by 12%. Analyze their content strategy.",
            action: "Compare Content"
        }
    ]
};