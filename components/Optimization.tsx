import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from './Card';
import { AiReadinessScoring } from './optimization/AiReadinessScoring';
import { RealTimeEditor } from './optimization/RealTimeEditor';
import { SemanticEnrichment } from './optimization/SemanticEnrichment';
import { PlatformTemplates } from './optimization/PlatformTemplates';
import type { ScoreMetrics, Suggestion, ConceptMapData } from '../types';

const initialContent = `<h3>Ultimate Guide to AI SEO</h3><p>Artificial intelligence is transforming how search engines work and how users find information. This guide covers essential strategies for optimizing your content for AI-powered search platforms.</p><h4>Key AI Platforms</h4><p>Major AI search platforms include ChatGPT, Perplexity, Google AI Overviews, Claude, and Copilot. Each has unique characteristics that require specific optimization approaches.</p><h4>Optimization Techniques</h4><p>Focus on comprehensive coverage, semantic richness, and clear structure to improve your visibility across all AI platforms.</p>`;

const initialSuggestions: Suggestion[] = [
    { id: 1, type: 'Structure', impact: 'High', text: 'Add a Q&A section about "What is AI SEO?" to improve ChatGPT compatibility', applied: false },
    { id: 2, type: 'Semantic', impact: 'Medium', text: 'Include related terms: "machine learning search", "LLM optimization", "AI search engines"', applied: false },
    { id: 3, type: 'Format', impact: 'High', text: 'Add bullet points listing key AI platforms for better readability', applied: false },
    { id: 4, type: 'Content', impact: 'Medium', text: 'Include specific examples of AI SEO tools and their applications', applied: false },
];

const suggestionTextMap: Record<number, string> = {
    1: '<div class="qa-section"><h4 class="font-semibold mt-2">Q: What is AI SEO and how does it differ from traditional SEO?</h4><p>A: AI SEO focuses on optimizing content for artificial intelligence search platforms like ChatGPT and Perplexity, which prioritize comprehensive, semantically-rich content over traditional keyword-focused approaches.</p></div>',
    2: ' Related terms include <strong>machine learning search optimization</strong>, <strong>LLM (Large Language Model) optimization techniques</strong>, and <strong>AI-powered search engine strategies</strong>.',
    3: '<ul class="my-2"><li class="list-disc ml-6">ChatGPT - Conversational AI assistant</li><li class="list-disc ml-6">Perplexity - Fact-based AI search</li><li class="list-disc ml-6">Google AI Overviews - Comprehensive answer engine</li><li class="list-disc ml-6">Claude - Detailed analysis platform</li><li class="list-disc ml-6">Copilot - Code and content assistant</li></ul>',
    4: ' Popular AI SEO tools include Surfer SEO, Jasper AI, Frase, and MarketMuse, which help optimize content for AI comprehension and visibility.'
};

const formats: Record<string, string> = {
    heading: '<h3>New Section Heading</h3><p>Section content goes here...</p>',
    qa: '<div class="qa-section"><h4 class="font-semibold mt-2">Q: Frequently asked question?</h4><p>A: Comprehensive answer that provides value and addresses user intent.</p></div>',
    list: '<ul><li class="list-disc ml-6">First key point</li><li class="list-disc ml-6">Second important item</li><li class="list-disc ml-6">Third valuable insight</li></ul>',
    bold: '<strong>important concept</strong>',
};

const platformGuidelines: Record<string, string> = {
    chatgpt: "Focus on a conversational, Q&A-driven format. Use clear headings, simple language, and anticipate follow-up questions.",
    perplexity: "Emphasize fact-based statements, data, and clear source citations. Structure it for easy verification. Present information neutrally.",
    gemini: "Create a comprehensive, multi-perspective overview. Use structured lists (bullet points, numbered lists) and cover various user intents to provide a complete answer.",
    claude: "Structure for in-depth analysis. Provide rich contextual background and a logical flow for complex reasoning. Suited for long-form, nuanced content.",
    copilot: "Focus on productivity and integration. Provide actionable, step-by-step instructions, code snippets, or practical examples that help users accomplish a task.",
    deepseek: "Target a technical audience. Focus on code, algorithms, and architectural details. Use precise, technical language.",
    mistral: "Create a balanced and efficient overview. Balance technical details with practical applications. Be concise and to the point.",
    llama: "Adopt an accessible, community-focused tone. Use simple language, address common questions (FAQs), and be beginner-friendly.",
    poe: "Design modular, reusable content snippets. Create self-contained blocks of text (definitions, examples) that can be used by different AI personalities."
};

