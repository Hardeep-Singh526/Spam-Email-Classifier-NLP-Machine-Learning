import React from "react";
import { PIPELINE_PHASES } from "../data/mlPipelineData";
import { X, CheckCircle2, BookOpen, Layers, Sparkles, Code } from "lucide-react";

interface PhaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePhase: (phaseNum: number) => void;
}

export const PhaseGuideModal: React.FC<PhaseGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigatePhase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                8-Phase Production Implementation Roadmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step-by-step engineering roadmap for AI Developer & ML Engineer portfolio presentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase Timeline Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {PIPELINE_PHASES.map((phase) => (
            <div
              key={phase.phaseNumber}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  P{phase.phaseNumber}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {phase.title}
                    </h4>
                    <span className="px-2 py-0.2 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Completed & Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {phase.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigatePhase(phase.phaseNumber);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
                <span>View Code & Artifacts</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
