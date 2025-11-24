import React from 'react';

interface ScoreDonutProps {
  score: number;
}

const ScoreDonut: React.FC<ScoreDonutProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 45; // 2 * pi * r
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor = score > 80 ? '#22C55E' : score > 60 ? '#FBBF24' : '#EF4444';

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-light-border dark:text-dark-border"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          stroke={scoreColor}
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
         {/* Glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          stroke={scoreColor}
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out', opacity: 0.5 }}
          filter="url(#glow)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-dark-text dark:text-light-text">{score}</span>
        <span className="text-xs text-medium-text-light dark:text-medium-text -mt-1">/100</span>
      </div>
    </div>
  );
};

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onMenuClick?: () => void;
}

const ThemeToggle: React.FC<Pick<HeaderProps, 'theme' | 'toggleTheme'>> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center text-medium-text-light dark:text-medium-text hover:bg-slate-200 dark:hover:bg-dark-border transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-15.66l-.707.707M4.34 19.66l-.707.707M21 12h-1M4 12H3m15.66 8.66l-.707-.707M4.34 4.34l-.707-.707" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )}
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onMenuClick }) => {
  return (
    <header className="h-16 bg-light-card/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-light-border dark:border-white/10">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-medium-text-light dark:text-medium-text hover:bg-slate-200 dark:hover:bg-dark-border transition-colors"
              aria-label="Open menu"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          <div>
            <h1 className="text-2xl font-bold tracking-wider">AI <span className="text-brand-primary">FORCE</span></h1>
            <p className="hidden sm:block text-xs text-medium-text-light dark:text-medium-text tracking-wide -mt-1">The World's First AI Visibility Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <p className="hidden sm:block text-sm font-semibold text-medium-text-light dark:text-medium-text">AI Visibility Score</p>
            <ScoreDonut score={88} />
        </div>
      </div>
    </header>
  );
};