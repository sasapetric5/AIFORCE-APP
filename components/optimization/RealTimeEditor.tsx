import React, { useState, useRef, useEffect } from 'react';
import type { Suggestion } from '../../types';

interface RealTimeEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    suggestions: Suggestion[];
    onApplySuggestion: (id: number) => void;
    onFormat: (type: string) => void;
    onRefreshSuggestions: () => void;
    isRefreshingSuggestions: boolean;
}

export const RealTimeEditor: React.FC<RealTimeEditorProps> = ({
    content,
    onContentChange,
    suggestions,
    onApplySuggestion,
    onFormat,
    onRefreshSuggestions,
    isRefreshingSuggestions,
}) => {
    const [wordCount, setWordCount] = useState(0);
    const editorRef = useRef<HTMLDivElement>(null);

    const calculateWordCount = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    useEffect(() => {
        // Sync the DOM with the content prop, preventing cursor jumps on user input
        if (editorRef.current && editorRef.current.innerHTML !== content) {
            editorRef.current.innerHTML = content;
        }
        setWordCount(calculateWordCount(content));
    }, [content]);

    const impactColors: Record<Suggestion['impact'], string> = {
        High: 'text-green-400',
        Medium: 'text-yellow-400',
        Low: 'text-medium-text-light dark:text-medium-text',
    };
    
    const typeColors: Record<Suggestion['type'], string> = {
        Structure: 'bg-blue-500/20 text-blue-300',
        Semantic: 'bg-purple-500/20 text-purple-300',
        Format: 'bg-teal-500/20 text-teal-300',
        Content: 'bg-orange-500/20 text-orange-300',
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            {/* Editor Panel */}
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">Content Editor</h4>
                    <span className="text-sm text-medium-text-light dark:text-medium-text">Word Count: {wordCount}</span>
                </div>
                <div className="flex gap-2 mb-4 flex-wrap">
                    <button onClick={() => onFormat('heading')} className="tool-btn">📝 Add Heading</button>
                    <button onClick={() => onFormat('qa')} className="tool-btn">❓ Add Q&A</button>
                    <button onClick={() => onFormat('list')} className="tool-btn">📋 Add List</button>
                    <button onClick={() => onFormat('bold')} className="tool-btn">**Bold**</button>
                </div>
                <div 
                    ref={editorRef}
                    contentEditable 
                    onInput={(e) => onContentChange(e.currentTarget.innerHTML)}
                    className="flex-grow bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md p-4 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-brand-primary prose dark:prose-invert max-w-none text-dark-text dark:text-light-text"
                />
            </div>

            {/* Suggestions Panel */}
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">AI Suggestions</h4>
                    <button onClick={onRefreshSuggestions} className="tool-btn" disabled={isRefreshingSuggestions}>
                         {isRefreshingSuggestions ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : '🔄 Refresh'}
                    </button>
                </div>
                <div className="space-y-2 overflow-y-auto">
                    {suggestions.map(s => (
                        <div 
                            key={s.id}
                            onClick={() => !s.applied && onApplySuggestion(s.id)}
                            className={`p-3 rounded-lg border border-light-border dark:border-dark-border transition-all duration-300 ${s.applied ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-dark-border/50 cursor-pointer'}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[s.type]}`}>{s.type}</span>
                                <span className={`text-xs font-bold ${impactColors[s.impact]}`}>{s.impact} Impact</span>
                            </div>
                            <p className="text-sm text-medium-text-light dark:text-medium-text">{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>
             <style>{`
                .tool-btn {
                    background-color: #FFFFFF;
                    color: #1E293B;
                    border: 1px solid #E2E8F0;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9em;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .dark .tool-btn {
                    background-color: #1E293B;
                    color: #E2E8F0;
                    border: 1px solid #334155;
                }
                .tool-btn:hover:not(:disabled) {
                    background-color: #4F46E5;
                    color: white;
                    border-color: #4F46E5;
                }
                .tool-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};