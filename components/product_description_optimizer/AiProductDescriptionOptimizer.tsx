import React, { useState, FormEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';

const ECOMMERCE_PLATFORMS = [
    { id: 'amazon', name: 'Amazon', icon: 'fab fa-amazon', description: 'Focus on keyword density, scannable bullet points for features, and A+ content style.' },
    { id: 'shopify', name: 'Shopify', icon: 'fab fa-shopify', description: 'Focus on brand storytelling, lifestyle benefits, persuasive language, and strong call-to-actions.' },
    { id: 'etsy', name: 'Etsy', icon: 'fab fa-etsy', description: 'Emphasize craftsmanship, the unique story behind the product, and a personal creator connection.' },
    { id: 'ebay', name: 'eBay', icon: 'fab fa-ebay', description: 'Use clear, concise, and factual descriptions with a focus on item condition, specifics, and keywords in the title.' },
    { id: 'walmart', name: 'Walmart', icon: 'fas fa-store', description: 'Focus on concise, clear titles, competitive pricing keywords, and bullet points that quickly convey value.' },
    { id: 'woocommerce', name: 'WooCommerce', icon: 'fab fa-wordpress', description: 'Integrate seamlessly with blog content, focus on long-tail keywords, and leverage WordPress SEO plugins.' },
    { id: 'bigcommerce', name: 'BigCommerce', icon: 'fas fa-shopping-cart', description: 'Highlight product options and variations, use powerful calls-to-action, and focus on converting visitors with built-in features.' },
    { id: 'magento', name: 'Magento (Adobe)', icon: 'fab fa-magento', description: 'Provide detailed technical specifications, rich product attributes, and appeal to a B2B or high-volume audience.' },
];

const GeneratedDescription: React.FC<{ htmlContent: string; onCopy: () => void; copySuccess: boolean; }> = ({ htmlContent, onCopy, copySuccess }) => (
    <div className="relative bg-dark-bg p-4 rounded-md border border-dark-border min-h-[200px] mt-4">
        <button onClick={onCopy} className="absolute top-2 right-2 text-xs bg-dark-border text-medium-text py-1 px-2 rounded hover:bg-slate-600 transition-colors">
            {copySuccess ? 'Copied!' : 'Copy'}
        </button>
        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
);


export const AiProductDescriptionOptimizer: React.FC = () => {
    const [productDetails, setProductDetails] = useState({
        name: 'AI-Powered Smart Watch',
        features: 'Holographic display, predictive health monitoring, 7-day battery life, seamless device integration, titanium body',
        audience: 'Tech enthusiasts, fitness professionals, busy executives',
        tone: 'Professional'
    });
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['amazon', 'shopify']);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<Record<string, string> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('amazon');
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePlatformToggle = (platformId: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId]
        );
    };

    const handleGenerate = async (e: FormEvent) => {
        e.preventDefault();
        if (selectedPlatforms.length === 0) {
            setError("Please select at least one target platform.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults(null);
        setCopySuccess(null);
        
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

            const platformDetails = selectedPlatforms.map(pId => {
                const platform = ECOMMERCE_PLATFORMS.find(p => p.id === pId);
                return `- ${platform.name}: ${platform.description}`;
            }).join('\n');

            const prompt = `
                You are an expert e-commerce copywriter and SEO specialist. Your task is to generate optimized product descriptions for the following product, tailored for each of the specified e-commerce platforms.

                Product Information:
                - Name: "${productDetails.name}"
                - Key Features/Keywords: "${productDetails.features}"
                - Target Audience: "${productDetails.audience}"
                - Tone of Voice: "${productDetails.tone}"

                Target Platforms and Guidelines:
                ${platformDetails}

                For each platform, generate a compelling description that follows its specific guidelines. The description should convert features into benefits, be persuasive, and integrate relevant keywords naturally.

                Return the response as a single JSON object where each key is the platform ID (e.g., "amazon", "shopify") and the value is the generated HTML description for that platform. The HTML should use simple tags like <h4>, <p>, <ul>, <li>, <strong> for structure and emphasis.
            `;

            const responseSchemaProperties = selectedPlatforms.reduce((acc: Record<string, any>, platformId) => {
                acc[platformId] = { type: Type.STRING, description: `HTML description for ${platformId}` };
                return acc;
            }, {});

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: responseSchemaProperties,
                        required: selectedPlatforms
                    }
                }
            });

            const result = JSON.parse(response.text);
            setResults(result);
            setActiveTab(selectedPlatforms[0]);

        } catch(e) {
            console.error(e);
            setError("The AI failed to generate descriptions. This could be due to a network issue or an API error. Please check the console and try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (platformId: string) => {
        if (results && results[platformId]) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = results[platformId];
            navigator.clipboard.writeText(tempDiv.textContent || tempDiv.innerText || '');
            setCopySuccess(platformId);
            setTimeout(() => setCopySuccess(null), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4">
                    <i className="fas fa-file-signature text-emerald-400"></i> AI Product Description Optimizer
                </h1>
                <p className="text-lg text-medium-text tracking-wide mt-2">
                    Craft compelling, high-converting descriptions for any platform.
                </p>
            </div>
            
            <Card title="Product Information">
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-medium-text mb-1">Product Name</label>
                            <input type="text" name="name" id="name" value={productDetails.name} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" required />
                        </div>
                        <div>
                            <label htmlFor="audience" className="block text-sm font-medium text-medium-text mb-1">Target Audience</label>
                            <input type="text" name="audience" id="audience" value={productDetails.audience} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="features" className="block text-sm font-medium text-medium-text mb-1">Key Features & Keywords (comma-separated)</label>
                        <textarea name="features" id="features" value={productDetails.features} onChange={handleInputChange} rows={3} className="w-full bg-dark-bg border border-dark-border rounded-md p-2" />
                    </div>

                    <Card title="Target E-commerce Platforms">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ECOMMERCE_PLATFORMS.map(platform => (
                                <div key={platform.id} onClick={() => handlePlatformToggle(platform.id)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPlatforms.includes(platform.id) ? 'border-emerald-500 bg-emerald-500/10' : 'border-dark-border bg-dark-bg hover:border-medium-text/50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <i className={`${platform.icon} text-2xl`}></i>
                                            <span className="font-semibold">{platform.name}</span>
                                        </div>
                                        <input type="checkbox" checked={selectedPlatforms.includes(platform.id)} readOnly className="h-5 w-5 rounded bg-dark-border border-medium-text text-emerald-500 focus:ring-0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                     <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-1/3">
                             <label htmlFor="tone" className="block text-sm font-medium text-medium-text mb-1">Tone of Voice</label>
                             <select name="tone" id="tone" value={productDetails.tone} onChange={handleInputChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2">
                                <option>Professional</option>
                                <option>Friendly & Casual</option>
                                <option>Luxury</option>
                                <option>Playful</option>
                                <option>Technical</option>
                            </select>
                        </div>
                        <div className="w-full sm:w-2/3 pt-0 sm:pt-6">
                            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-600/50 flex items-center justify-center gap-2">
                               {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Generating Descriptions...</> : <><i className="fas fa-magic"></i> Generate with AI</>}
                            </button>
                        </div>
                    </div>
                </form>
            </Card>

            {(isLoading || results || error) && (
                <Card title="Generated Descriptions">
                    {isLoading && <div className="text-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div><p className="mt-4 text-medium-text">AI is crafting your descriptions...</p></div>}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {results && (
                        <div>
                            <div className="border-b border-dark-border mb-4 flex space-x-1 overflow-x-auto">
                                {Object.keys(results).map(platformId => {
                                    const platform = ECOMMERCE_PLATFORMS.find(p => p.id === platformId);
                                    return (
                                        <button key={platformId} onClick={() => setActiveTab(platformId)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${activeTab === platformId ? 'bg-dark-bg text-emerald-400' : 'bg-transparent text-medium-text hover:bg-dark-border'}`}>
                                            <i className={platform?.icon}></i>
                                            <span>{platform?.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div>
                                {Object.entries(results).map(([platformId, description]) => (
                                    activeTab === platformId && (
                                        <GeneratedDescription 
                                            key={platformId}
                                            htmlContent={description}
                                            onCopy={() => handleCopy(platformId)}
                                            copySuccess={copySuccess === platformId}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};