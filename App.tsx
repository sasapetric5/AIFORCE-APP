import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { GeoCommandCenter } from './components/geo/GeoCommandCenter';
import { AiVisibilityAnalyzer } from './components/analyzer/AiVisibilityAnalyzer';
import { Optimization } from './components/Optimization';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { TechnicalGeoAuditor } from './components/auditor/TechnicalGeoAuditor';
import { AnalysisLoader } from './components/analysis/AnalysisLoader';
import { CompetitiveIntelligence } from './components/CompetitiveIntelligence';
import { ChatGptOptimizer } from './components/ChatGptOptimizer';
import { PerplexitySpecialist } from './components/perplexity/PerplexitySpecialist';
import { GeminiOptimizer } from './components/gemini/GeminiOptimizer';
import { ClaudeCompatibility } from './components/claude/ClaudeCompatibility';
import { DeepSeekSpecialist } from './components/deepseek/DeepSeekSpecialist';
import { CopilotReady } from './components/copilot/CopilotReady';
import { SplashScreen } from './components/SplashScreen';
import { SourceIntelligence } from './components/SourceIntelligence';
import { BrandPowerScorecard } from './components/brand_power_scorecard/BrandPowerScorecard';
import { CompetitiveDominationDashboard } from './components/domination/CompetitiveDominationDashboard';
import { PredictiveVisibilityForecaster } from './components/forecaster/PredictiveVisibilityForecaster';
import { TopicConquestEngine } from './components/topic_conquest/TopicConquestEngine';
import { GlobalExpansionEngine } from './components/global_expansion/GlobalExpansionEngine';
import { ApiIntegrationHub } from './components/ApiIntegrationHub';
import { IndustryTemplates } from './components/IndustryTemplates';
import { PerformanceAnalytics } from './components/performance_analytics/PerformanceAnalytics';
import { ContentSyndication } from './components/syndication/ContentSyndication';
import { VideoContentOptimizer } from './components/video/VideoContentOptimizer';
import { UniversalPlatformIntegrationHub } from './components/universal_platform_hub/UniversalPlatformIntegrationHub';
import { ProductSchemaFactory } from './components/product_schema_factory/ProductSchemaFactory';
import { AiProductDescriptionOptimizer } from './components/product_description_optimizer/AiProductDescriptionOptimizer';
// FIX: Correcting import path for Chatbot. The original error "File '.../Chatbot.tsx' is not a module" is caused by placeholder content in Chatbot.tsx. By providing valid content for Chatbot.tsx, this import will work correctly.
import { Chatbot } from './components/Chatbot';
// FIX: Correcting import for types. The original error "File '.../types.ts' is not a module" is caused by placeholder content in types.ts. By providing valid content for types.ts, this import will work correctly. Using `import type` as it only imports type definitions.
import type { AnalysisResult, GeoData, CompetitiveIntelligenceData, TechnicalGeoAuditorData, HistoryItem } from './types';

import { GEO_PLATFORMS, GEO_CONTENT_MATRIX, GEO_TREND_DATA, GEO_ALERTS, GEO_GOALS } from './constants/geoCommandCenterData';
import { ANALYZER_DATA } from './constants/analyzerData';
import { COMPETITIVE_INTELLIGENCE_DATA } from './constants/competitiveIntelligenceData';
import { 
    AUDITOR_OVERVIEW_DATA, 
    CRAWLER_COMPATIBILITY_DATA, 
    SCHEMA_AUDIT_DATA, 
    RECOMMENDED_SCHEMA_DATA, 
    CORE_VITALS_DATA, 
    PERFORMANCE_TREND_DATA, 
    SECURITY_TRUST_DATA 
} from './constants/auditorData';
// FIX: Import the 'Card' component to resolve the 'Cannot find name 'Card'' error.
import { Card } from './components/Card';

const MOCK_GEO_DATA: GeoData = {
  platforms: GEO_PLATFORMS,
  contentMatrix: GEO_CONTENT_MATRIX,
  trendData: GEO_TREND_DATA,
  alerts: GEO_ALERTS,
  goals: GEO_GOALS,
};

const MOCK_CI_DATA: CompetitiveIntelligenceData = COMPETITIVE_INTELLIGENCE_DATA;

