import React from 'react';

// --- General ---
export interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  features: string[];
  status: 'Active' | 'Coming Soon';
  borderColor: string;
  usageGuide?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

// --- Dashboard ---
export interface TrendDataPoint {
  date: string;
  'Visibility Score': number;
  'Competitor Score': number;
}

export interface PlatformScore {
  name: string;
  score: number;
  color: string;
}

export type PlatformName = 'ChatGPT' | 'Gemini' | 'Perplexity' | 'Claude' | 'Copilot' | 'DeepSeek' | 'Mistral' | 'Llama' | 'Poe';

export interface ContentPerformanceItem {
  title: string;
  platform: PlatformName;
  citations: number;
  traffic: string;
  conversion: string;
}

// --- App-level Analysis ---
export interface AnalysisResult {
  geo: GeoData;
  analyzer: AnalyzerData;
  competitiveIntelligence: CompetitiveIntelligenceData;
  technicalGeoAuditor: TechnicalGeoAuditorData;
}

// --- GEO Command Center ---
export interface GeoPlatform {
  id: string;
  name: string;
  score: number;
  trend: number;
  icon: string;
}

export interface GeoContent {
  id: string;
  title: string;
  gemini: number;
  chatgpt: number;
  perplexity: number;
  claude: number;
  copilot: number;
  deepseek: number;
  mistral: number;
  llama: number;
  poe: number;
}

export interface GeoTrendData {
  labels: string[];
  scores: number[];
  competitorScores: number[];
}

export interface GeoAlert {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  type: 'critical' | 'opportunity' | 'success';
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  metric: string;
}

export interface GeoData {
  platforms: GeoPlatform[];
  contentMatrix: GeoContent[];
  trendData: GeoTrendData;
  alerts: GeoAlert[];
  goals: Goal[];
}

// --- AI Visibility Analyzer ---
export interface AnalyzerPlatform {
    id: string;
    name: string;
    icon: string;
    score: number;
    citations: number;
    trend: 'up' | 'stable' | 'down';
    position: string;
    growth: number;
    metrics: {
        answer_appearance: number;
        citation_quality: number;
        prompt_coverage: number;
    };
}

export interface CitationData {
    total: number;
    average: number;
    growth: number;
    trend: number[];
}

export interface Competitor {
    name: string;
    overall: number;
    platforms: { [key in PlatformName as Lowercase<key>]?: number };
}

export interface AnalyzerContent {
    id: number;
    title: string;
    url: string;
    platforms: string[];
    citations: number;
    visibility: number;
    growth: number;
    metrics: {
        engagement: number;
        depth: number;
        relevance: number;
    };
}

export interface Insight {
    icon: string;
    title: string;
    description: string;
    action: string;
}

export interface AnalyzerData {
    platforms: AnalyzerPlatform[];
    citations: CitationData;
    competitors: Competitor[];
    content_performance: AnalyzerContent[];
    insights: Insight[];
}

export interface AnalyzerTrendData {
    labels: string[];
    your_visibility: number[];
    competitor_avg: number[];
}

export interface AnalyzerQuickAction {
    id: string;
    title: string;
    description: string;
}

export interface AnalyzerAlert {
    id: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    icon: string;
    title: string;
    message: string;
    time: string;
}

// --- Competitive Intelligence ---
export interface CIOpportunity {
    id: string;
    type: string;
    impact: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
    metrics: { value: string; label: string; }[];
}

export interface CIAlert {
    id: string;
    icon: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    time: string;
    description: string;
}

export interface CompetitiveIntelligenceData {
  overview: {
    marketPosition: { value: string; trend: string; };
    shareGrowth: { value: string; trend: string; };
    activeCompetitors: { value: string; trend: string; };
    identifiedOpportunities: { value: string; trend: string; };
  };
  marketShare: { name: string; share: number; }[];
  opportunities: CIOpportunity[];
  alerts: CIAlert[];
}

// --- Technical Geo Auditor ---
export interface AuditorOverviewMetric {
    id: string;
    icon: string;
    value: string;
    label: string;
    trend: string;
    trendDirection: 'up' | 'down';
    borderColor: string;
}

export interface CrawlerCompatibilityData {
    tests: {
        id: string;
        icon: string;
        name: string;
        description: string;
        status: 'PASS' | 'WARNING' | 'FAIL';
    }[];
    overallScore: number;
    chartData: { name: string; value: number; fill: string; }[];
}

export interface SchemaAuditItem {
    id: string;
    name: string;
    description: string;
    status: 'PRESENT' | 'PARTIAL' | 'MISSING';
}

export interface RecommendedSchema {
    id: string;
    name: string;
}

