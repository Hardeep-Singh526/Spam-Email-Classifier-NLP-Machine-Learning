/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { EmailClassifier } from "./components/EmailClassifier";
import { MLPipelineInspector } from "./components/MLPipelineInspector";
import { PredictionHistory } from "./components/PredictionHistory";
import { PhaseGuideModal } from "./components/PhaseGuideModal";
import { HistoryRecord } from "./types";
import { ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"classifier" | "pipeline" | "history">("classifier");
  const [isPhaseGuideOpen, setIsPhaseGuideOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Apply Dark Mode HTML Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAddHistory = (record: HistoryRecord) => {
    setHistory((prev) => [record, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelectRecordFromHistory = (record: HistoryRecord) => {
    setActiveTab("classifier");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPhaseGuide={() => setIsPhaseGuideOpen(true)}
        historyCount={history.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Dual-Engine Threat Intelligence
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Production Ready
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Spam Email Classifier & Scam Intelligence Engine
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Combines high-speed Machine Learning classification (TF-IDF + Logistic Regression) with deep generative explanations powered by Google Gemini 3.6 Flash for phishing, social engineering, and scam vector identification.
            </p>
          </div>

          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Tab View Routing */}
        {activeTab === "classifier" && (
          <EmailClassifier onAddHistory={handleAddHistory} />
        )}

        {activeTab === "pipeline" && <MLPipelineInspector />}

        {activeTab === "history" && (
          <PredictionHistory
            history={history}
            onClearHistory={handleClearHistory}
            onSelectRecord={handleSelectRecordFromHistory}
          />
        )}
      </main>

      {/* 8-Phase Roadmap Modal */}
      <PhaseGuideModal
        isOpen={isPhaseGuideOpen}
        onClose={() => setIsPhaseGuideOpen(false)}
        onNavigatePhase={(phaseNum) => {
          setActiveTab("pipeline");
        }}
      />
    </div>
  );
}