export const Optimization: React.FC = () => {
  // State for the scoring section
  const [url, setUrl] = useState('https://aiforce.com/ai-seo-guide');
  const [scoringContentText, setScoringContentText] = useState(
    "The ultimate guide to AI SEO explores how artificial intelligence is transforming search engine optimization. Learn about AI-powered tools, techniques, and strategies to improve your website's visibility in AI search engines like ChatGPT, Perplexity, and Google AI Overviews."
  );
  const [scores, setScores] = useState<ScoreMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // State for the interactive editor and its connected modules
  const [editorContent, setEditorContent] = useState(initialContent);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false);
  const [isGeneratingEntities, setIsGeneratingEntities] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [conceptMapData, setConceptMapData] = useState<ConceptMapData | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setScores({
        overall: 72,
        structure: 65,
        semanticDepth: 78,
        entityCoverage: 82,
        qaReadiness: 45,
        platformCompatibility: 70,
      });
      setIsAnalyzing(false);
      alert('✅ AI Readiness Analysis Complete!');
    }, 2000);
  };
  
  const handleApplySuggestion = (id: number) => {
    const suggestionHtml = suggestionTextMap[id];
    if (suggestionHtml) {
        setEditorContent(prev => prev + suggestionHtml);
    }
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, applied: true } : s));
  };

  const handleFormat = (type: string) => {
      setEditorContent(prev => prev + formats[type]);
  };
  
  const handleRefreshSuggestions = async () => {
    setIsRefreshingSuggestions(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const plainTextContent = editorContent.replace(/<[^>]*>/g, ' ');

        const prompt = `
            You are an AI Content Optimization Specialist. Analyze the following text and provide 3-5 specific, actionable optimization suggestions to improve its AI visibility and readability. The suggestions should be diverse, covering Structure, Semantics, Formatting, or Content improvements.
            
            Current Content: "${plainTextContent}"
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "An array of 3 to 5 content improvement suggestions.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING, enum: ['Structure', 'Semantic', 'Format', 'Content'], description: "The category of the suggestion." },
                                    impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: "The potential impact of implementing the suggestion." },
                                    text: { type: Type.STRING, description: "The actionable suggestion text." }
                                },
                                required: ['type', 'impact', 'text']
                            }
                        }
                    },
                    required: ['suggestions']
                }
            }
        });
        
        if (!response) {
            throw new Error("Received an empty or invalid response from the AI model.");
        }

        const result = JSON.parse(response.text);
        const newSuggestions: Omit<Suggestion, 'id' | 'applied'>[] = result.suggestions;
        
        if (newSuggestions && newSuggestions.length > 0) {
            setSuggestions(newSuggestions.map((s, index) => ({
                ...s,
                id: Date.now() + index, // Generate a unique ID
                applied: false
            })));
            alert('✅ New AI suggestions have been generated!');
        } else {
            alert('ℹ️ The AI did not generate new suggestions for this content.');
        }

    } catch (error) {
        console.error("Error refreshing suggestions:", error);
        alert("❌ Failed to refresh suggestions. This could be due to a network issue or an API error. Please check the console for details.");
    } finally {
        setIsRefreshingSuggestions(false);
    }
  };
  
  const handleApplyTemplate = async (platform: string) => {
    if (isApplyingTemplate) return;
    const platformKey = platform as keyof typeof platformGuidelines;
    if (!platformGuidelines[platformKey]) {
        alert(`Guidelines for ${platform} not found.`);
        return;
    }
    
    setIsApplyingTemplate(platform);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const plainTextContent = editorContent.replace(/<[^>]*>/g, ' ').trim();

        if (!plainTextContent) {
            alert("Please add some content to the editor before applying a template.");
            setIsApplyingTemplate(null);
            return;
        }

        const prompt = `
            You are an expert AI Content Strategist. Your task is to take the following content and reformat it into a template optimized for the "${platform}" platform.

            **Platform Optimization Guidelines for ${platform}:**
            ${platformGuidelines[platformKey]}

            **Original Content:**
            "${plainTextContent}"

            **Your Task:**
            Rewrite and restructure the original content to best match the "${platform}" optimization guidelines. The output should be a single block of clean, well-structured HTML. 
            - Do not include \`<html>\`, \`<body>\`, or \`<head>\` tags.
            - Use basic HTML tags like \`<h3>\`, \`<h4>\`, \`<p>\`, \`<ul>\`, \`<li>\`, \`<strong>\`.
            - You can use Tailwind CSS classes like 'font-semibold', 'mt-4', 'mb-2', 'list-disc', 'ml-6' for basic styling if needed.
            - The response should only be the HTML content.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (!response) {
            throw new Error("Received an empty or invalid response from the AI model.");
        }

        setEditorContent(response.text);
        alert(`✅ Content successfully restructured for ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);

    } catch (error) {
        console.error(`Error applying ${platform} template:`, error);
        alert(`❌ Failed to apply template. This could be due to a network issue or an API error. Please check the console for details.`);
    } finally {
        setIsApplyingTemplate(null);
    }
  };
  
  const handleAddConcept = (concept: string) => {
      setEditorContent(prev => prev + ` <strong>${concept}</strong>`);
      alert(`✅ Concept "${concept}" added to content!`);
  };

  const handleAddMissingEntities = async () => {
    setIsGeneratingEntities(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const plainTextContent = editorContent.replace(/<[^>]*>/g, ' ');

        const prompt = `You are an AI content enrichment specialist. Analyze the following text and identify key topics already discussed. Then, suggest 3 to 5 highly relevant but *missing* topics or entities that would improve the content's depth and completeness.

        Existing Content: "${plainTextContent}"
        
        Your response must be a single JSON object conforming to the provided schema. The JSON object must have a key "missing_entities" which is an array of strings.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        missing_entities: {
                            type: Type.ARRAY,
                            description: "A list of 3 to 5 relevant but missing entities.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['missing_entities']
                }
            }
        });
        
        if (!response) {
            throw new Error("Received an empty or invalid response from the AI model.");
        }

        const result = JSON.parse(response.text);
        const entities: string[] = result.missing_entities;
        
        if (entities && entities.length > 0) {
            const newContent = `<div class="mt-4 p-4 bg-dark-border/30 rounded-lg border-l-4 border-brand-secondary">
                <h4 class="font-semibold text-light-text">AI-Suggested Enriched Concepts</h4>
                <p class="text-sm text-medium-text mt-1">To improve content depth, consider discussing:</p>
                <ul class="list-disc ml-6 mt-2 text-light-text">
                    ${entities.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>`;
            setEditorContent(prev => prev + newContent);
            alert('✅ AI-suggested missing entities have been added to your content!');
        } else {
            alert('ℹ️ No new entities were suggested by the AI. The content seems comprehensive.');
        }

    } catch (error) {
        console.error("Error generating missing entities:", error);
        alert("❌ Failed to generate missing entities. This could be due to a network issue or an API error. Please check the console for details.");
    } finally {
        setIsGeneratingEntities(false);
    }
  };

  const handleGenerateConceptMap = async () => {
    setIsGeneratingMap(true);
    setConceptMapData(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const plainTextContent = editorContent.replace(/<[^>]*>/g, ' ');

        const prompt = `Analyze the following text and generate a concept map. Identify the main topic, 5 to 7 key related concepts, and the relationship between the main topic and each concept.

        Text: "${plainTextContent}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        main_topic: { type: Type.STRING },
                        related_concepts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    concept: { type: Type.STRING },
                                    relationship: { type: Type.STRING }
                                },
                                required: ['concept', 'relationship']
                            }
                        }
                    },
                    required: ['main_topic', 'related_concepts']
                }
            }
        });
        
        if (!response) {
            throw new Error("Received an empty or invalid response from the AI model.");
        }
        
        const result = JSON.parse(response.text);

        const nodes: ConceptMapData['nodes'] = [
            { id: 'main', label: result.main_topic, type: 'main' },
            ...result.related_concepts.map((item: any, index: number) => ({
                id: `related_${index}`,
                label: item.concept,
                type: 'related' as const,
            }))
        ];

        const edges: ConceptMapData['edges'] = result.related_concepts.map((item: any, index: number) => ({
            source: 'main',
            target: `related_${index}`,
            label: item.relationship,
        }));

        setConceptMapData({ nodes, edges });

    } catch (error) {
        console.error("Error generating concept map:", error);
        alert("❌ Failed to generate concept map. Please check the console for details.");
    } finally {
        setIsGeneratingMap(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wider">Content Optimization Engine</h1>
          <p className="text-lg text-medium-text tracking-wide mt-2">AI-Powered Content Enhancement</p>
      </div>
      
      <Card title="AI Readiness Scoring">
        <p className="text-medium-text -mt-4 mb-6">Analyze and score your content for AI platform compatibility</p>
        <AiReadinessScoring
          url={url}
          setUrl={setUrl}
          contentText={scoringContentText}
          setContentText={setScoringContentText}
          scores={scores}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
        />
      </Card>
      
      <Card title="Real-time Content Editor">
        <p className="text-medium-text -mt-4 mb-6">Edit your content with AI-powered suggestions and improvements</p>
        <RealTimeEditor 
          content={editorContent}
          onContentChange={setEditorContent}
          suggestions={suggestions}
          onApplySuggestion={handleApplySuggestion}
          onFormat={handleFormat}
          onRefreshSuggestions={handleRefreshSuggestions}
          isRefreshingSuggestions={isRefreshingSuggestions}
        />
      </Card>

      <Card title="Semantic Enrichment">
        <p className="text-medium-text -mt-4 mb-6">Enhance your content with relevant entities and concepts</p>
        <SemanticEnrichment 
          onAddConcept={handleAddConcept}
          isGeneratingEntities={isGeneratingEntities}
          onAddMissingEntities={handleAddMissingEntities}
          isGeneratingMap={isGeneratingMap}
          onGenerateConceptMap={handleGenerateConceptMap}
          conceptMapData={conceptMapData}
        />
      </Card>

      <Card title="Platform Templates">
        <p className="text-medium-text -mt-4 mb-6">Pre-optimized templates for specific AI platforms</p>
        <PlatformTemplates 
            onApplyTemplate={handleApplyTemplate}
            isApplyingTemplate={isApplyingTemplate}
        />
      </Card>
    </div>
  );
};