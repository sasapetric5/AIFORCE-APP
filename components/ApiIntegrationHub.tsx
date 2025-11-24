
import React, { useState, Fragment } from 'react';
import { Card } from './Card';

const initialConnections = [
    { id: 'openai', name: 'OpenAI (ChatGPT)', icon: 'fas fa-robot', connected: true },
    { id: 'google', name: 'Google AI Studio (Gemini)', icon: 'fab fa-google', connected: true },
    { id: 'anthropic', name: 'Anthropic (Claude)', icon: 'fas fa-brain', connected: false },
    { id: 'perplexity', name: 'Perplexity', icon: 'fas fa-search', connected: false },
    { id: 'deepseek', name: 'DeepSeek', icon: 'fas fa-terminal', connected: false },
    { id: 'copilot', name: 'Microsoft (Copilot)', icon: 'fab fa-microsoft', connected: false },
    { id: 'mistral', name: 'Mistral', icon: 'fas fa-wind', connected: false },
    { id: 'llama', name: 'Meta (Llama)', icon: 'fas fa-paw', connected: false },
    { id: 'poe', name: 'Poe', icon: 'fas fa-wand-magic-sparkles', connected: false },
];

const initialDistributionContent = [
    {
        id: 1,
        title: 'Ultimate Guide to AI SEO',
        lastModified: '2 days ago',
        platforms: {
            openai: { status: 'Published', version: 3, performance: { score: 92, citations: 45 }, history: [{v: 3, date: '2024-07-15', note: 'Optimized for conversational flow.'}, {v: 2, date: '2024-07-10', note: 'Added new section on LLMs.'}] },
            google: { status: 'Published', version: 3, performance: { score: 88, citations: 38 }, history: [{v: 3, date: '2024-07-15', note: 'Enhanced E-A-A-T signals.'}, {v: 2, date: '2024-07-10', note: 'Initial publish.'}] },
        }
    },
    {
        id: 2,
        title: 'Top 10 LLM Trends in 2024',
        lastModified: '5 hours ago',
        platforms: {
             openai: { status: 'Published', version: 1, performance: { score: 85, citations: 29 }, history: [{v: 1, date: '2024-07-16', note: 'Initial publish.'}] },
        }
    },
    {
        id: 3,
        title: 'How to Optimize for Perplexity',
        lastModified: '1 day ago',
        platforms: {}
    },
     {
        id: 4,
        title: 'The Future of AI in Marketing',
        lastModified: '3 days ago',
        platforms: {
            google: { status: 'Published', version: 2, performance: { score: 95, citations: 51 }, history: [{v: 2, date: '2024-07-14', note: 'Added future predictions section.'}, {v: 1, date: '2024-07-12', note: 'Initial publish.'}] },
        }
    },
];

const sdkExamples = {
    publish: `import { AIFORCEClient } from '@aiforce/sdk';

const client = new AIFORCEClient({ apiKey: 'YOUR_API_KEY' });

async function publishContent(content) {
  const result = await client.publish({
    title: content.title,
    body: content.body,
    targetPlatforms: ['openai', 'google'],
  });
  console.log('Publish result:', result);
}`,
    getStatus: `import { AIFORCEClient } from '@aiforce/sdk';

const client = new AIFORCEClient({ apiKey: 'YOUR_API_KEY' });

async function checkStatus(contentId) {
  const status = await client.getContentStatus({ id: contentId });
  console.log('Content status:', status);
}`,
    update: `import { AIFORCEClient } from '@aiforce/sdk';

const client = new AIFORCEClient({ apiKey: 'YOUR_API_KEY' });

async function updateContent(contentId, newBody) {
  const result = await client.update({
    id: contentId,
    body: newBody,
  });
  console.log('Update result:', result);
}`
};


