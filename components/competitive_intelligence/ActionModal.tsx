import React, { useState } from 'react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading: boolean;
  content: string | null;
}

export const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, title, isLoading, content }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  
  if (!isOpen) return null;

  const handleCopy = () => {
    if (content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const textToCopy = tempDiv.textContent || tempDiv.innerText || '';
        navigator.clipboard.writeText(textToCopy.trim());
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border flex-shrink-0">
          <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-medium-text hover:text-light-text transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-medium-text">AI is generating a response... please wait.</p>
            </div>
          ) : (
            content && <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </main>
        
        <footer className="p-4 border-t border-light-border dark:border-dark-border flex-shrink-0 flex justify-end items-center gap-3">
           <button
             onClick={handleCopy}
             disabled={!content || isLoading}
             className="px-4 py-2 text-sm font-semibold rounded-md bg-slate-200 dark:bg-dark-border text-dark-text dark:text-light-text hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
           >
             {copySuccess ? 'Copied!' : 'Copy Text'}
           </button>
           <button
             onClick={onClose}
             className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
           >
             Close
           </button>
        </footer>
      </div>
    </div>
  );
};