export interface CoreVital {
    id: string;
    name: string;
    value: string;
    rating: 'good' | 'needs_improvement' | 'poor';
    target: string;
    score: number;
}

export interface PerformanceTrendPoint {
    name: string;
    'Performance Score': number;
    'AI Crawler Score': number;
}

export interface SecuritySection {
    id: string;
    title: string;
    signals: {
        id: string;
        name: string;
        score: string;
        rating: 'excellent' | 'good' | 'fair' | 'poor';
    }[];
}

export interface TechnicalGeoAuditorData {
    overview: AuditorOverviewMetric[];
    crawlerCompatibility: CrawlerCompatibilityData;
    structuredData: {
        audit: SchemaAuditItem[];
        recommendations: RecommendedSchema[];
    };
    performance: {
        vitals: CoreVital[];
        trendData: PerformanceTrendPoint[];
    };
    security: SecuritySection[];
}

export interface AuditorQuickActionItem {
    id: string;
    icon: string;
    text: string;
}

// --- Optimization ---
export interface ScoreMetrics {
  overall: number;
  structure: number;
  semanticDepth: number;
  entityCoverage: number;
  qaReadiness: number;
  platformCompatibility: number;
}

export interface Suggestion {
  id: number;
  type: 'Structure' | 'Semantic' | 'Format' | 'Content';
  impact: 'High' | 'Medium' | 'Low';
  text: string;
  applied: boolean;
}

export interface ConceptMapData {
  nodes: { id: string; label: string; type: 'main' | 'related' }[];
  edges: { source: string; target: string; label: string }[];
}


// --- ChatGPT Optimizer ---
export interface ChatGptOverviewData {
    score: number;
    citations: number;
    position: string;
    optimizationScore: number;
}
export interface ConversationPattern {
    name: string;
    'Citation Frequency': number;
}
export interface CitationFactor {
    name: string;
    score: number;
    color: string;
}
export interface GptsCardData {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
}
export interface ChatGptQuickAction {
    id: string;
    icon: string;
    text: string;
}
export interface PromptAnalysisResult {
    score: number;
    suggestions: string[];
}

// --- Perplexity Specialist ---
export interface PerplexityOverviewData {
    score: number;
    citations: number;
    position: string;
    credibility: number;
    trend: string;
    citationTrend: string;
    positionTrend: string;
    credibilityTrend: string;
}
export interface SourceCredibilityAuditItem {
    id: string;
    icon: string;
    title: string;
    description: string;
    score: string;
}
export interface SourceCredibilityInsight {
    id: string;
    icon: string;
    title: string;
    description: string;
}
export interface FreshnessMetric {
    id: string;
    label: string;
    score: number;
    lastUpdated: string;
}
export interface ContentUpdate {
    id: string;
    title: string;
    lastReviewed: string;
    status: 'CURRENT' | 'UPDATE NEEDED' | 'SCHEDULED';
}
export interface ReferenceQualityCardData {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    qualityScore: number;
    referenceCount: number;
}
export interface PerplexityQuickAction {
    id: string;
    icon: string;
    text: string;
}
export interface CitationAnalysisResult {
    score: number;
    suggestions: string[];
}

// --- Gemini Optimizer ---
export interface EeatSignalData {
    id: string;
    title: string;
    icon: string;
    score: number;
    signals: number;
    description: string;
}
export interface QuickOptimizationData {
    id: string;
    title: string;
    icon: string;
}
export interface FormattingInsight {
    id: string;
    icon: string;
    title: string;
    description: string;
}
export interface LocalIntentMetric {
    id: string;
    label: string;
    score: number;
    description: string;
}
export interface LocalTargetingOpportunity {
    id: string;
    market: string;
    coverage: string;
    status: 'STRONG' | 'MODERATE' | 'WEAK';
}
export interface PerspectiveDataPoint {
    subject: string;
    current: number;
    target: number;
}

// --- Claude Optimizer ---
export interface ClaudeMetric {
    value: string;
    label: string;
}
export interface ClaudeCapability {
    id: string;
    icon: string;
    title: string;
    description: string;
    metric1: ClaudeMetric;
    metric2: ClaudeMetric;
}
export interface ClaudeStats {
    compatibilityScore: number;
    optimizedPages: number;
    avgResponseTime: string;
    performanceGain: string;
}
export interface ClaudeData {
    capabilities: ClaudeCapability[];
    stats: ClaudeStats;
}
export interface ClaudeQuickAction {
    id: string;
    icon: string;
    text: string;
}
export interface LogicalFlowAnalysisResult {
    score: number;
    suggestions: string[];
}

