
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { SchemaAuditItem, RecommendedSchema } from '../../types';

interface StructuredDataProps {
  audit: SchemaAuditItem[];
  recommendations: RecommendedSchema[];
}

const statusClasses: Record<string, string> = {
    PRESENT: 'bg-green-500/20 text-green-300',
    PARTIAL: 'bg-yellow-500/20 text-yellow-300',
    MISSING: 'bg-red-500/20 text-red-300',
};

const SCHEMA_GENERATORS = [
    { id: 'organization', name: 'Organization Schema' },
    { id: 'howto', name: 'How-to Schema' },
    { id: 'course', name: 'Course Schema' },
    { id: 'recipe', name: 'Recipe Schema' },
    { id: 'event', name: 'Event Schema' },
];

const schemaGenerationConfig: Record<string, { title: string; prompt: string; responseSchema: any; }> = {
  organization: {
    title: 'Organization Schema',
    prompt: `
      Generate a JSON-LD script for an 'Organization' schema.
      - The organization's name is "AI FORCE".
      - The website URL is "https://aiforce.com".
      - The logo URL is "https://aiforce.com/logo.png".
      - The social media profiles are:
        - https://twitter.com/aiforce
        - https://www.linkedin.com/company/aiforce
        - https://www.facebook.com/aiforce
      The output must be a single JSON object.
    `,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        '@context': { type: Type.STRING, description: "Should be 'https://schema.org'" },
        '@type': { type: Type.STRING, description: "Should be 'Organization'" },
        name: { type: Type.STRING },
        url: { type: Type.STRING },
        logo: { type: Type.STRING },
        sameAs: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['@context', '@type', 'name', 'url', 'logo', 'sameAs']
    }
  },
  howto: {
    title: 'How-to Schema',
    prompt: `
      Generate a JSON-LD script for a 'HowTo' schema.
      - The title is "How to Optimize Content for AI SEO".
      - Include three distinct steps with clear text descriptions for each step.
      - The total time required is "PT2H".
      The output must be a single JSON object.
    `,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          '@context': { type: Type.STRING, description: "Should be 'https://schema.org'" },
          '@type': { type: Type.STRING, description: "Should be 'HowTo'" },
          name: { type: Type.STRING },
          totalTime: { type: Type.STRING },
          step: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                '@type': { type: Type.STRING, description: "Should be 'HowToStep'" },
                text: { type: Type.STRING, description: "The description of the step." }
              },
              required: ['@type', 'text']
            }
          }
        },
        required: ['@context', '@type', 'name', 'step', 'totalTime']
      }
  },
  course: {
    title: 'Course Schema',
    prompt: `
      Generate a JSON-LD script for a 'Course' schema.
      - The course name is "AI Visibility Masterclass".
      - The description is "A comprehensive course on optimizing content for AI search engines.".
      - The provider is an organization named "AI FORCE".
      The output must be a single JSON object.
    `,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          '@context': { type: Type.STRING, description: "Should be 'https://schema.org'" },
          '@type': { type: Type.STRING, description: "Should be 'Course'" },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          provider: {
            type: Type.OBJECT,
            properties: {
                '@type': { type: Type.STRING, description: "Should be 'Organization'" },
                name: { type: Type.STRING }
            },
            required: ['@type', 'name']
          }
        },
        required: ['@context', '@type', 'name', 'description', 'provider']
      }
  },
  recipe: {
    title: 'Recipe Schema',
    prompt: `
      Generate a JSON-LD script for a 'Recipe' schema for 'AI-Powered Chocolate Chip Cookies'.
      - Include a description: "The perfect cookie recipe, optimized by AI for deliciousness."
      - Include two ingredients in the 'recipeIngredient' array.
      - Include two instruction steps in the 'recipeInstructions' array. Each step should be a 'HowToStep' object.
      The output must be a single JSON object.
    `,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          '@context': { type: Type.STRING, description: "Should be 'https://schema.org'" },
          '@type': { type: Type.STRING, description: "Should be 'Recipe'" },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          recipeIngredient: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recipeInstructions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    '@type': { type: Type.STRING, description: "Should be 'HowToStep'" },
                    text: { type: Type.STRING, description: "The description of the instruction." }
                },
                required: ['@type', 'text']
            }
          }
        },
        required: ['@context', '@type', 'name', 'description', 'recipeIngredient', 'recipeInstructions']
    }
  },
  event: {
    title: 'Event Schema',
    prompt: `
      Generate a JSON-LD script for an 'Event' schema.
      - The event name is "AI Marketing Summit 2024".
      - The start date is "2024-12-01T09:00-05:00".
      - The end date is "2024-12-01T17:00-05:00".
      - The location is virtual.
      - The organizer is an organization named "AI FORCE".
      The output must be a single JSON object.
    `,
    responseSchema: {
        type: Type.OBJECT,
        properties: {
          '@context': { type: Type.STRING, description: "Should be 'https://schema.org'" },
          '@type': { type: Type.STRING, description: "Should be 'Event'" },
          name: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          eventAttendanceMode: { type: Type.STRING, description: "e.g. https://schema.org/OnlineEventAttendanceMode" },
          location: {
            type: Type.OBJECT,
            properties: {
                '@type': { type: Type.STRING, description: "Should be 'VirtualLocation'" },
                url: { type: Type.STRING, description: "A URL for the online event." }
            },
            required: ['@type']
          },
          organizer: {
            type: Type.OBJECT,
            properties: {
                '@type': { type: Type.STRING, description: "Should be 'Organization'" },
                name: { type: Type.STRING },
                url: { type: Type.STRING }
            },
            required: ['@type', 'name']
          }
        },
        required: ['@context', '@type', 'name', 'startDate', 'endDate', 'location', 'organizer']
    }
  }
};


