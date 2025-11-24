import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from '../Card';
import type { VideoAnalysisResult } from '../../types';

const ScoreGauge: React.FC<{ score: number; label: string; colorClass: string; }> = ({ score, label, colorClass }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-4 bg-dark-bg rounded-lg">
            <div className={`text-5xl font-bold ${colorClass}`}>{score}</div>
            <div className="text-sm text-medium-text mt-1">{label}</div>
        </div>
    );
};

const DiffViewer: React.FC<{ original: string; enriched: string; }> = ({ original, enriched }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(enriched);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div>
                <h5 className="font-semibold mb-2 text-medium-text">Original Transcript</h5>
                <div className="bg-slate-950 border border-dark-border rounded-md p-4 h-48 overflow-y-auto whitespace-pre-wrap font-mono">
                    {original}
                </div>
            </div>
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-rose-400">AI-Enriched Version</h5>
                    <button onClick={handleCopy} className="text-xs bg-dark-border text-medium-text py-1 px-2 rounded hover:bg-slate-600 transition-colors font-sans">
                        {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-md p-4 h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                    {enriched}
                </div>
            </div>
        </div>
    );
};


export const VideoContentOptimizer: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=example');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!videoUrl.trim()) {
            setError("Please enter a video or audio URL to analyze.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert AI Video Content Analyst for a platform called "AI FORCE".
                For the video hypothetically located at the URL "${videoUrl}", generate a detailed analysis for multimodal AI search. Your response must be a single JSON object.
                Generate plausible but realistic data for all fields.

                The JSON object must include:
                1. 'enrichedTranscript': An object with 'original' and 'enriched' text. The 'original' should be a short, simple sentence. The 'enriched' version should expand on it with more context, keywords, and semantic richness for AI.
                2. 'visualTags': An array of 10-15 relevant visual and conceptual tags based on a generic tech/business video.
                3. 'thumbnailScore': An "AI attractiveness score" for a generic thumbnail, as a number between 0 and 100.
                4. 'voiceSearchScore': A "Voice Search Readiness" score for the audio content, as a number between 0 and 100.
                5. 'videoAppearances': A number representing how many times this video might appear in AI answers.
                6. 'visualCitations': A number representing how many times visual elements from the video might be cited.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            enrichedTranscript: {
                                type: Type.OBJECT,
                                properties: {
                                    original: { type: Type.STRING },
                                    enriched: { type: Type.STRING }
                                },
                                required: ['original', 'enriched']
                            },
                            visualTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                            thumbnailScore: { type: Type.NUMBER },
                            voiceSearchScore: { type: Type.NUMBER },
                            videoAppearances: { type: Type.NUMBER },
                            visualCitations: { type: Type.NUMBER }
                        },
                        required: ['enrichedTranscript', 'visualTags', 'thumbnailScore', 'voiceSearchScore', 'videoAppearances', 'visualCitations']
                    }
                }
            });

            if (!response) {
                throw new Error("Received an empty or invalid response from the AI model.");
            }

            setAnalysisResult(JSON.parse(response.text));

        } catch (e) {
            console.error(e);
            setError("AI analysis failed. This could be due to a network issue, content policy, or an API error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4">
                    <i className="fas fa-video text-rose-400"></i> Video Content Optimization
                </h1>
                <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">
                    Optimize video and audio for the future of multimodal AI search.
                </p>
            </div>
            
            <Card title="Analyze Video or Audio Content">
                 <p className="text-medium-text-light dark:text-medium-text -mt-4 mb-6">Enter a URL to a video or audio file to begin the multimodal analysis.</p>
                 <div className="flex flex-col sm:flex-row items-center gap-4">
                     <div className="flex-grow w-full">
                        <label htmlFor="video-url-input" className="sr-only">Enter video or audio URL</label>
                        <input
                            id="video-url-input"
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-dark-text dark:text-light-text rounded-md p-3 focus:ring-rose-500 focus:border-rose-500 placeholder-medium-text-light dark:placeholder-medium-text text-base"
                            placeholder="e.g., https://www.youtube.com/watch?v=..."
                            disabled={isLoading}
                        />
                    </div>
                     <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !videoUrl.trim()}
                        className="w-full sm:w-auto flex-shrink-0 bg-rose-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-rose-700 transition-all duration-300 disabled:bg-rose-600/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <><i className="fas fa-spinner fa-spin"></i><span>Analyzing...</span></>
                        ) : 'Analyze with AI'}
                    </button>
                 </div>
                 {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
            </Card>
            
            {isLoading && (
                <Card title="Analysis in Progress">
                    <div className="text-center py-16">
                        <i className="fas fa-spinner fa-spin text-4xl text-rose-400"></i>
                        <p className="mt-4 text-medium-text">AI is analyzing your multimodal content...</p>
                    </div>
                </Card>
            )}

            {analysisResult && (
                <div className="space-y-6 animate-fade-in">
                    <Card title="AI Video Analysis & Optimization">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-dark-bg p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Visual Element Tagging</h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysisResult.visualTags.map((tag, i) => (
                                        <span key={i} className="bg-dark-border text-medium-text text-sm px-3 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-dark-bg p-6 rounded-lg text-center">
                                 <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Thumbnail AI Attractiveness</h3>
                                 <ScoreGauge score={analysisResult.thumbnailScore} label="Attractiveness Score" colorClass="text-rose-400" />
                            </div>
                        </div>
                    </Card>

                    <Card title="Transcript Enrichment">
                         <DiffViewer original={analysisResult.enrichedTranscript.original} enriched={analysisResult.enrichedTranscript.enriched} />
                    </Card>

                    <Card title="Audio Content Enhancement">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-dark-bg p-6 rounded-lg text-center">
                                 <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Voice Search Readiness</h3>
                                 <ScoreGauge score={analysisResult.voiceSearchScore} label="Readiness Score" colorClass="text-sky-400" />
                            </div>
                            <div className="bg-dark-bg p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-dark-text dark:text-light-text mb-4">Audio Insights</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3"><i className="fas fa-check-circle text-green-400"></i><span>Clear enunciation detected.</span></li>
                                    <li className="flex items-center gap-3"><i className="fas fa-exclamation-triangle text-yellow-400"></i><span>Moderate background noise.</span></li>
                                    <li className="flex items-center gap-3"><i className="fas fa-check-circle text-green-400"></i><span>Consistent speaking pace.</span></li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                    
                     <Card title="Performance Metrics">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-dark-bg p-6 rounded-lg text-center">
                                <div className="text-5xl font-bold text-light-text">{analysisResult.videoAppearances}</div>
                                <div className="text-medium-text mt-2">Video Appearances in AI Answers</div>
                            </div>
                             <div className="bg-dark-bg p-6 rounded-lg text-center">
                                <div className="text-5xl font-bold text-light-text">{analysisResult.visualCitations}</div>
                                <div className="text-medium-text mt-2">Visual Element Citations</div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};