const MOCK_AUDITOR_DATA: TechnicalGeoAuditorData = {
    overview: AUDITOR_OVERVIEW_DATA,
    crawlerCompatibility: CRAWLER_COMPATIBILITY_DATA,
    structuredData: {
        audit: SCHEMA_AUDIT_DATA,
        recommendations: RECOMMENDED_SCHEMA_DATA,
    },
    performance: {
        vitals: CORE_VITALS_DATA,
        trendData: PERFORMANCE_TREND_DATA,
    },
    security: SECURITY_TRUST_DATA,
};


const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  geo: MOCK_GEO_DATA,
  analyzer: ANALYZER_DATA,
  competitiveIntelligence: MOCK_CI_DATA,
  technicalGeoAuditor: MOCK_AUDITOR_DATA,
};


const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history from local storage on initial render
    try {
        const savedHistory = localStorage.getItem('ai-force-history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    } catch (error) {
        console.error("Failed to load history from localStorage", error);
        localStorage.removeItem('ai-force-history');
    }
  }, []);

  const addToHistory = (content: string) => {
    setHistory(prevHistory => {
        const newItem: HistoryItem = {
            id: Date.now(),
            content: content,
            createdAt: new Date().toISOString(),
        };
        // Add new item to the top and limit to 30
        const newHistory = [newItem, ...prevHistory].slice(0, 30);
        localStorage.setItem('ai-force-history', JSON.stringify(newHistory));
        return newHistory;
    });
  };

  const deleteFromHistory = (id: number) => {
    setHistory(prevHistory => {
        const newHistory = prevHistory.filter(item => item.id !== id);
        localStorage.setItem('ai-force-history', JSON.stringify(newHistory));
        return newHistory;
    });
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setHistory(prevHistory => {
        const newHistory = [...prevHistory, item].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Limit to 30 just in case
        const limitedHistory = newHistory.slice(0, 30);
        localStorage.setItem('ai-force-history', JSON.stringify(limitedHistory));
        return limitedHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai-force-history');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // When the view changes, scroll the window to the top to ensure
    // the user sees the start of the new module content. This addresses
    // the issue of some modules appearing scrolled to the bottom.
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeView]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleSetActiveView = (viewId: string) => {
    setActiveView(viewId);
    setIsSidebarOpen(false); // Close sidebar on mobile when a new view is selected
  };
  
  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'geo_command_center') {
      handleSetActiveView('geo_command_center');
    } else if (moduleId === 'ai_visibility_analyzer') {
      handleSetActiveView('analytics');
    } else if (moduleId === 'content_optimization_engine') {
      handleSetActiveView('optimization');
    } else if (moduleId === 'technical_geo_auditor') {
      handleSetActiveView('technical_geo_auditor');
    } else if (moduleId === 'competitive_intelligence') {
      handleSetActiveView('competitive_intelligence');
    } else if (moduleId === 'chatgpt_optimizer') {
      handleSetActiveView('chatgpt_optimizer');
    } else if (moduleId === 'perplexity_specialist') {
      handleSetActiveView('perplexity_specialist');
    } else if (moduleId === 'gemini_optimizer') {
      handleSetActiveView('gemini_optimizer');
    } else if (moduleId === 'claude_compatibility') {
      handleSetActiveView('claude_compatibility');
    } else if (moduleId === 'deepseek_specialist') {
      handleSetActiveView('deepseek_specialist');
    } else if (moduleId === 'copilot_ready') {
        handleSetActiveView('copilot_ready');
    } else if (moduleId === 'source_intelligence') {
        handleSetActiveView('source_intelligence');
    } else if (moduleId === 'brand_power_scorecard') {
        handleSetActiveView('brand_power_scorecard');
    } else if (moduleId === 'reporting_hub') {
      handleSetActiveView('reports');
    } else if (moduleId === 'competitive_domination_dashboard') {
        handleSetActiveView('competitive_domination_dashboard');
    } else if (moduleId === 'predictive_visibility_forecaster') {
        handleSetActiveView('predictive_visibility_forecaster');
    } else if (moduleId === 'topic_conquest_engine') {
        handleSetActiveView('topic_conquest_engine');
    } else if (moduleId === 'global_expansion_engine') {
        handleSetActiveView('global_expansion_engine');
    } else if (moduleId === 'api_integration_hub') {
        handleSetActiveView('api_integration_hub');
    } else if (moduleId === 'industry_templates') {
        handleSetActiveView('industry_templates');
    } else if (moduleId === 'performance_analytics') {
        handleSetActiveView('performance_analytics');
    } else if (moduleId === 'content_syndication_amplification') {
        handleSetActiveView('content_syndication_amplification');
    } else if (moduleId === 'universal_platform_integration_hub') {
        handleSetActiveView('universal_platform_integration_hub');
    } else if (moduleId === 'video_content_optimization') {
        handleSetActiveView('video_content_optimization');
    } else if (moduleId === 'product_schema_factory') {
        handleSetActiveView('product_schema_factory');
    }
    else if (moduleId === 'ai_product_description_optimizer') {
        handleSetActiveView('ai_product_description_optimizer');
    }
    else {
      alert(`Opening ${moduleId} module...`);
    }
  };
  
  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setAnalysisData(null);
    setAnalysisError(null);
    setAnalyzedUrl(url);

    // Schemas for Gemini JSON response
    const GeoPlatformSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, name: { type: Type.STRING }, score: { type: Type.NUMBER },
        trend: { type: Type.NUMBER }, icon: { type: Type.STRING },
      }, required: ['id', 'name', 'score', 'trend', 'icon']
    };
    const GeoContentSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, title: { type: Type.STRING }, gemini: { type: Type.NUMBER },
        chatgpt: { type: Type.NUMBER }, perplexity: { type: Type.NUMBER }, claude: { type: Type.NUMBER },
        copilot: { type: Type.NUMBER }, deepseek: { type: Type.NUMBER }, mistral: { type: Type.NUMBER },
        llama: { type: Type.NUMBER }, poe: { type: Type.NUMBER },
      }, required: ['id', 'title', 'gemini', 'chatgpt', 'perplexity', 'claude', 'copilot', 'deepseek', 'mistral', 'llama', 'poe']
    };
    const AnalyzerPlatformSchema = {
        type: Type.OBJECT, properties: {
            id: { type: Type.STRING }, name: { type: Type.STRING }, icon: { type: Type.STRING },
            score: { type: Type.NUMBER }, citations: { type: Type.NUMBER }, trend: { type: Type.STRING },
            position: { type: Type.STRING }, growth: { type: Type.NUMBER },
            metrics: {
                type: Type.OBJECT, properties: {
                    answer_appearance: { type: Type.NUMBER }, citation_quality: { type: Type.NUMBER }, prompt_coverage: { type: Type.NUMBER },
                }, required: ['answer_appearance', 'citation_quality', 'prompt_coverage']
            }
        }, required: ['id', 'name', 'icon', 'score', 'citations', 'trend', 'position', 'growth', 'metrics']
    };
    const AnalyzerContentSchema = {
        type: Type.OBJECT, properties: {
            id: { type: Type.NUMBER }, title: { type: Type.STRING }, url: { type: Type.STRING },
            platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
            citations: { type: Type.NUMBER }, visibility: { type: Type.NUMBER }, growth: { type: Type.NUMBER },
            metrics: {
                type: Type.OBJECT, properties: {
                    engagement: { type: Type.NUMBER }, depth: { type: Type.NUMBER }, relevance: { type: Type.NUMBER },
                }, required: ['engagement', 'depth', 'relevance']
            }
        }, required: ['id', 'title', 'url', 'platforms', 'citations', 'visibility', 'growth', 'metrics']
    };

    const AuditorOverviewMetricSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, icon: { type: Type.STRING }, value: { type: Type.STRING },
        label: { type: Type.STRING }, trend: { type: Type.STRING },
        trendDirection: { type: Type.STRING },
        borderColor: { type: Type.STRING }
      }, required: ['id', 'icon', 'value', 'label', 'trend', 'trendDirection', 'borderColor']
    };
    const CrawlerTestSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, icon: { type: Type.STRING }, name: { type: Type.STRING },
        description: { type: Type.STRING }, status: { type: Type.STRING }
      }, required: ['id', 'icon', 'name', 'description', 'status']
    };
    const CrawlerCompatibilitySchema = {
      type: Type.OBJECT, properties: {
        tests: { type: Type.ARRAY, items: CrawlerTestSchema },
        overallScore: { type: Type.NUMBER },
        chartData: { type: Type.ARRAY, items: {
            type: Type.OBJECT, properties: {
                name: { type: Type.STRING }, value: { type: Type.NUMBER }, fill: { type: Type.STRING }
            }, required: ['name', 'value', 'fill']
        }}
      }, required: ['tests', 'overallScore', 'chartData']
    };
    const SchemaAuditItemSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING },
        status: { type: Type.STRING }
      }, required: ['id', 'name', 'description', 'status']
    };
    const RecommendedSchemaSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, name: { type: Type.STRING }
      }, required: ['id', 'name']
    };
    const CoreVitalSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, name: { type: Type.STRING }, value: { type: Type.STRING },
        rating: { type: Type.STRING },
        target: { type: Type.STRING }, score: { type: Type.NUMBER }
      }, required: ['id', 'name', 'value', 'rating', 'target', 'score']
    };
    const PerformanceTrendPointSchema = {
      type: Type.OBJECT, properties: {
        name: { type: Type.STRING },
        'Performance Score': { type: Type.NUMBER },
        'AI Crawler Score': { type: Type.NUMBER }
      }, required: ['name', 'Performance Score', 'AI Crawler Score']
    };
    const SecuritySignalSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, name: { type: Type.STRING }, score: { type: Type.STRING },
        rating: { type: Type.STRING }
      }, required: ['id', 'name', 'score', 'rating']
    };
    const SecuritySectionSchema = {
      type: Type.OBJECT, properties: {
        id: { type: Type.STRING }, title: { type: Type.STRING },
        signals: { type: Type.ARRAY, items: SecuritySignalSchema }
      }, required: ['id', 'title', 'signals']
    };

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an expert AI Visibility Analyst for a SaaS platform called "AI FORCE".
        Your task is to analyze the provided input (which can be a URL, an app name/store link, or raw text) and generate a comprehensive visibility report in a single JSON object.

        Input to analyze: "${url}"

        Generate plausible but realistic data for all fields. Create data for 5 key platforms (Gemini, ChatGPT, Perplexity, Claude, Copilot). Generate data for 3 content pieces and 3 competitors.

        Also generate a detailed competitive intelligence report.
        - For the overview, provide realistic metrics for market position, share growth, competitors, and opportunities.
        - For market share, provide data for the user's brand and 3 competitors. The shares should add up to a reasonable number (e.g., 80-90), leaving some for "Others".
        - Generate 3 detailed, actionable opportunities with different types and impacts.
        - Generate 3 strategic alerts with different priorities and relevant icons.
        
        Also generate a detailed technical GEO audit report.
        - For overview, provide 4 metrics with icons, values, labels, trends, etc.
        - For crawler compatibility, provide data for 5 crawlers (including Google, ChatGPT, Perplexity, Claude, Copilot) with varied statuses. Provide an overall score and chart data that reflects the test statuses.
        - For structured data, provide an audit of 5 common schema types with varied statuses, and 4 recommended schemas.
        - For performance, provide data for 4 core vitals with varied ratings, and trend data for 7 points in time.
        - For security, provide 3 sections (e.g., Protocols, Authority, AI Trust) with 4 signals each, with varied ratings.

        The JSON output must conform to the structure defined in the response schema. Base your analysis on the public content of the URL and its domain authority.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              geo: {
                type: Type.OBJECT,
                properties: {
                  platforms: { type: Type.ARRAY, items: GeoPlatformSchema },
                  contentMatrix: { type: Type.ARRAY, items: GeoContentSchema },
                  trendData: { type: Type.OBJECT, properties: {
                      labels: { type: Type.ARRAY, items: { type: Type.STRING }},
                      scores: { type: Type.ARRAY, items: { type: Type.NUMBER}},
                      competitorScores: { type: Type.ARRAY, items: { type: Type.NUMBER}}
                  }},
                  alerts: { type: Type.ARRAY, items: {
                      type: Type.OBJECT, properties: {
                          id: { type: Type.STRING }, icon: { type: Type.STRING }, title: { type: Type.STRING },
                          description: { type: Type.STRING }, time: { type: Type.STRING }, type: { type: Type.STRING }
                      }
                  }},
                  goals: { type: Type.ARRAY, items: {
                      type: Type.OBJECT, properties: {
                          id: { type: Type.STRING }, title: { type: Type.STRING }, target: { type: Type.NUMBER },
                          current: { type: Type.NUMBER }, metric: { type: Type.STRING }
                      }
                  }}
                }
              },
              analyzer: {
                type: Type.OBJECT,
                properties: {
                    platforms: { type: Type.ARRAY, items: AnalyzerPlatformSchema },
                    citations: { type: Type.OBJECT, properties: {
                        total: { type: Type.NUMBER }, average: { type: Type.NUMBER }, growth: { type: Type.NUMBER },
                        trend: { type: Type.ARRAY, items: { type: Type.NUMBER }}
                    }},
                    competitors: { type: Type.ARRAY, items: {
                        type: Type.OBJECT, properties: {
                            name: { type: Type.STRING }, overall: { type: Type.NUMBER },
                            platforms: { type: Type.OBJECT, properties: {
                                chatgpt: { type: Type.NUMBER }, perplexity: { type: Type.NUMBER }, gemini: { type: Type.NUMBER },
                                claude: { type: Type.NUMBER }, copilot: { type: Type.NUMBER }
                            }}
                        }
                    }},
                    content_performance: { type: Type.ARRAY, items: AnalyzerContentSchema },
                    insights: { type: Type.ARRAY, items: {
                        type: Type.OBJECT, properties: {
                            icon: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING },
                            action: { type: Type.STRING }
                        }
                    }}
                }
              },
               competitiveIntelligence: {
                type: Type.OBJECT,
                properties: {
                  overview: { type: Type.OBJECT, properties: {
                      marketPosition: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, trend: { type: Type.STRING }}},
                      shareGrowth: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, trend: { type: Type.STRING }}},
                      activeCompetitors: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, trend: { type: Type.STRING }}},
                      identifiedOpportunities: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, trend: { type: Type.STRING }}},
                  }},
                  marketShare: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, share: { type: Type.NUMBER }}}},
                  opportunities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                      id: { type: Type.STRING }, type: { type: Type.STRING }, impact: { type: Type.STRING },
                      title: { type: Type.STRING }, description: { type: Type.STRING },
                      metrics: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, label: { type: Type.STRING }}}}
                  }}},
                  alerts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                      id: { type: Type.STRING }, icon: { type: Type.STRING }, title: { type: Type.STRING },
                      priority: { type: Type.STRING }, time: { type: Type.STRING }, description: { type: Type.STRING }
                  }}},
                }
              },
               technicalGeoAuditor: {
                type: Type.OBJECT,
                properties: {
                  overview: { type: Type.ARRAY, items: AuditorOverviewMetricSchema },
                  crawlerCompatibility: CrawlerCompatibilitySchema,
                  structuredData: { type: Type.OBJECT, properties: {
                      audit: { type: Type.ARRAY, items: SchemaAuditItemSchema },
                      recommendations: { type: Type.ARRAY, items: RecommendedSchemaSchema }
                  }},
                  performance: { type: Type.OBJECT, properties: {
                      vitals: { type: Type.ARRAY, items: CoreVitalSchema },
                      trendData: { type: Type.ARRAY, items: PerformanceTrendPointSchema }
                  }},
                  security: { type: Type.ARRAY, items: SecuritySectionSchema }
                }
              }
            }
          }
        }
      });
      
      const newAnalysisData = JSON.parse(response.text) as AnalysisResult;
      setAnalysisData(newAnalysisData);
      
      if (newAnalysisData) {
        const geoScore = Math.round(
          (newAnalysisData.geo?.platforms?.reduce((acc, p) => acc + p.score, 0) / (newAnalysisData.geo?.platforms?.length || 1)) || 0
        );
        const criticalIssues = newAnalysisData.technicalGeoAuditor?.overview?.find(m => m.id === 'critical-issues')?.value || 'N/A';
        const topPlatform = newAnalysisData.geo?.platforms?.reduce((max, p) => p.score > max.score ? p : max, newAnalysisData.geo.platforms[0]);
        const worstPlatform = newAnalysisData.geo?.platforms?.reduce((min, p) => p.score < min.score ? p : min, newAnalysisData.geo.platforms[0]);

        const summaryHtml = `
            <h4>Analysis for: ${url}</h4>
            <ul style="list-style-type: disc; margin-left: 20px; font-size: 0.9em;">
                <li><strong>Overall GEO Score:</strong> ${geoScore}/100</li>
                <li><strong>Technical Issues:</strong> ${criticalIssues} critical issues found.</li>
                <li><strong>Top Platform:</strong> ${topPlatform.name} (Score: ${topPlatform.score})</li>
                <li><strong>Needs Improvement:</strong> ${worstPlatform.name} (Score: ${worstPlatform.score})</li>
            </ul>
        `;
        addToHistory(summaryHtml);
      }

      setActiveView('geo_command_center');
    } catch (e) {
      console.error("Analysis failed:", e);
      setAnalysisError("The AI analysis failed. This could be due to a content policy violation, a network error, or an invalid API key. Please check the console for more details and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderActiveView = () => {
    if (isAnalyzing) return <AnalysisLoader />;
    if (analysisError) return <Card title="Analysis Error"><p className="text-red-400">{analysisError}</p></Card>;

    switch (activeView) {
        // --- Modules that do NOT require analysis data ---
        case 'dashboard': return <Dashboard onModuleClick={handleModuleClick} />;
        case 'optimization': return <Optimization />;
        case 'reports': return <Reports history={history} onDelete={deleteFromHistory} onClearAll={clearHistory} onRestore={restoreHistoryItem} />;
        case 'settings': return <Settings />;
        case 'chatgpt_optimizer': return <ChatGptOptimizer />;
        case 'perplexity_specialist': return <PerplexitySpecialist />;
        case 'gemini_optimizer': return <GeminiOptimizer />;
        case 'claude_compatibility': return <ClaudeCompatibility />;
        case 'deepseek_specialist': return <DeepSeekSpecialist />;
        case 'copilot_ready': return <CopilotReady />;
        case 'brand_power_scorecard': return <BrandPowerScorecard />;
        case 'competitive_domination_dashboard': return <CompetitiveDominationDashboard />;
        case 'predictive_visibility_forecaster': return <PredictiveVisibilityForecaster />;
        case 'topic_conquest_engine': return <TopicConquestEngine />;
        case 'global_expansion_engine': return <GlobalExpansionEngine />;
        case 'api_integration_hub': return <ApiIntegrationHub />;
        case 'industry_templates': return <IndustryTemplates />;
        case 'performance_analytics': return <PerformanceAnalytics />;
        case 'content_syndication_amplification': return <ContentSyndication />;
        case 'video_content_optimization': return <VideoContentOptimizer />;
        case 'universal_platform_integration_hub': return <UniversalPlatformIntegrationHub />;
        case 'product_schema_factory': return <ProductSchemaFactory />;
        case 'ai_product_description_optimizer': return <AiProductDescriptionOptimizer />;

        // --- Modules that DO require analysis data (or handle the null case) ---
        case 'geo_command_center':
            return <GeoCommandCenter
                        data={analysisData?.geo ?? null}
                        onAnalyze={handleAnalyze}
                        isLoading={isAnalyzing}
                        onGeneration={addToHistory}
                    />;
        case 'analytics':
            return <AiVisibilityAnalyzer 
                        data={analysisData?.analyzer} 
                        onAnalyze={handleAnalyze} 
                        isLoading={isAnalyzing}
                    />;
        case 'technical_geo_auditor':
            return <TechnicalGeoAuditor 
                        data={analysisData?.technicalGeoAuditor}
                        onAnalyze={handleAnalyze}
                        isLoading={isAnalyzing}
                    />;
        case 'competitive_intelligence':
            return <CompetitiveIntelligence 
                        data={analysisData?.competitiveIntelligence} 
                        onAnalyze={handleAnalyze}
                        isLoading={isAnalyzing}
                    />;
        case 'source_intelligence':
            return <SourceIntelligence 
                        analyzedUrl={analyzedUrl} 
                        onAnalyze={handleAnalyze}
                        isLoading={isAnalyzing}
                    />;
        
        default:
            return <Dashboard onModuleClick={handleModuleClick} />;
    }
  };


  return (
    <>
      {showSplash ? <SplashScreen /> : (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'}`}>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            activeModule={activeView} 
            setActiveModule={handleSetActiveView}
          />
          <div className="md:ml-64 flex flex-col min-h-screen">
            <Header theme={theme} toggleTheme={toggleTheme} onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-grow p-4 sm:p-6 lg:p-8">
              {activeView !== 'dashboard' && (
                  <button
                      onClick={() => handleSetActiveView('dashboard')}
                      className="mb-6 flex items-center gap-2 text-sm font-semibold text-medium-text-light dark:text-medium-text hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                      aria-label="Back to dashboard"
                  >
                      <i className="fas fa-arrow-left"></i>
                      Back to Dashboard
                  </button>
              )}
              {renderActiveView()}
            </main>
          </div>
          <Chatbot />
        </div>
      )}
    </>
  );
};

export default App;