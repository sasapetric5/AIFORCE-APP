import React, { useState, useMemo } from 'react';
import { Card } from '../Card';
import type { HistoryItem } from '../types';

interface ReportsProps {
  history: HistoryItem[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
  onRestore: (item: HistoryItem) => void;
}

export const Reports: React.FC<ReportsProps> = ({ history, onDelete, onClearAll, onRestore }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copySuccessId, setCopySuccessId] = useState<number | null>(null);
  const [lastDeletedItem, setLastDeletedItem] = useState<{ item: HistoryItem, timeoutId: number } | null>(null);

  const filteredHistory = useMemo(() => {
    if (!searchTerm) return history;
    const plainTextContent = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };
    return history.filter(item =>
      plainTextContent(item.content).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);
  
  const handleCopy = (item: HistoryItem) => {
    const plainTextContent = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };
    navigator.clipboard.writeText(plainTextContent(item.content));
    setCopySuccessId(item.id);
    setTimeout(() => setCopySuccessId(null), 2000);
  };

  const handleDelete = (id: number) => {
    if (lastDeletedItem) {
        clearTimeout(lastDeletedItem.timeoutId);
    }

    const itemToDelete = history.find(item => item.id === id);
    if (itemToDelete) {
        onDelete(id);
        const timeoutId = window.setTimeout(() => {
            setLastDeletedItem(null);
        }, 5000); // 5 seconds to undo
        setLastDeletedItem({ item: itemToDelete, timeoutId });
    }
  };

  const handleUndo = () => {
    if (lastDeletedItem) {
        clearTimeout(lastDeletedItem.timeoutId);
        onRestore(lastDeletedItem.item);
        setLastDeletedItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-wider">Generation History</h1>
        <p className="text-lg text-medium-text-light dark:text-medium-text tracking-wide mt-2">
          Your last 30 creations are saved locally in your browser.
        </p>
      </div>
      
      <Card title="Your Creations">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-medium-text"></i>
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-full py-2 pl-10 pr-4 focus:ring-brand-primary focus:border-brand-primary"
              aria-label="Search history"
            />
          </div>
          <div className="flex items-center gap-4">
             <span className="font-semibold text-medium-text">({history.length}/30)</span>
            <button
              onClick={() => {
                  if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
                      onClearAll();
                  }
              }}
              disabled={history.length === 0}
              className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-trash-alt"></i>
              Clear All
            </button>
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map(item => (
              <div key={item.id} className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg border border-light-border dark:border-dark-border">
                <div className="flex justify-between items-start mb-3">
                    <p className="text-xs text-medium-text-light dark:text-medium-text">
                        {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleCopy(item)} className="flex items-center gap-1 text-sm text-brand-primary hover:text-brand-secondary" aria-label={`Copy creation from ${new Date(item.createdAt).toLocaleString()}`}>
                             <i className="fas fa-copy"></i>
                            {copySuccessId === item.id ? 'Copied!' : 'Copy'}
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-medium-text-light dark:text-medium-text hover:text-red-400" aria-label={`Delete creation from ${new Date(item.createdAt).toLocaleString()}`}>
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none bg-light-card dark:bg-dark-card p-4 rounded-md max-h-48 overflow-y-auto" dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-medium-text">
             <i className="fas fa-history text-4xl mb-4"></i>
            <p className="font-semibold">{history.length === 0 ? "You haven't generated any content yet." : "No results match your search."}</p>
          </div>
        )}
      </Card>
      
      {lastDeletedItem && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white py-3 px-5 rounded-lg shadow-2xl flex items-center gap-4 animate-fade-in-up z-50">
            <span>Item deleted.</span>
            <button onClick={handleUndo} className="font-semibold text-brand-primary hover:text-brand-secondary">Undo</button>
        </div>
      )}
       <style>{`
        @keyframes fade-in-up {
            from { transform: translate(-50%, 20px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};
