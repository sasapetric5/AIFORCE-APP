import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card } from '../Card';

// Mock Data
const PLATFORMS = [
    { id: 'shopify', name: 'Shopify', icon: 'fab fa-shopify', connected: true },
    { id: 'woocommerce', name: 'WooCommerce', icon: 'fab fa-wordpress', connected: true },
    { id: 'amazon', name: 'Amazon Seller Central', icon: 'fab fa-amazon', connected: false },
    { id: 'etsy', name: 'Etsy', icon: 'fab fa-etsy', connected: false },
    { id: 'magento', name: 'Adobe Commerce (Magento)', icon: 'fab fa-magento', connected: false },
    { id: 'bigcommerce', name: 'BigCommerce', icon: 'fas fa-shopping-cart', connected: false },
];

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'AI-Powered Smart Watch', store: 'Shopify', visibility: 88, status: 'Optimized', stock: 150 },
  { id: 'p2', name: 'Quantum Noise-Cancelling Headphones', store: 'WooCommerce', visibility: 65, status: 'Needs Improvement', stock: 78 },
  { id: 'p3', name: 'Holographic Desk Projector', store: 'Shopify', visibility: 72, status: 'Needs Improvement', stock: 210 },
  { id: 'p4', name: 'Self-Lacing Cyber Sneakers', store: 'WooCommerce', visibility: 92, status: 'Optimized', stock: 45 },
  { id: 'p5', name: 'Bio-Organic Nutrient Synthesizer', store: 'Shopify', visibility: 75, status: 'Needs Improvement', stock: 88 },
  { id: 'p6', name: 'Anti-Gravity Desk Chair', store: 'WooCommerce', visibility: 81, status: 'Optimized', stock: 32 },
];


const AiEnhancerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    product: any | null;
}> = ({ isOpen, onClose, product }) => {
    const [activeView, setActiveView] = useState<'description' | 'image'>('description');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
    const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [numberOfImages, setNumberOfImages] = useState<1 | 2 | 3 | 4>(1);

    useEffect(() => {
        if (isOpen) {
            setActiveView('description');
            setGeneratedDescription(null);
            setGeneratedImageUrls([]);
            setError(null);
            setNumberOfImages(1);
        }
    }, [isOpen]);

    const handleGenerateDescription = async () => {
        if (!product) return;
        setIsLoading(true);
        setError(null);
        setGeneratedDescription(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are an expert e-commerce copywriter for the AI FORCE platform. For the product named "${product.name}", generate a compelling, SEO-friendly, and AI-optimized product description. The description should be engaging, highlight 3-4 plausible key features, and include a strong call to action. Format the response as a clean HTML block using Tailwind CSS classes. Use a main heading (h4), a paragraph for the description, a list (ul/li) for key features, and a final paragraph for the call to action.`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setGeneratedDescription(response.text);
        } catch (e) {
            console.error(e);
            setError('An error occurred while generating the product description. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!product) return;
        setIsLoading(true);
        setError(null);
        setGeneratedImageUrls([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `A professional, high-quality e-commerce product photograph of: ${product.name}. The product should be centered on a clean, minimalist, light gray background. Studio lighting.`;
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: numberOfImages,
                    outputMimeType: 'image/png',
                    aspectRatio: '1:1',
                },
            });

            const imageUrls = response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
            setGeneratedImageUrls(imageUrls);
        } catch (e) {
            console.error(e);
            setError('An error occurred while generating the product image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-dark-border flex-shrink-0">
                    <h3 className="text-lg font-bold">AI Enhancer: <span className="text-pink-400">{product.name}</span></h3>
                </header>
                <main className="p-6 flex-grow overflow-y-auto">
                    <div className="border-b border-dark-border mb-4 flex space-x-2">
                        <button onClick={() => setActiveView('description')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeView === 'description' ? 'border-pink-400 text-pink-400' : 'border-transparent text-medium-text hover:text-light-text'}`}>
                            Product Description
                        </button>
                        <button onClick={() => setActiveView('image')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeView === 'image' ? 'border-pink-400 text-pink-400' : 'border-transparent text-medium-text hover:text-light-text'}`}>
                            Product Image
                        </button>
                    </div>
                    
                    {activeView === 'description' && (
                        <div className="space-y-4">
                            <button onClick={handleGenerateDescription} disabled={isLoading} className="w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 flex items-center justify-center gap-2 disabled:bg-brand-primary/50">
                                {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-magic"></i> Generate Description</>}
                            </button>
                             <div className="min-h-[200px] bg-dark-bg p-4 rounded-md border border-dark-border">
                                {isLoading && <div className="text-center p-8 text-medium-text">Generating...</div>}
                                {error && <p className="text-red-400">{error}</p>}
                                {generatedDescription && <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: generatedDescription }} />}
                            </div>
                        </div>
                    )}

                    {activeView === 'image' && (
                         <div className="space-y-4">
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-medium-text">Number of images:</span>
                                {[1, 2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setNumberOfImages(num as 1 | 2 | 3 | 4)}
                                        className={`w-10 h-10 rounded-md font-bold transition-colors ${numberOfImages === num ? 'bg-brand-primary text-white' : 'bg-dark-bg border border-dark-border hover:bg-dark-border'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleGenerateImage} disabled={isLoading} className="w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/90 flex items-center justify-center gap-2 disabled:bg-brand-primary/50">
                                {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-image"></i> Generate {numberOfImages} Image{numberOfImages > 1 ? 's' : ''}</>}
                            </button>
                             <div className="min-h-[200px] bg-dark-bg p-4 rounded-md border border-dark-border flex items-center justify-center">
                                {isLoading && (
                                    <div className={`grid ${numberOfImages > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 w-full`}>
                                        {Array.from({ length: numberOfImages }).map((_, i) => (
                                            <div key={i} className="w-full aspect-square bg-dark-border animate-pulse rounded-lg"></div>
                                        ))}
                                    </div>
                                )}
                                {error && <p className="text-red-400">{error}</p>}
                                {!isLoading && generatedImageUrls.length > 0 && (
                                    <div className={`grid ${generatedImageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                        {generatedImageUrls.map((url, index) => (
                                           <img key={index} src={url} alt={`AI generated image ${index + 1} for ${product.name}`} className="max-w-full max-h-80 rounded-lg object-contain" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
                <footer className="p-4 border-t border-dark-border flex-shrink-0 flex justify-end gap-3">
                    <button onClick={onClose} className="py-2 px-4 text-sm font-semibold rounded-md bg-dark-border hover:bg-slate-600">Close</button>
                </footer>
            </div>
        </div>
    );
};

export const UniversalPlatformIntegrationHub: React.FC = () => {
    const [connections, setConnections] = useState(PLATFORMS);
    const [products] = useState(MOCK_PRODUCTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEnhancerModalOpen, setIsEnhancerModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const toggleConnection = (id: string) => {
        setConnections(prev =>
            prev.map(conn =>
                conn.id === id ? { ...conn, connected: !conn.connected } : conn
            )
        );
    };

    const handleOpenAiEnhancer = (product: typeof MOCK_PRODUCTS[0]) => {
        setSelectedProduct(product);
        setIsEnhancerModalOpen(true);
    };
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4">
                    <i className="fas fa-store text-pink-400"></i> Universal Platform Integration Hub
                </h1>
                <p className="text-lg text-medium-text tracking-wide mt-2">
                    Unified E-commerce Workflow for Shopify, WooCommerce, Amazon & more.
                </p>
            </div>
            
            <Card title="E-commerce Platform Connections">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {connections.map(conn => (
                        <div key={conn.id} className="bg-dark-bg p-4 rounded-lg flex items-center justify-between border border-dark-border">
                            <div className="flex items-center gap-4">
                                <i className={`${conn.icon} text-2xl ${conn.connected ? 'text-green-400' : 'text-medium-text'}`}></i>
                                <span className="font-semibold">{conn.name}</span>
                            </div>
                            <button onClick={() => toggleConnection(conn.id)} className={`text-sm font-bold py-2 px-4 rounded-md transition-colors ${conn.connected ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                                {conn.connected ? 'Disconnect' : 'Connect'}
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Unified Product Cockpit">
                 <div className="mb-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i className="fas fa-search text-medium-text"></i>
                        </span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-md focus:ring-pink-400 focus:border-pink-400"
                        />
                    </div>
                </div>
                <div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-dark-border text-xs uppercase text-medium-text">
                                    <th className="p-3">Product Name</th>
                                    <th className="p-3">Store</th>
                                    <th className="p-3 text-center">Visibility Score</th>
                                    <th className="p-3 text-center">Stock</th>
                                    <th className="p-3 text-center">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className="border-t border-dark-border hover:bg-dark-border/30">
                                        <td className="p-3 font-semibold">{product.name}</td>
                                        <td className="p-3">{product.store}</td>
                                        <td className="p-3 text-center font-bold text-lg">{product.visibility}</td>
                                        <td className="p-3 text-center">{product.stock}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'Optimized' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{product.status}</span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleOpenAiEnhancer(product)} className="bg-brand-primary text-white text-xs font-semibold py-1 px-3 rounded-md hover:bg-brand-primary/80">
                                                <i className="fas fa-wand-magic-sparkles mr-1"></i> AI Enhancer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-4">
                         {filteredProducts.map(product => (
                            <div key={product.id} className="bg-dark-bg p-4 rounded-lg border border-dark-border">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-light-text">{product.name}</h4>
                                        <p className="text-xs text-medium-text">{product.store}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'Optimized' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                        {product.status}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-center my-4">
                                    <div className="bg-dark-border/50 p-2 rounded-md">
                                        <div className="font-bold text-lg">{product.visibility}</div>
                                        <div className="text-xs text-medium-text">Visibility</div>
                                    </div>
                                    <div className="bg-dark-border/50 p-2 rounded-md">
                                        <div className="font-bold text-lg">{product.stock}</div>
                                        <div className="text-xs text-medium-text">Stock</div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleOpenAiEnhancer(product)} 
                                    className="w-full bg-brand-primary text-white text-sm font-semibold py-2 px-3 rounded-md hover:bg-brand-primary/80"
                                >
                                    <i className="fas fa-wand-magic-sparkles mr-1"></i> AI Enhancer
                                </button>
                            </div>
                        ))}
                    </div>
                     {filteredProducts.length === 0 && (
                        <div className="text-center py-8 text-medium-text">
                            <p>No products match your search.</p>
                        </div>
                    )}
                </div>
            </Card>
            
            <AiEnhancerModal
                isOpen={isEnhancerModalOpen}
                onClose={() => setIsEnhancerModalOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
};
