
import React from 'react';
import type { ConceptMapData } from '../../types';

interface SemanticEnrichmentProps {
    onAddConcept: (concept: string) => void;
    isGeneratingEntities: boolean;
    onAddMissingEntities: () => void;
    isGeneratingMap: boolean;
    onGenerateConceptMap: () => void;
    conceptMapData: ConceptMapData | null;
}

const entities = [
    { name: 'Artificial Intelligence', relevance: '95%' },
    { name: 'Search Engine Optimization', relevance: '92%' },
    { name: 'ChatGPT', relevance: '88%' },
    { name: 'Machine Learning', relevance: '85%' },
    { name: 'Natural Language Processing', relevance: '82%' },
];

const concepts = [
    'AI Search Engines', 'Content Optimization', 'Semantic Search', 'LLM Training',
    'Prompt Engineering', 'Knowledge Graphs', 'Neural Networks', 'Digital Marketing'
];

const ConceptMap: React.FC<{ data: ConceptMapData }> = ({ data }) => {
    const mainNode = data.nodes.find(n => n.type === 'main');
    const relatedNodes = data.nodes.filter(n => n.type === 'related');
    const nodeCount = relatedNodes.length;

    const positions = relatedNodes.map((_, index) => {
        const angle = (index / nodeCount) * 2 * Math.PI;
        return {
            x: 50 + 40 * Math.cos(angle),
            y: 50 + 40 * Math.sin(angle),
        };
    });

    return (
        <div className="relative w-full aspect-square bg-dark-border/20 rounded-lg p-4 overflow-hidden">
             <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                {positions.map((pos, index) => (
                    <line
                        key={`line-${index}`}
                        x1="50%"
                        y1="50%"
                        x2={`${pos.x}%`}
                        y2={`${pos.y}%`}
                        stroke="#4F46E5"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                    />
                ))}
            </svg>
            {mainNode && (
                 <div className="absolute flex items-center justify-center text-center p-2 rounded-lg bg-brand-primary text-white font-bold shadow-lg"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        minWidth: '100px',
                        maxWidth: '140px',
                    }}>
                    {mainNode.label}
                </div>
            )}
            {relatedNodes.map((node, index) => (
                <div key={node.id} className="absolute text-center" style={{
                    top: `${positions[index].y}%`,
                    left: `${positions[index].x}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                }}>
                     <div className="p-2 rounded-md bg-dark-card text-light-text text-sm shadow-md max-w-[100px]">
                        {node.label}
                    </div>
                </div>
            ))}
        </div>
    );
};


export const SemanticEnrichment: React.FC<SemanticEnrichmentProps> = ({
    onAddConcept,
    isGeneratingEntities,
    onAddMissingEntities,
    isGeneratingMap,
    onGenerateConceptMap,
    conceptMapData
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entities Panel */}
            <div className="bg-dark-bg p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Key Entities Identified</h4>
                <div className="space-y-2">
                    {entities.map(entity => (
                        <div key={entity.name} className="flex justify-between items-center bg-dark-card p-3 rounded-md">
                            <span className="font-medium text-light-text">{entity.name}</span>
                            <span className="text-sm text-medium-text">{entity.relevance} relevance</span>
                        </div>
                    ))}
                </div>
                 <button 
                    onClick={onAddMissingEntities}
                    disabled={isGeneratingEntities}
                    className="w-full mt-4 bg-brand-secondary/80 text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary disabled:bg-brand-secondary/40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    {isGeneratingEntities ? (
                         <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating...</span>
                        </>
                    ) : (
                        '+ Add Missing Entities'
                    )}
                </button>
            </div>

            {/* Concepts Panel */}
            <div className="bg-dark-bg p-6 rounded-lg">
                <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-2">
                    <h4 className="text-lg font-semibold">Related Concepts</h4>
                     <button 
                        onClick={onGenerateConceptMap}
                        disabled={isGeneratingMap}
                        className="bg-brand-secondary/80 text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary disabled:bg-brand-secondary/40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         {isGeneratingMap ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                         ) : '🗺️'}
                         <span className="text-sm">
                             {conceptMapData ? 'Regenerate Map' : 'Generate Concept Map'}
                         </span>
                    </button>
                </div>
                {isGeneratingMap ? (
                     <div className="flex items-center justify-center w-full aspect-square bg-dark-border/20 rounded-lg">
                         <div className="text-center text-medium-text">
                            <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Map...
                         </div>
                     </div>
                ) : conceptMapData ? (
                    <ConceptMap data={conceptMapData} />
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {concepts.map(concept => (
                            <button key={concept} onClick={() => onAddConcept(concept)} className="bg-brand-primary text-white px-3 py-1.5 rounded-full text-sm hover:bg-brand-primary/80 transition-colors">
                                {concept}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};