const PublishModal: React.FC<{
    content: any;
    connections: any[];
    onClose: () => void;
    onPublish: (contentId: number, platformIds: string[]) => void;
    isPublishing: boolean;
}> = ({ content, connections, onClose, onPublish, isPublishing }) => {
    const connectedPlatforms = connections.filter(c => c.connected);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    
    const handleTogglePlatform = (id: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedPlatforms(connectedPlatforms.map(p => p.id));
        } else {
            setSelectedPlatforms([]);
        }
    };

    const handlePublishClick = () => {
        if (selectedPlatforms.length > 0) {
            onPublish(content.id, selectedPlatforms);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-lg font-bold">Publish Content</h3>
                    <p className="text-sm text-medium-text-light dark:text-medium-text">{content.title}</p>
                </header>
                <main className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Select platforms to publish/sync to:</h4>
                        <label htmlFor="select-all-platforms" className="flex items-center text-sm cursor-pointer">
                            <input
                                id="select-all-platforms"
                                type="checkbox"
                                className="h-4 w-4 rounded bg-dark-border border-medium-text text-indigo-500 focus:ring-indigo-400"
                                onChange={handleSelectAll}
                                checked={selectedPlatforms.length === connectedPlatforms.length && connectedPlatforms.length > 0}
                            />
                            <span className="ml-2">Select All</span>
                        </label>
                    </div>
                    <div className="space-y-3">
                        {connectedPlatforms.map(conn => (
                            <label htmlFor={`platform-${conn.id}`} key={conn.id} className="flex items-center p-3 bg-light-bg dark:bg-dark-bg rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-dark-border">
                                <input
                                    id={`platform-${conn.id}`}
                                    type="checkbox"
                                    className="h-5 w-5 rounded bg-dark-border border-medium-text text-indigo-500 focus:ring-indigo-400"
                                    checked={selectedPlatforms.includes(conn.id)}
                                    onChange={() => handleTogglePlatform(conn.id)}
                                />
                                <div className="ml-4 flex items-center gap-3">
                                    <i className={`${conn.icon} text-xl`}></i>
                                    <span className="font-medium">{conn.name}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </main>
                 <footer className="p-4 border-t border-light-border dark:border-dark-border flex justify-end gap-3">
                    <button onClick={onClose} className="py-2 px-4 text-sm font-semibold rounded-md bg-slate-200 dark:bg-dark-border hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                    <button onClick={handlePublishClick} disabled={isPublishing || selectedPlatforms.length === 0} className="py-2 px-4 text-sm font-semibold rounded-md bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500/50 flex items-center gap-2">
                        {isPublishing && <i className="fas fa-spinner fa-spin"></i>}
                        {isPublishing ? 'Publishing...' : `Publish to ${selectedPlatforms.length} Platform(s)`}
                    </button>
                </footer>
            </div>
        </div>
    );
};

const HistoryModal: React.FC<{ content: any; connections: any[]; onClose: () => void; }> = ({ content, connections, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                 <header className="p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-lg font-bold">Version History</h3>
                    <p className="text-sm text-medium-text-light dark:text-medium-text">{content.title}</p>
                </header>
                <main className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-8">
                        {Object.keys(content.platforms).map(platformId => {
                             const platformDetails = connections.find(c => c.id === platformId);
                             const platformData = content.platforms[platformId];
                             if (!platformDetails || platformData.status !== 'Published') return null;

                             return (
                                 <div key={platformId}>
                                     <h4 className="font-semibold text-lg flex items-center gap-3 mb-4"><i className={platformDetails.icon}></i> {platformDetails.name}</h4>
                                     <ol className="relative border-l border-light-border dark:border-dark-border ml-2">
                                         {platformData.history.map((item: any, index: number) => (
                                              <li key={index} className="mb-6 ml-6">
                                                <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full -left-4 ring-4 ring-light-card dark:ring-dark-card text-white text-xs font-bold">v{item.v}</span>
                                                <div className="ml-4 p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                                                    <p className="font-semibold text-sm">{item.note}</p>
                                                    <time className="block text-xs font-normal leading-none text-medium-text-light dark:text-medium-text mt-1">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                                </div>
                                            </li>
                                         ))}
                                     </ol>
                                 </div>
                             );
                        })}
                    </div>
                </main>
            </div>
        </div>
    )
};


export const ApiIntegrationHub: React.FC = () => {
    const [apiConnections, setApiConnections] = useState(initialConnections);
    const [distributionContent, setDistributionContent] = useState(initialDistributionContent);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState<any | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [sdkTab, setSdkTab] = useState<keyof typeof sdkExamples>('publish');
    const [webhooks, setWebhooks] = useState(['https://api.example.com/v1/hooks/aiforce']);
    const [newWebhook, setNewWebhook] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const toggleConnection = (id: string) => {
        setApiConnections(prev =>
            prev.map(conn =>
                conn.id === id ? { ...conn, connected: !conn.connected } : conn
            )
        );
    };
    
    const handleCopyCode = () => {
        navigator.clipboard.writeText(sdkExamples[sdkTab]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };
    
    const handleAddWebhook = (e: React.FormEvent) => {
        e.preventDefault();
        if(newWebhook && !webhooks.includes(newWebhook)) {
            setWebhooks([...webhooks, newWebhook]);
            setNewWebhook('');
        }
    };

    const handleOpenPublishModal = (content: any) => {
        setSelectedContent(content);
        setIsPublishModalOpen(true);
    };
    
    const handleOpenHistoryModal = (content: any) => {
        setSelectedContent(content);
        setIsHistoryModalOpen(true);
    };

    const handlePublish = (contentId: number, platformIds: string[]) => {
        setIsPublishing(true);
        setTimeout(() => {
            setDistributionContent(prevContent => 
                prevContent.map(item => {
                    if (item.id === contentId) {
                        const newPlatforms = { ...item.platforms };
                        platformIds.forEach(pId => {
                            const currentVersion = newPlatforms[pId as keyof typeof newPlatforms]?.version || 0;
                            newPlatforms[pId as keyof typeof newPlatforms] = {
                                status: 'Published',
                                version: currentVersion + 1,
                                performance: { score: Math.floor(80 + Math.random() * 20), citations: Math.floor(10 + Math.random() * 40) },
                                history: [
                                    {v: currentVersion + 1, date: new Date().toISOString().split('T')[0], note: 'Synced latest changes.'},
                                    ...(newPlatforms[pId as keyof typeof newPlatforms]?.history || [{v: currentVersion, date: '2024-07-01', note: 'Initial publish.'}])
                                ]
                            };
                        });
                        return { ...item, platforms: newPlatforms };
                    }
                    return item;
                })
            );
            setIsPublishing(false);
            setIsPublishModalOpen(false);
        }, 1500);
    };

    const draftsCount = distributionContent.filter(item => Object.keys(item.platforms).length === 0).length;

    return (
        <Fragment>
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-4">
                        <i className="fas fa-plug text-indigo-400"></i> API Integration Hub
                    </h1>
                    <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">
                        Connect, distribute, and build with the AI FORCE ecosystem.
                    </p>
                </div>

                <Card title="Direct AI Platform Connections">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {apiConnections.map(conn => (
                            <div key={conn.id} className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg flex items-center justify-between border border-light-border dark:border-dark-border">
                                <div className="flex items-center gap-4">
                                    <div className={`text-2xl ${conn.connected ? 'text-green-400' : 'text-medium-text-light dark:text-medium-text'}`}><i className={conn.icon}></i></div>
                                    <span className="font-semibold text-dark-text dark:text-light-text">{conn.name}</span>
                                </div>
                                <button onClick={() => toggleConnection(conn.id)} className={`text-sm font-bold py-2 px-4 rounded-md transition-colors ${conn.connected ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                                    {conn.connected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
                
                <Card title="Rate Limit Management">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {apiConnections.filter(c => c.connected).map(conn => (
                            <div key={conn.id}>
                                <div className="flex justify-between items-center mb-1 text-sm"><span className="font-semibold flex items-center gap-2"><i className={conn.icon}></i> {conn.name}</span><span className="text-medium-text-light dark:text-medium-text">150 / 1,000 RPM</span></div>
                                <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2.5"><div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '15%' }}></div></div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-light-border dark:border-white/10">
                        <h3 className="text-lg font-semibold text-dark-text dark:text-light-text">Automated Content Distribution</h3>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                             <span className="text-sm text-medium-text-light dark:text-medium-text">{distributionContent.length} total items</span>
                             <button disabled={draftsCount === 0} className="text-sm font-semibold py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500/50 flex items-center gap-2">
                                Publish All Drafts ({draftsCount})
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-medium-text-light dark:text-medium-text uppercase">
                                <tr>
                                    <th className="p-3">Content</th>
                                    <th className="p-3 text-center">Distribution</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {distributionContent.map(item => (
                                    <tr key={item.id} className="border-t border-light-border dark:border-dark-border">
                                        <td className="p-3">
                                            <div className="font-semibold text-dark-text dark:text-light-text">{item.title}</div>
                                            <div className="text-xs text-medium-text-light dark:text-medium-text">Last modified: {item.lastModified}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center justify-center gap-3">
                                                {apiConnections.map(conn => {
                                                    const platformData = item.platforms[conn.id as keyof typeof item.platforms];
                                                    const isPublished = platformData && platformData.status === 'Published';
                                                    return (
                                                         <div key={conn.id} className="relative group">
                                                            <i className={`${conn.icon} text-xl ${isPublished ? 'text-green-400' : 'text-medium-text-light dark:text-medium-text opacity-50'}`}></i>
                                                            {isPublished && (
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                                                    <div className="font-bold">{conn.name}</div>
                                                                    <div>Score: {platformData.performance?.score}</div>
                                                                    <div>Citations: {platformData.performance?.citations}</div>
                                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenPublishModal(item)} className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs py-1 px-3 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20">Publish</button>
                                                <button onClick={() => handleOpenHistoryModal(item)} className="text-medium-text-light dark:text-medium-text hover:text-light-text font-semibold text-xs py-1 px-3 rounded-md bg-slate-200 dark:bg-dark-border hover:bg-slate-300 dark:hover:bg-slate-600">History</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
                
                <Card title="Developer-Centric Tools">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                            <h4 className="font-semibold text-dark-text dark:text-light-text mb-2">SDK for Custom Integrations</h4>
                             <div className="border-b border-dark-border mb-2 flex space-x-1">
                                {(Object.keys(sdkExamples) as Array<keyof typeof sdkExamples>).map(key => (
                                    <button key={key} onClick={() => setSdkTab(key)} className={`px-3 py-1.5 text-xs font-medium rounded-t-md ${sdkTab === key ? 'bg-slate-900 text-white' : 'bg-dark-border text-medium-text'}`}>{key}</button>
                                ))}
                             </div>
                            <div className="bg-slate-900 text-sm rounded-md rounded-tl-none overflow-hidden relative">
                                <pre className="p-4 overflow-x-auto"><code className="language-javascript text-slate-300">{sdkExamples[sdkTab].trim()}</code></pre>
                                <button onClick={handleCopyCode} className="absolute top-2 right-2 text-xs bg-dark-border text-medium-text py-1 px-2 rounded hover:bg-slate-600">{copySuccess ? 'Copied!' : 'Copy'}</button>
                            </div>
                        </div>
                        <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
                            <h4 className="font-semibold text-dark-text dark:text-light-text mb-2">Webhook Ecosystem</h4>
                            <ul className="space-y-2 mb-4">
                                {webhooks.map(url => (
                                    <li key={url} className="flex items-center justify-between bg-light-card dark:bg-dark-card p-3 rounded-md text-sm font-mono text-medium-text-light dark:text-medium-text">
                                        <span>{url}</span>
                                        <button className="text-red-400/70 hover:text-red-400 text-xs">Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form onSubmit={handleAddWebhook} className="flex gap-2">
                                <input type="url" value={newWebhook} onChange={e => setNewWebhook(e.target.value)} placeholder="https://your-endpoint.com/webhook" className="flex-grow w-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-sm rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
                                <button type="submit" className="text-sm bg-indigo-500 text-white py-2 px-3 rounded-md hover:bg-indigo-600 font-semibold">Add</button>
                            </form>
                        </div>
                    </div>
                </Card>

            </div>
            
            {isPublishModalOpen && selectedContent && (
                <PublishModal content={selectedContent} connections={apiConnections} onClose={() => setIsPublishModalOpen(false)} onPublish={handlePublish} isPublishing={isPublishing} />
            )}

            {isHistoryModalOpen && selectedContent && (
                <HistoryModal content={selectedContent} connections={apiConnections} onClose={() => setIsHistoryModalOpen(false)} />
            )}
        </Fragment>
    );
};
