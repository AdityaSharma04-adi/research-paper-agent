import React, { useState } from 'react';
import {
  PaperAnalysisResult,
  exportAnalysisToMarkdown
} from '../utils/paperAnalysis';
import {
  Target,
  Layers,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  Brain,
  MessageSquare,
  HelpCircle,
  Share2
} from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: PaperAnalysisResult;
  activeFilterStep?: number | null;
  onOpenQA: () => void;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  analysis,
  activeFilterStep = null,
  onOpenQA
}) => {
  const [copied, setCopied] = useState(false);
  const [showCoT, setShowCoT] = useState(false);

  const handleCopyMarkdown = async () => {
    const md = exportAnalysisToMarkdown(analysis);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = exportAnalysisToMarkdown(analysis);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanTitle = analysis.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    a.download = `${cleanTitle}_analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shouldShow = (stepNum: number) => {
    return activeFilterStep === null || activeFilterStep === stepNum;
  };

  const formattedDate = new Date(analysis.analyzedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <section id="results" className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
              <span>Scientific Paper Analysis</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{formattedDate}</span>
              {analysis.authorsOrField && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{analysis.authorsOrField}</span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
              {analysis.title}
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenQA}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Paper Agent</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied MD' : 'Copy MD'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Collapsible Chain-of-Thought Internal Reasoning disclosure */}
        {analysis.chainOfThoughtReasoning && (
          <div className="mt-4 pt-2">
            <button
              type="button"
              onClick={() => setShowCoT(!showCoT)}
              className="flex items-center justify-between w-full py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Inspect Agent Chain-of-Thought Reasoning Trail</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span>{showCoT ? 'Hide trail' : 'View trail'}</span>
                {showCoT ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {showCoT && (
              <div className="mt-3 p-4 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
                {analysis.chainOfThoughtReasoning}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step Breakdown Cards (1 through 5) */}
      <div className="space-y-6">
        {/* STEP 1: CORE PROBLEM */}
        {shouldShow(1) && (
          <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
            <header className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    01. Core Problem
                  </h3>
                  <p className="text-xs text-slate-500">
                    Central problem and literature gap tackled by the authors
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Step 1 of 5</span>
            </header>

            <div className="p-6 space-y-5 text-sm text-slate-700">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Central Research Problem
                </h4>
                <p className="text-slate-900 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                  {analysis.step1CoreProblem.problemStatement}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Existing Gap in Literature
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.step1CoreProblem.existingGap}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Scientific Significance
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.step1CoreProblem.significance}
                  </p>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* STEP 2: ARCHITECTURE & METHODOLOGY */}
        {shouldShow(2) && (
          <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
            <header className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    02. Architecture & Methodology
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proposed model, technique, and experimental framework
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Step 2 of 5</span>
            </header>

            <div className="p-6 space-y-5 text-sm text-slate-700">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Proposed Approach Summary
                </h4>
                <p className="text-slate-800 leading-relaxed">
                  {analysis.step2Architecture.approachSummary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Key Architectural & Experimental Components
                </h4>
                <ul className="space-y-2">
                  {analysis.step2Architecture.keyComponents.map((comp, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    >
                      <span className="w-5 h-5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-mono font-semibold shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-indigo-50/50 border border-indigo-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-900 mb-1">
                  Primary Architectural Novelty
                </h4>
                <p className="text-xs text-indigo-950 leading-relaxed">
                  {analysis.step2Architecture.novelty}
                </p>
              </div>
            </div>
          </article>
        )}

        {/* STEP 3: KEY RESULTS & METRICS */}
        {shouldShow(3) && (
          <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
            <header className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    03. Key Results & Metrics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Quantitative benchmarks and empirical performance outcomes
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Step 3 of 5</span>
            </header>

            <div className="p-6 space-y-5 text-sm text-slate-700">
              <p className="text-slate-800 leading-relaxed">
                {analysis.step3Results.summary}
              </p>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Quantitative Benchmarks & Outcomes
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th scope="col" className="px-4 py-3">Task / Metric Name</th>
                        <th scope="col" className="px-4 py-3">Achieved Outcome</th>
                        <th scope="col" className="px-4 py-3">Baseline Comparison</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {analysis.step3Results.benchmarks.map((benchmark, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {benchmark.metricName}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-900 tabular-nums">
                            {benchmark.resultValue}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {benchmark.baselineComparison || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* STEP 4: CRITICAL LIMITATIONS */}
        {shouldShow(4) && (
          <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
            <header className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    04. Critical Limitations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Stated assumptions, engineering trade-offs, and failure points
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Step 4 of 5</span>
            </header>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-700">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                <h4 className="font-semibold uppercase tracking-wider text-slate-800 mb-2">
                  Stated Assumptions
                </h4>
                <ul className="space-y-2 text-slate-600 flex-1">
                  {analysis.step4Limitations.assumptions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-slate-400">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                <h4 className="font-semibold uppercase tracking-wider text-slate-800 mb-2">
                  Design Trade-offs
                </h4>
                <ul className="space-y-2 text-slate-600 flex-1">
                  {analysis.step4Limitations.tradeOffs.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-slate-400">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                <h4 className="font-semibold uppercase tracking-wider text-slate-800 mb-2">
                  Failure Points & Edge Cases
                </h4>
                <ul className="space-y-2 text-slate-600 flex-1">
                  {analysis.step4Limitations.failureModes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-slate-400">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        )}

        {/* STEP 5: PRACTICAL TAKEAWAYS */}
        {shouldShow(5) && (
          <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
            <header className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    05. Practical Takeaways
                  </h3>
                  <p className="text-xs text-slate-500">
                    2–3 actionable bullet points for practitioners and researchers
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Step 5 of 5</span>
            </header>

            <div className="p-6 space-y-5 text-sm text-slate-700">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Actionable Implementation Points
                </h4>
                <div className="space-y-3">
                  {analysis.step5Takeaways.actionablePoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-violet-600 text-white font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                        {point}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.step5Takeaways.implementationAdvice && (
                <div className="p-4 rounded-lg bg-violet-50/60 border border-violet-100 text-xs">
                  <span className="font-semibold text-violet-900 block mb-1 uppercase tracking-wider">
                    Practitioner Tip / Implementation Advice:
                  </span>
                  <p className="text-violet-950 leading-relaxed">
                    {analysis.step5Takeaways.implementationAdvice}
                  </p>
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
};
