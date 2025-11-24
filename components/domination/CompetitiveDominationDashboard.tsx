import React, { useState, useEffect } from 'react';
import type { Notification } from '../../types';

type LeaderboardItem = {
    rank: number;
    name: string;
    score: number;
    visibility: number;
    momentum: string;
    gap: number;
    gapTrend: 'up' | 'down' | 'closing';
};

const initialLeaderboard: LeaderboardItem[] = [
    { rank: 1, name: 'AI Marketing Pro', score: 85, visibility: 92, momentum: '↗️ Stable', gap: 7, gapTrend: 'up' },
    { rank: 2, name: 'YOUR BRAND', score: 78, visibility: 85, momentum: '↗️ Accelerating', gap: 0, gapTrend: 'closing' },
    { rank: 3, name: 'SEO Master', score: 72, visibility: 78, momentum: '→ Stable', gap: -6, gapTrend: 'down' },
    { rank: 4, name: 'Content Genius', score: 68, visibility: 72, momentum: '↘️ Declining', gap: -10, gapTrend: 'down' },
    { rank: 5, name: 'Digital Vision', score: 65, visibility: 68, momentum: '→ Stable', gap: -13, gapTrend: 'down' },
];

const conquestCampaigns = [
    {
        icon: 'fa-user-secret',
        name: 'Steal Their Visibility',
        description: "Target competitor's top-performing content and outrank them with superior optimization.",
        metrics: { gain: '+15%', timeline: '2-3 wks', impact: 'High' }
    },
    {
        icon: 'fa-search-dollar',
        name: 'Gap Exploitation',
        description: "Attack competitor weaknesses and content gaps they're not covering effectively.",
        metrics: { gain: '+12%', timeline: '1-2 wks', impact: 'Medium' }
    },
    {
        icon: 'fa-bolt',
        name: 'Quick Response',
        description: 'Rapid deployment campaigns to counter competitor moves and market shifts.',
        metrics: { gain: '+8%', timeline: '24-48h', impact: 'High' }
    }
];

const weaknesses = [
    { icon: 'fa-unlink', title: 'Poor Source Diversity', details: '72% of citations from only 3 domains' },
    { icon: 'fa-clock', title: 'Content Freshness Gap', details: '45% of content older than 6 months' },
    { icon: 'fa-mobile-alt', title: 'Platform Gaps', details: 'Weak presence on Claude and Perplexity' }
];

const strategies = [
    { icon: 'fa-chart-line', title: 'Content Themes', details: 'Focus: AI ethics, machine learning tutorials' },
    { icon: 'fa-users', title: 'Author Network', details: '8 key influencers, 3 research institutions' },
    { icon: 'fa-calendar-alt', title: 'Publication Rhythm', details: '2 major pieces weekly, daily social updates' }
];

const alerts = [
    { type: 'critical', icon: 'fa-exclamation-triangle', message: '#1 Competitor launching new AI tool next week', time: '2 hours ago' },
    { type: 'opportunity', icon: 'fa-bullseye', message: 'Gap identified: "AI Healthcare Applications" - low competition', time: '4 hours ago' },
    { type: 'critical', icon: 'fa-chart-line', message: 'Your Perplexity visibility dropped 8% - investigate immediately', time: '6 hours ago' }
];