// --- DeepSeek Specialist ---
export interface DeepSeekMetric {
    value: string | number;
    label: string;
}
export interface DeepSeekCapability {
    id: string;
    icon: string;
    title: string;
    description: string;
    metric1: DeepSeekMetric;
    metric2: DeepSeekMetric;
}
export interface DeepSeekStats {
    technicalAccuracy: number;
    codeExamples: number;
    languagesSupported: number;
    developerEngagement: string;
}
export interface DeepSeekData {
    capabilities: DeepSeekCapability[];
    stats: DeepSeekStats;
}
export interface DeepSeekQuickAction {
    id: string;
    icon: string;
    text: string;
}
export interface CodeAnalysisResult {
    score: number;
    suggestions: string[];
}

// --- Copilot ---
export interface CopilotCapability {
    id: string;
    icon: string;
    title: string;
    description: string;
    features: string[];
}
export interface CopilotGuide {
    title: string;
    steps: { title: string; description: string }[];
}
export interface CopilotWorkflowTool {
    name: string;
    icon: string;
    url: string;
    connected: boolean;
}
export interface CopilotStats {
    productivityGain: string;
    taskCompletion: number;
    guidesCreated: number;
    efficiencyBoost: string;
}
export interface CopilotQuickAction {
    id: string;
    icon: string;
    text: string;
}

// --- Brand Power Scorecard ---
export interface BrandPowerScorecardData {
    mainScore: number;
    scoreChange: number;
    industryAverage: number;
    components: { label: string; value: number }[];
    breakdownChartData: {
        labels: string[];
        userScores: number[];
        averageScores: number[];
    };
    platformScores: {
        name: string;
        score: number;
        change: number;
        icon: string;
        color: string;
    }[];
    marketPosition: number;
    competitors: { rank: number; name: string; score: number; isUserBrand?: boolean; }[];
    historicalData: BrandPowerScorecardHistoricalData[];
}
export interface BrandPowerScorecardHistoricalData {
    month: string;
    userScore: number;
    averageScore: number;
}

// --- Forecaster ---
export interface ForecasterData {
    overviewCards: {
        value: string;
        label: string;
        trend: string;
        trendDirection: 'up' | 'down';
    }[];
    predictionConfidence: {
        platform: string;
        confidence: number;
        icon: string;
        color: string;
    }[];
    alerts: ProactiveAlertData[];
    scenarios: ScenarioData[];
}
export interface ProactiveAlertData {
    type: 'critical' | 'opportunity' | 'warning';
    icon: string;
    title: string;
    description: string;
}
export interface ScenarioData {
    id: string;
    icon: string;
    title: string;
    description: string;
    metrics: {
        visibility: string;
        eta: string;
        roi: string;
    };
}
export interface Notification {
    id: number;
    message: string;
}

// --- Topic Conquest Engine ---
export interface TopicOpportunity {
    id: string;
    topic: string;
    opportunityScore: number;
    yourCoverage: string;
    topCompetitor: string;
    visibilityImpact: number;
    investment: string;
    aiPreference: number;
}
export interface TopicConquestAnalysis {
    topicOpportunities: TopicOpportunity[];
    aiNichePreferences: { topic: string; preference: number; }[];
    contentDepthComparison: {
        topic: string;
        yourDepth: number;
        competitorADepth: number;
        competitorBDepth: number;
    }[];
}

// --- Global Expansion Engine ---
export interface RegionalAiOptimizationResult {
    modelName: string;
    compatibilityScore: number;
    analysis: string;
    suggestions: string[];
}
export interface CulturalAdaptationResult {
    culturalFitScore: number;
    analysis: string;
    suggestions: string[];
}
export interface TranslationLocalizationResult {
    qualityScore: number;
    suggestedTranslation: string;
    localizationNotes: string[];
}
export interface RegulatoryComplianceChecklistItem {
    area: string;
    status: 'PASS' | 'WARNING' | 'FAIL' | 'N/A';
    notes: string;
}
export interface GlobalGeoAnalysisResult {
    regionalAiOptimization: RegionalAiOptimizationResult;
    culturalAdaptation: CulturalAdaptationResult;
    translationLocalization: TranslationLocalizationResult;
    regulatoryCompliance: {
        complianceRisk: 'Low' | 'Medium' | 'High';
        checklist: RegulatoryComplianceChecklistItem[];
    };
}

// --- Video Content Optimizer ---
export interface VideoAnalysisResult {
    enrichedTranscript: {
        original: string;
        enriched: string;
    };
    visualTags: string[];
    thumbnailScore: number;
    voiceSearchScore: number;
    videoAppearances: number;
    visualCitations: number;
}

// --- History ---
export interface HistoryItem {
  id: number;
  content: string;
  createdAt: string;
}