export const StructuredData: React.FC<StructuredDataProps> = ({ audit, recommendations }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<string>('organization');
  const [generatedSchemaTitle, setGeneratedSchemaTitle] = useState<string>('');

  const handleGenerateSchema = async () => {
    const config = schemaGenerationConfig[selectedSchema];
    if (!config) {
        setError(`Schema configuration for "${selectedSchema}" not found.`);
        return;
    }

    setIsGenerating(true);
    setGeneratedSchema(null);
    setError(null);
    setCopySuccess(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: config.prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: config.responseSchema,
        }
      });

      const schemaObject = JSON.parse(response.text);
      setGeneratedSchema(JSON.stringify(schemaObject, null, 2));
      setGeneratedSchemaTitle(config.title);

    } catch (e) {
      console.error(e);
      setError(`Failed to generate ${config.title}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedSchema) {
      navigator.clipboard.writeText(`<script type="application/ld+json">\n${generatedSchema}\n</script>`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-bg p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-light-text mb-4">Schema Markup Audit</h4>
          <div className="space-y-2">
              {audit && audit.length > 0 ? (
                audit.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-dark-card rounded-md">
                      <div>
                          <p className="font-semibold text-light-text">{item.name}</p>
                          <p className="text-xs text-medium-text">{item.description}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusClasses[item.status]}`}>{item.status}</span>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-medium-text text-sm">Schema audit data unavailable.</div>
              )}
          </div>
        </div>
        <div className="bg-dark-bg p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-light-text mb-4">Schema Generator</h4>
          <p className="text-sm text-medium-text mb-4">Select a schema type and use AI to generate the essential JSON-LD markup.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {SCHEMA_GENERATORS.map(schema => (
                  <button 
                      key={schema.id} 
                      onClick={() => setSelectedSchema(schema.id)}
                      className={`p-3 rounded-md text-center border-2 transition-colors ${selectedSchema === schema.id ? 'bg-brand-primary/20 border-brand-primary' : 'bg-dark-card border-dark-border hover:border-medium-text/50'}`}
                  >
                      <span className="font-semibold text-light-text text-sm">{schema.name.replace(' Schema', '')}</span>
                  </button>
              ))}
          </div>
           
           <button 
             onClick={handleGenerateSchema} 
             disabled={isGenerating} 
             className="w-full mt-4 bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary/90 disabled:bg-brand-secondary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
           >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                `🧩 Generate ${SCHEMA_GENERATORS.find(s => s.id === selectedSchema)?.name || 'Schema'}`
              )}
          </button>
        </div>
      </div>
      {(generatedSchema || error) && (
        <div className="mt-6 bg-dark-bg p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-light-text">Generated {generatedSchemaTitle} (JSON-LD)</h4>
            {generatedSchema && (
              <button onClick={handleCopyToClipboard} className="bg-dark-border text-light-text px-3 py-1 rounded-md text-sm hover:bg-brand-primary">
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {error && <p className="text-red-400 p-4 bg-red-500/10 rounded-md">{error}</p>}
          {generatedSchema && (
            <div className="relative">
              <pre className="bg-dark-card p-4 rounded-md overflow-x-auto text-sm">
                <code>
                  {`<script type="application/ld+json">\n${generatedSchema}\n</script>`}
                </code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