export const CompetitiveDominationDashboard: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>(initialLeaderboard);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('2 min ago');
    const [loadingCampaign, setLoadingCampaign] = useState<string | null>(null);
    const [analysisTarget, setAnalysisTarget] = useState('YourBrand.com');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const showNotification = (message: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setLastUpdated('just now');
            showNotification('Competitive intelligence updated successfully! New weaknesses identified.');
        }, 2000);
    };

    const handleLaunchCampaign = (campaignName: string) => {
        setLoadingCampaign(campaignName);
        setTimeout(() => {
            setLoadingCampaign(null);
            showNotification(`Campaign launched: ${campaignName}. Initial impact expected within 24 hours.`);
        }, 1500);
    };
    
    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!analysisTarget.trim()) {
            showNotification("Please enter a brand or domain to analyze.");
            return;
        }
        setIsAnalyzing(true);
        showNotification(`Analyzing intelligence for ${analysisTarget}...`);
        setTimeout(() => {
            setIsAnalyzing(false);
            showNotification(`Analysis complete for ${analysisTarget}! Dashboard updated.`);
        }, 3000);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLeaderboard(prev => {
                const yourBrandIndex = prev.findIndex(item => item.name === 'YOUR BRAND');
                if (yourBrandIndex > 0) {
                    const leader = prev[yourBrandIndex - 1];
                    if (leader.gap > 1) {
                        const newLeader = { ...leader, gap: leader.gap - 1 };
                        const newBoard = [...prev];
                        newBoard[yourBrandIndex - 1] = newLeader;
                        return newBoard;
                    }
                }
                return prev;
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const renderGap = (item: LeaderboardItem) => {
        if (item.gapTrend === 'closing') {
            return <><i className="fas fa-bolt"></i> Closing fast</>;
        }
        if (item.gapTrend === 'up') {
            return <><i className="fas fa-caret-up"></i> +{item.gap} gap</>;
        }
        return <><i className="fas fa-caret-down"></i> {item.gap} gap</>;
    };

    return (
        <div className="text-white">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <i className="fas fa-chess-queen text-domination-red"></i> Competitive Domination Command
            </h1>

            {/* Notifications */}
            <div className="fixed top-28 right-5 z-[1000] space-y-2">
                {notifications.map(n => (
                    <div key={n.id} className="slide-in-right bg-gradient-to-r from-domination-red to-conquest-orange text-white py-3 px-5 rounded-lg shadow-2xl border-l-4 border-victory-gold">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-bullhorn"></i>
                            <span>{n.message}</span>
                        </div>
                    </div>
                ))}
            </div>

            <section className="bg-dark-card/50 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
                 <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-4">
                    <label htmlFor="analysis-target" className="sr-only">Analysis Target</label>
                    <input
                        id="analysis-target"
                        type="text"
                        value={analysisTarget}
                        onChange={(e) => setAnalysisTarget(e.target.value)}
                        className="w-full bg-slate-900 border border-dark-border text-light-text rounded-md p-3 focus:ring-domination-red focus:border-domination-red placeholder-medium-text"
                        placeholder="Enter brand name, domain..."
                        disabled={isAnalyzing}
                    />
                    <button type="submit" disabled={isAnalyzing || !analysisTarget} className="w-full sm:w-auto flex-shrink-0 bg-domination-red text-white font-semibold py-3 px-6 rounded-md hover:bg-domination-red-dark transition-colors disabled:bg-domination-red/50 flex items-center justify-center gap-2">
                        {isAnalyzing ? <><i className="fas fa-spinner fa-spin"></i><span>Analyzing...</span></> : 'Analyze Target'}
                    </button>
                </form>
            </section>

            <section className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-8 mb-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[radial-gradient(circle,rgba(220,38,38,0.2)_0%,rgba(220,38,38,0)_70%)] rounded-full -z-0"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <h2 className="text-2xl font-semibold">Domination War Room</h2>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <div className="text-center"><div className="text-3xl font-bold text-green-400">12</div><div className="text-sm opacity-80">Battles Won</div></div>
                            <div className="text-center"><div className="text-3xl font-bold text-yellow-400">8</div><div className="text-sm opacity-80">Active Battles</div></div>
                            <div className="text-center"><div className="text-3xl font-bold text-intelligence-blue">+28%</div><div className="text-sm opacity-80">Territory Gained</div></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10">
                        <div className="w-20 h-20 text-4xl font-bold rounded-full bg-domination-red flex items-center justify-center shadow-lg shadow-domination-red/20 flex-shrink-0">#2</div>
                        <div>
                            <h3 className="font-bold text-lg tracking-wider">DOMINATION STATUS: AGGRESSIVE EXPANSION</h3>
                            <p className="text-white/80 text-sm">You're gaining on the market leader. Current trajectory shows overtaking #1 position within 45 days. Execute conquest campaigns to accelerate victory.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-dark-card/80 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2"><i className="fas fa-trophy text-victory-gold"></i> Live Competition Leaderboard</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm opacity-80">Live - Updated {lastUpdated}</span>
                        <button onClick={handleRefresh} disabled={isRefreshing} className="bg-domination-red text-white py-2 px-4 rounded-md flex items-center gap-2 font-semibold hover:bg-domination-red-dark transition-colors disabled:bg-domination-red/50">
                            {isRefreshing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sync-alt"></i>}
                            {isRefreshing ? 'Gathering Intel...' : 'Refresh Intel'}
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-900/60 border border-white/5 rounded-lg p-6">
                        <ul className="space-y-2">
                            {leaderboard.map(item => (
                                <li key={item.rank} className={`flex items-center p-3 rounded-md transition-all duration-300 ${item.name === 'YOUR BRAND' ? 'bg-domination-red/10' : 'hover:bg-white/5'}`}>
                                    <div className={`w-10 h-10 flex-shrink-0 mr-4 rounded-lg flex items-center justify-center font-bold text-lg text-white ${item.rank === 1 ? 'bg-gradient-to-br from-victory-gold to-yellow-600' : item.rank === 2 ? 'bg-gradient-to-br from-blue-500 to-blue-700' : item.rank === 3 ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-domination-red'}`}>{item.rank}</div>
                                    <div className="flex-grow"><div className="font-semibold">{item.name}</div><div className="text-sm opacity-80 flex flex-wrap gap-4"><span>Score: {item.score}</span><span>Momentum: {item.momentum}</span></div></div>
                                    <div className={`text-sm flex items-center gap-2 ${item.gapTrend === 'up' ? 'text-red-400' : 'text-green-400'}`}>{renderGap(item)}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-900/60 border border-white/5 rounded-lg p-6 grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-lg text-center"><div className="text-2xl font-bold">78%</div><div className="text-sm opacity-80">Battle Readiness</div></div>
                        <div className="bg-white/5 p-4 rounded-lg text-center"><div className="text-2xl font-bold">12</div><div className="text-sm opacity-80">Weak Points</div></div>
                        <div className="bg-white/5 p-4 rounded-lg text-center"><div className="text-2xl font-bold">45d</div><div className="text-sm opacity-80">Victory ETA</div></div>
                        <div className="bg-white/5 p-4 rounded-lg text-center"><div className="text-2xl font-bold">8.2x</div><div className="text-sm opacity-80">ROI Potential</div></div>
                    </div>
                </div>
            </section>
            
             <section className="bg-dark-card/80 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-6"><i className="fas fa-crosshairs text-conquest-orange"></i> Conquest Campaigns</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {conquestCampaigns.map(campaign => (
                        <div key={campaign.name} className="bg-slate-900/60 border border-white/5 rounded-lg p-6 flex flex-col hover:border-conquest-orange transition-colors duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <i className={`fas ${campaign.icon} text-3xl text-conquest-orange`}></i>
                                <h3 className="font-bold text-lg">{campaign.name}</h3>
                            </div>
                            <p className="text-sm opacity-80 flex-grow mb-4">{campaign.description}</p>
                            <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                <div className="bg-white/5 p-2 rounded"><div className="font-bold text-green-400">{campaign.metrics.gain}</div><div className="text-xs opacity-80">Gain</div></div>
                                <div className="bg-white/5 p-2 rounded"><div className="font-bold">{campaign.metrics.timeline}</div><div className="text-xs opacity-80">Timeline</div></div>
                                <div className="bg-white/5 p-2 rounded"><div className="font-bold text-red-400">{campaign.metrics.impact}</div><div className="text-xs opacity-80">Impact</div></div>
                            </div>
                            <button onClick={() => handleLaunchCampaign(campaign.name)} disabled={!!loadingCampaign} className="w-full bg-conquest-orange text-white font-semibold py-2 px-4 rounded-md hover:bg-conquest-orange-dark transition-colors disabled:bg-conquest-orange/50 flex items-center justify-center gap-2">
                                {loadingCampaign === campaign.name ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-play"></i>}
                                {loadingCampaign === campaign.name ? 'Launching...' : 'Launch Campaign'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark-card/80 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-6"><i className="fas fa-search-minus text-intelligence-blue"></i> Advanced Intelligence: Weakness Identification</h2>
                    <ul className="space-y-4">
                        {weaknesses.map(item => (
                            <li key={item.title} className="flex items-start bg-slate-900/60 p-4 rounded-lg">
                                <i className={`fas ${item.icon} text-2xl text-intelligence-blue mr-4 mt-1`}></i>
                                <div><div className="font-semibold">{item.title}</div><div className="text-sm opacity-80">{item.details}</div></div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-dark-card/80 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                     <h2 className="text-xl font-semibold flex items-center gap-2 mb-6"><i className="fas fa-sitemap text-intelligence-blue"></i> Reverse-Engineer: Strategy Deconstruction</h2>
                    <ul className="space-y-4">
                        {strategies.map(item => (
                             <li key={item.title} className="flex items-start bg-slate-900/60 p-4 rounded-lg">
                                <i className={`fas ${item.icon} text-2xl text-intelligence-blue mr-4 mt-1`}></i>
                                <div><div className="font-semibold">{item.title}</div><div className="text-sm opacity-80">{item.details}</div></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};