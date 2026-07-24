import React, { useState } from "react";
import { PIPELINE_PHASES, ML_PERFORMANCE_METRICS } from "../data/mlPipelineData";
import { Layers, Code2, CheckCircle2, BarChart2, Cpu, Database, Award, Copy, Check } from "lucide-react";

export const MLPipelineInspector: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const phaseData = PIPELINE_PHASES.find((p) => p.phaseNumber === selectedPhase) || PIPELINE_PHASES[0];

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Model Benchmark Summary Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Logistic Regression + TF-IDF Vectorizer
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                UCI SMS Dataset (5,572 samples)
              </span>
            </div>
            <h2 className="text-xl font-bold mt-2">
              Machine Learning Pipeline Performance Architecture
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Cross-validated model benchmarks evaluated on a stratified test split (20% holdout).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80">
            <Award className="w-5 h-5 text-amber-400 ml-2" />
            <span className="text-xs font-bold text-amber-300 pr-3">
              F1-Score: {ML_PERFORMANCE_METRICS.f1Score}%
            </span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              Accuracy
            </span>
            <span className="text-xl font-extrabold text-emerald-400">
              {ML_PERFORMANCE_METRICS.accuracy}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              Precision
            </span>
            <span className="text-xl font-extrabold text-blue-400">
              {ML_PERFORMANCE_METRICS.precision}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              Recall
            </span>
            <span className="text-xl font-extrabold text-cyan-400">
              {ML_PERFORMANCE_METRICS.recall}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              F1-Score
            </span>
            <span className="text-xl font-extrabold text-amber-400">
              {ML_PERFORMANCE_METRICS.f1Score}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              ROC-AUC
            </span>
            <span className="text-xl font-extrabold text-purple-400">
              {ML_PERFORMANCE_METRICS.rocAuc}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Phase Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PIPELINE_PHASES.map((phase) => {
          const isActive = selectedPhase === phase.phaseNumber;
          return (
            <button
              key={phase.phaseNumber}
              onClick={() => setSelectedPhase(phase.phaseNumber)}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                P{phase.phaseNumber}
              </span>
              <div className="overflow-hidden">
                <span className="text-xs font-bold block truncate">{phase.title}</span>
                <span
                  className={`text-[10px] block truncate ${
                    isActive ? "text-indigo-100" : "text-slate-400"
                  }`}
                >
                  Phase {phase.phaseNumber} Code & Outputs
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Phase Documentation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-extrabold rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Phase {phaseData.phaseNumber}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {phaseData.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {phaseData.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/80">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Key Engineering Artifacts
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {phaseData.keyOutputs.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confusion Matrix Visualizer */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              Confusion Matrix Evaluation
            </h4>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-normal">
                  True Negative (Ham)
                </span>
                <span className="text-lg font-bold">957</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
                <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-normal">
                  False Positive (Alarm)
                </span>
                <span className="text-lg font-bold">3</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-normal">
                  False Negative (Missed)
                </span>
                <span className="text-lg font-bold">9</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-normal">
                  True Positive (Spam)
                </span>
                <span className="text-lg font-bold">146</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">
                  Python 3.11 Execution Code — Phase {phaseData.phaseNumber}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(phaseData.pythonCode, phaseData.phaseNumber)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                {copiedIndex === phaseData.phaseNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-xs text-emerald-400 font-mono overflow-x-auto leading-relaxed max-h-96">
              {phaseData.pythonCode}
            </pre>
          </div>

          {/* Top TF-IDF Feature Weights List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Top TF-IDF Learned Feature Weights (Logistic Regression Coefficients)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ML_PERFORMANCE_METRICS.topSpamFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-center"
                >
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block font-mono">
                    "{feat.word}"
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                    +{feat.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
