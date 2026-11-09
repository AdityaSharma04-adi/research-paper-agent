import React from 'react';
import { BookOpen, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onSelectSample: () => void;
  onReset: () => void;
  hasAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSelectSample, onReset, hasAnalysis }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (1 line, single element) */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
          aria-label="PaperAgent Home"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
              PaperAgent
            </span>
            <span className="hidden sm:inline text-xs text-slate-500 ml-2">
              Chain-of-Thought Academic Analysis
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Main Navigation">
          <a
            href="#input-console"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Input Console
          </a>
          <a
            href="#reasoning-flow"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            5-Step Flow
          </a>
          <a
            href="#results"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Analysis Cards
          </a>
          <a
            href="#export"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Documentation
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSelectSample}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Paper</span>
          </button>
        </div>
      </div>
    </header>
  );
};
