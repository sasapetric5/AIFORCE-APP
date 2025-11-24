import React, { useState, FormEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';

interface SchemaAnalysis {
    completenessScore: number;
    optimizationScore: number;
    suggestions: string[];
}

const ScoreGauge: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => (
    <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      className="text-dark-border" strokeWidth="3" stroke="currentColor" fill="transparent"/>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round"
                      stroke={color} fill="transparent" style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold" style={{ color }}>
                {score}
            </div>
        </div>
        <p className="text-sm font-semibold text-medium-text mt-2">{label}</p>
    </div>
);

export const ProductSchemaFactory: React.FC = () => {
    const [product, setProduct] = useState({
        name: 'AI-Powered Smart Watch',
        description: 'A revolutionary smart watch with predictive health monitoring and a holographic display. Integrates seamlessly with all your devices.',
        imageUrl: 'https://example.com/smartwatch.png',
        brand: 'AI Force Wearables',
        sku: 'AFW-SW-2024',
        price: '399.99',
        currency: 'USD',
        availability: 'https://schema.org/InStock',
        ratingValue: '4.8',
        reviewCount: '1250',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [generatedSchema, setGeneratedSchema] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<SchemaAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateSchema = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setGeneratedSchema(null);
        setAnalysis(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert in SEO and e-commerce schema markup. For the following product, generate a complete and valid JSON-LD 'Product' schema. Also, provide a brief analysis of the schema's completeness and optimization for AI search.

                Product Details:
                - Name: ${product.name}
                - Description: ${product.description}
                - Image URL: ${product.imageUrl}
                - Brand: ${product.brand}
                - SKU: ${product.sku}
                - Price: ${product.price}
                - Currency: ${product.currency}
                - Availability: ${product.availability}
                - Average Rating: ${product.ratingValue}
                - Review Count: ${product.reviewCount}

                Your response must be a single JSON object.
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            schema: {
                                type: Type.OBJECT,
                                description: "The generated JSON-LD schema for the product.",
                                properties: {
                                    '@context': { type: Type.STRING },
                                    '@type': { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    image: { type: Type.STRING },
                                    sku: { type: Type.STRING },
                                    brand: { type: Type.OBJECT, properties: { '@type': { type: Type.STRING }, name: { type: Type.STRING } } },
                                    aggregateRating: { type: Type.OBJECT, properties: { '@type': { type: Type.STRING }, ratingValue: { type: Type.STRING }, reviewCount: { type: Type.STRING } } },
                                    offers: { type: Type.OBJECT, properties: { '@type': { type: Type.STRING }, priceCurrency: { type: Type.STRING }, price: { type: Type.STRING }, availability: { type: Type.STRING } } }
                                },
                            },
                            analysis: {
                                type: Type.OBJECT,
                                properties: {
                                    completenessScore: { type: Type.NUMBER, description: 'A score from 0 to 100 for schema completeness.' },
                                    optimizationScore: { type: Type.NUMBER, description: 'A score from 0 to 100 for AI optimization.' },
                                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of 2-3 actionable suggestions.' }
                                },
                                required: ['completenessScore', 'optimizationScore', 'suggestions']
                            }
                        },
                        required: ['schema', 'analysis']
                    }
                }
            });

            const result = JSON.parse(response.text);
            setGeneratedSchema(JSON.stringify(result.schema, null, 2));
            setAnalysis(result.analysis);

        } catch (e) {
            console.error(e);
            setError("The AI analysis failed. This could be due to a network issue, content policy, or an API error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (generatedSchema) {
            navigator.clipboard.writeText(`<script type="application/ld+json">\n${generatedSchema}\n</script>`);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4">
                    <i className="fas fa-tags text-lime-400"></i> Product Schema Factory
                </h1>
                <p className="text-lg text-medium-text tracking-wide mt-2">
                    Generate AI-Optimized Product Schemas for Maximum Visibility.
                </p>
            </div>
            
            <Card title="Product Details Input">
                <form onSubmit={handleGenerateSchema} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-medium-text mb-1">Product Name</label>
                        <input type="text" name="name" id="name" value={product.name} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" required />
                    </div>
                    <div className="lg:col-span-3">
                        <label htmlFor="description" className="block text-sm font-medium text-medium-text mb-1">Product Description</label>
                        <textarea name="description" id="description" value={product.description} onChange={handleInputChange} rows={3} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" required />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-medium-text mb-1">Image URL</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={product.imageUrl} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-medium-text mb-1">Brand</label>
                        <input type="text" name="brand" id="brand" value={product.brand} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                    <div>
                        <label htmlFor="sku" className="block text-sm font-medium text-medium-text mb-1">SKU</label>
                        <input type="text" name="sku" id="sku" value={product.sku} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                     <div>
                        <label htmlFor="price" className="block text-sm font-medium text-medium-text mb-1">Price</label>
                        <input type="text" name="price" id="price" value={product.price} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                     <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-medium-text mb-1">Currency</label>
                        <select name="currency" id="currency" value={product.currency} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2">
                            <option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-medium-text mb-1">Availability</label>
                        <select name="availability" id="availability" value={product.availability} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2">
                            <option value="https://schema.org/InStock">In Stock</option>
                            <option value="https://schema.org/OutOfStock">Out of Stock</option>
                            <option value="https://schema.org/PreOrder">Pre-Order</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="ratingValue" className="block text-sm font-medium text-medium-text mb-1">Rating (1-5)</label>
                        <input type="text" name="ratingValue" id="ratingValue" value={product.ratingValue} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                     <div>
                        <label htmlFor="reviewCount" className="block text-sm font-medium text-medium-text mb-1">Review Count</label>
                        <input type="number" name="reviewCount" id="reviewCount" value={product.reviewCount} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>
                     <div className="lg:col-span-3 text-center">
                        <button type="submit" disabled={isLoading} className="w-full md:w-1/2 lg:w-1/3 bg-lime-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-lime-700 transition-colors disabled:bg-lime-600/50 flex items-center justify-center gap-2 mx-auto">
                           {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-magic"></i> Generate Schema with AI</>}
                        </button>
                    </div>
                </form>
            </Card>

            {(isLoading || generatedSchema || error) && (
                <Card title="Generated Schema & Analysis">
                    {isLoading && <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div><p className="mt-4 text-medium-text">AI is generating your schema...</p></div>}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {generatedSchema && analysis && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold">JSON-LD Schema</h4>
                                    <button onClick={handleCopy} className="text-sm bg-dark-border text-medium-text py-1 px-3 rounded-md hover:bg-slate-600 transition-colors">
                                        {copySuccess ? 'Copied!' : 'Copy Schema'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <pre className="bg-slate-950 text-slate-300 p-4 rounded-md overflow-x-auto text-sm h-[400px]">
                                        <code>{`<script type="application/ld+json">\n${generatedSchema}\n</script>`}</code>
                                    </pre>
                                </div>
                            </div>
                            <div className="bg-dark-bg p-6 rounded-lg">
                                <h4 className="font-semibold mb-6 text-center">AI Analysis</h4>
                                <div className="flex justify-around mb-8">
                                    <ScoreGauge score={analysis.completenessScore} label="Completeness" color="#a3e635" />
                                    <ScoreGauge score={analysis.optimizationScore} label="AI Optimization" color="#4ade80" />
                                </div>
                                <h5 className="font-semibold mb-3">Suggestions:</h5>
                                <ul className="space-y-3 text-sm">
                                    {analysis.suggestions.map((s, i) => (
                                        <li key={i} className="flex items-start bg-dark-border/50 p-3 rounded-md">
                                            <span className="text-lime-400 mr-3 mt-1">›</span>{s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};
