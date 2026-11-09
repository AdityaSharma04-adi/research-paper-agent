import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface ReasoningProgressProps {
  isLoading: boolean;
  activeFilterStep?: number | null;
  onFilterStep?: (stepNumber: number | null) => void;
}

const STEPS = [
  { num: 1, title: 'Core Problem', desc: 'Identify central problem and literature gap' },
  { num: 2, title: 'Architecture & Methodology', desc: 'Summarize proposed model and experimental design' },
  { num: 3, title: 'Key Results & Metrics', desc: 'Extract quantitative benchmarks and performance outcomes' },
  { num: 4, title: 'Critical Limitations', desc: 'Highlight stated assumptions, trade-offs, and failure points' },
  { num: 5, title: 'Practical Takeaways', desc: 'Synthesize 2–3 actionable engineering insights' },
];

export const ReasoningProgress: React.FC<ReasoningProgressProps> = ({
  isLoading,
  activeFilterStep = null,
  onFilterStep
}) => {
  const [simulatedStep, setSimulatedStep] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      setSimulatedStep(1);
      return;
    }
    const interval = setInterval(() => {
      setSimulatedStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 1400);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div id="reasoning-flow" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Chain-of-Thought Reasoning Pipeline</span>
            {isLoading && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing Step {simulatedStep} of 5
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict sequential analysis deconstructing the paper into 5 empirical dimensions
          </p>
        </div>

        {onFilterStep && !isLoading && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter view:</span>
            <button
              type="button"
              onClick={() => onFilterStep(null)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                activeFilterStep === null
                  ? 'bg-slate-900 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Steps
            </button>
          </div>
        )}
      </div>

      {/* Progress steps row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {STEPS.map((step) => {
          const isDone = !isLoading || simulatedStep > step.num;
          const isCurrent = isLoading && simulatedStep === step.num;
          const isSelected = activeFilterStep === step.num;

          return (
            <button
              key={step.num}
              type="button"
              disabled={isLoading}
              onClick={() => onFilterStep && onFilterStep(isSelected ? null : step.num)}
              className={`relative flex flex-col p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                  : isCurrent
                  ? 'border-indigo-400 bg-indigo-50/40'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-semibold text-slate-500">
                  Step 0{step.num}
                </span>
                {isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                ) : isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>
              <span className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                {step.title}
              </span>
              <span className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                {step.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
