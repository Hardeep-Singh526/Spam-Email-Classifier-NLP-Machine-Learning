import React from "react";
import { GeminiExplanationData } from "../types";
import { Sparkles, ShieldAlert, CheckCircle2, Zap, Brain, FileCheck, ArrowRight, Lightbulb } from "lucide-react";

interface GeminiExplanationProps {
  explanation: GeminiExplanationData | null;
  isLoading: boolean;
  onRetryGemini?: () => void;
}

export const GeminiExplanation: React.FC<GeminiExplanationProps> = ({
  explanation,
  isLoading,
  onRetryGemini,
}) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-200 dark:bg-indigo-800 animate-spin flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div>
            <div className="h-4 w-48 bg-indigo-200 dark:bg-indigo-800 rounded"></div>
            <div className="h-3 w-32 bg-indigo-100 dark:bg-indigo-900 rounded mt-1"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/80 bg-white dark:bg-slate-800/90 shadow-lg shadow-indigo-500/5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Gemini 3.6 AI Threat Explanation
              </h3>
              {explanation.source === "heuristic_fallback" && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  Heuristic Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Intelligent Scam Technique & Psychological Trigger Decomposition
            </p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400">Trust Score</span>
          <div className="flex items-center gap-1">
            <span
              className={`text-xl font-extrabold ${
                explanation.trustScore >= 70
                  ? "text-emerald-600 dark:text-emerald-400"
                  : explanation.trustScore >= 40
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {explanation.trustScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
        <p>{explanation.summary}</p>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scam Techniques */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Scam Techniques Identified</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {explanation.scamTechniques.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Psychological Triggers */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>Psychological Manipulation</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {explanation.psychologicalTriggers.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grammar & Phrasing Analysis */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          <FileCheck className="w-4 h-4 text-blue-500" />
          <span>Grammar & Synthetic Tone Evaluation</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {explanation.grammarAnalysis}
        </p>
      </div>

      {/* Actionable Safety Suggestions */}
      <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Actionable Security Recommendations</span>
        </div>
        <ul className="space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
          {explanation.actionableSuggestions.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="font-medium">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Educational Identification Tip */}
      <div className="p-4 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-900/60 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-cyan-900 dark:text-cyan-300">
            Pro Tip: How to Identify Similar Scams
          </h4>
          <p className="text-xs text-cyan-800 dark:text-cyan-200 mt-1 leading-relaxed">
            {explanation.howToIdentifySimilar}
          </p>
        </div>
      </div>
    </div>
  );
};
