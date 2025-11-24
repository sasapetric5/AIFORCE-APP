

import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  setActiveModule: (id: string) => void;
}

const menuItems = [
    { id: 'dashboard', label: 'Home', icon: 'fas fa-home' },
    { id: 'earn', label: 'Earn with AI', icon: 'fas fa-dollar-sign' },
    { id: 'reports', label: 'History', icon: 'fas fa-history' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
];

const moduleItems = [
    { id: 'geo_command_center', label: 'GEO Command Center', icon: 'fas fa-globe-americas' },
    { id: 'ai_visibility_analyzer', label: 'AI Visibility Analyzer', icon: 'fas fa-chart-pie' },
    { id: 'content_optimization_engine', label: 'Content Optimization', icon: 'fas fa-magic' },
    { id: 'technical_geo_auditor', label: 'Technical Auditor', icon: 'fas fa-shield-alt' },
    { id: 'competitive_domination_dashboard', label: 'Domination Dashboard', icon: 'fas fa-chess-queen' },
    { id: 'brand_power_scorecard', label: 'Brand Scorecard', icon: 'fas fa-trophy' },
    { id: 'topic_conquest_engine', label: 'Topic Conquest', icon: 'fas fa-crosshairs' },
    { id: 'performance_analytics', label: 'Performance & ROI', icon: 'fas fa-sack-dollar' },
    { id: 'universal_platform_integration_hub', label: 'E-commerce Hub', icon: 'fas fa-store' },
    { id: 'product_schema_factory', label: 'Product Schema Factory', icon: 'fas fa-tags' },
    { id: 'ai_product_description_optimizer', label: 'Product Description AI', icon: 'fas fa-pencil-alt' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeModule, setActiveModule }) => {
    
    const handleNavigation = (id: string) => {
        if (id === 'earn' || id === 'profile') {
            alert('This feature is coming soon!');
        } else {
            setActiveModule(id);
        }
    }
    
    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border z-50 flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-light-border dark:border-dark-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-dark-text dark:text-light-text">AI <span className="text-brand-primary">FORCE</span></span>
                    </div>
                    <button onClick={onClose} className="md:hidden text-medium-text-light dark:text-medium-text" aria-label="Close menu">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-4">
                    {/* MENU */}
                    <h3 className="px-4 py-2 text-xs font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider">Menu</h3>
                    <ul>
                        {menuItems.map(item => (
                             <li key={item.id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation(item.id); }}
                                   className={`flex items-center px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                     activeModule === item.id
                                       ? 'bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary font-semibold'
                                       : 'text-medium-text-light dark:text-medium-text hover:bg-slate-200 dark:hover:bg-dark-border'
                                   }`}
                                >
                                    <i className={`${item.icon} w-6 text-center text-base`}></i>
                                    <span className="ml-3">{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* MODULES */}
                     <h3 className="px-4 py-2 mt-4 text-xs font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider">Modules</h3>
                    <ul>
                        {moduleItems.map(item => (
                             <li key={item.id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation(item.id); }}
                                   className={`flex items-center px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                     activeModule === item.id
                                       ? 'bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary font-semibold'
                                       : 'text-medium-text-light dark:text-medium-text hover:bg-slate-200 dark:hover:bg-dark-border'
                                   }`}
                                >
                                    <i className={`${item.icon} w-6 text-center text-base`}></i>
                                    <span className="ml-3">{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-light-border dark:border-dark-border">
                    <div className="bg-green-100 dark:bg-green-500/10 rounded-lg p-4 text-center">
                        <div className="sidebar-diamond-container mx-auto mb-2">
                             <div className="diamond">
                                <div className="face face1">AI<br/>FORCE</div>
                                <div className="face face2">AI<br/>FORCE</div>
                                <div className="face face3"></div>
                                <div className="face face4">AI<br/>FORCE</div>
                                <div className="face face5"></div>
                                <div className="face face6"></div>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-green-800 dark:text-green-400">AI FORCE PRO</p>
                        <p className="text-xs text-green-700 dark:text-green-500 mt-1">You have unlimited access!</p>
                    </div>
                </div>

            </aside>
        </>
    );
};