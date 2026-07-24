import React from "react";
import { ShieldCheck, ShieldAlert, BookOpen, Layers, History, Sparkles, Moon, Sun } from "lucide-react";

interface NavbarProps {
  activeTab: "classifier" | "pipeline" | "history";
  setActiveTab: (tab: "classifier" | "pipeline" | "history") => void;
  onOpenPhaseGuide: () => void;
  historyCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPhaseGuide,
  historyCount,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                SentinelAI
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                v2.5 ML + Gemini
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Production Spam & Phishing Classifier
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <button
            id="tab-classifier-btn"
            onClick={() => setActiveTab("classifier")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "classifier"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Classifier Dashboard
          </button>

          <button
            id="tab-pipeline-btn"
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "pipeline"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            ML Pipeline Inspector
          </button>

          <button
            id="tab-history-btn"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all relative ${
              activeTab === "history"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            Scan History
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Phase Roadmap Guide Button */}
          <button
            id="open-phase-guide-btn"
            onClick={onOpenPhaseGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>8-Phase Roadmap</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Tab bar */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 gap-2 bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => setActiveTab("classifier")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center ${
            activeTab === "classifier"
              ? "bg-indigo-600 text-white"
              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          Classifier
        </button>
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center ${
            activeTab === "pipeline"
              ? "bg-indigo-600 text-white"
              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          ML Pipeline
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center ${
            activeTab === "history"
              ? "bg-indigo-600 text-white"
              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          History ({historyCount})
        </button>
      </div>
    </header>
  );
};
