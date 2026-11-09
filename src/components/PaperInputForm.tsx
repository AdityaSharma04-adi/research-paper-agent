import React, { useState } from 'react';
import { SAMPLE_PAPERS, SamplePaper } from '../utils/paperAnalysis';
import { Sparkles, ArrowRight, Clipboard, Trash2, FileText, CheckCircle2 } from 'lucide-react';

interface PaperInputFormProps {
  title: string;
  setTitle: (val: string) => void;
  text: string;
  setText: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onSelectSample: (paper: SamplePaper) => void;
  selectedSampleId: string | null;
}

export const PaperInputForm: React.FC<PaperInputFormProps> = ({
  title,
  setTitle,
  text,
  setText,
  onSubmit,
  isLoading,
  onSelectSample,
  selectedSampleId
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(clipText);
      }
    } catch (e) {
      // In case clipboard permissions are restricted
      console.warn('Clipboard read failed:', e);
    }
  };

  const handleClear = () => {
    setTitle('');
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (text.trim().length > 0 && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <section id="input-console" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Preloaded Sample Selector Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Preloaded Sample Papers (One-Click Test)
          </label>
          <span className="text-xs text-slate-400">
            Select a benchmark paper or paste your own below
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {SAMPLE_PAPERS.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 text-slate-900'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-semibold truncate text-indigo-700">
                    {sample.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {sample.year}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-900 line-clamp-1">
                  {sample.title}
                </span>
                <span className="text-[11px] text-slate-500 truncate mt-0.5">
                  {sample.authors}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim().length > 0 && !isLoading) {
            onSubmit();
          }
        }}
        className="space-y-4"
      >
        {/* Paper Title Input */}
        <div>
          <label
            htmlFor="paper-title"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Paper Title <span className="text-slate-400 font-normal">(Optional but recommended)</span>
          </label>
          <input
            id="paper-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Attention Is All You Need / Fast and Flexible Deep Neural Networks..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Paper Abstract / Text Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="paper-text"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Paper Abstract or Excerpt <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-indigo-600 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3 h-3" />
                <span>Paste</span>
              </button>
              {text.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-rose-600 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
                  title="Clear inputs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="paper-text"
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste the research paper title, abstract, methodology section, or benchmark results here..."
              className="w-full px-3.5 py-3 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y leading-relaxed"
              required
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                <strong className="font-mono tabular-nums">{wordCount}</strong> words
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="font-mono tabular-nums">{charCount}</strong> characters
              </span>
            </div>
            <span className="hidden sm:inline text-slate-400">
              Tip: Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded">Enter</kbd> to analyze
            </span>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Strict 5-step Chain-of-Thought decomposition: Problem, Architecture, Results, Limitations, Takeaways</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || text.trim().length === 0}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 ${
              isLoading || text.trim().length === 0
                ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing Step-by-Step...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Paper (Chain-of-Thought)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
