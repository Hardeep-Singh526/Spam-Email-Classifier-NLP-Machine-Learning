import React from "react";
import { HistoryRecord } from "../types";
import { History, ShieldAlert, ShieldCheck, Trash2, ArrowUpRight, Clock } from "lucide-react";

interface PredictionHistoryProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
  onSelectRecord: (record: HistoryRecord) => void;
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({
  history,
  onClearHistory,
  onSelectRecord,
}) => {
  if (history.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <History className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
          No Scan History Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Emails analyzed on the Classifier tab will be logged here with prediction scores, risk levels, and Gemini AI explanations.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/80">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Scan History Log ({history.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any entry to inspect its detailed threat analysis
          </p>
        </div>

        <button
          onClick={onClearHistory}
          className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectRecord(item)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.result.isSpam
                    ? "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400"
                    : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {item.result.isSpam ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      item.result.isSpam
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                    }`}
                  >
                    {item.result.isSpam ? "Spam / Phishing" : "Legitimate"}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                    {item.subject}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-mono">
                  "{item.snippet}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {item.result.confidence}% Conf.
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  {item.timestamp}
                </span>
              </div>

              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
