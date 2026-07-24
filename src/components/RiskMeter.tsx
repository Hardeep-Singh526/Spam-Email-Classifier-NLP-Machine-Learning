import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, AlertOctagon } from "lucide-react";

interface RiskMeterProps {
  score: number; // 0 to 100
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  confidence: number; // e.g. 98.4
  isSpam: boolean;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  riskLevel,
  confidence,
  isSpam,
}) => {
  const getRiskColor = () => {
    switch (riskLevel) {
      case "Critical":
        return {
          bg: "bg-rose-500",
          text: "text-rose-600 dark:text-rose-400",
          border: "border-rose-200 dark:border-rose-900/60",
          pillBg: "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300",
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
        };
      case "High":
        return {
          bg: "bg-amber-500",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-900/60",
          pillBg: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300",
          icon: <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
        };
      case "Medium":
        return {
          bg: "bg-yellow-500",
          text: "text-yellow-600 dark:text-yellow-400",
          border: "border-yellow-200 dark:border-yellow-900/60",
          pillBg: "bg-yellow-100 dark:bg-yellow-950/80 text-yellow-700 dark:text-yellow-300",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
        };
      case "Low":
      default:
        return {
          bg: "bg-emerald-500",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-900/60",
          pillBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
        };
    }
  };

  const style = getRiskColor();

  return (
    <div className={`p-5 rounded-2xl border ${style.border} bg-white dark:bg-slate-800/90 shadow-sm transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {style.icon}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Risk Assessment
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-base font-bold ${style.text}`}>
                {riskLevel} Threat Risk
              </span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${style.pillBg}`}>
                {isSpam ? "SPAM / PHISHING" : "SAFE / LEGITIMATE"}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Confidence</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {confidence}%
          </p>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>0% Safe</span>
          <span>Spam Score: {score}%</span>
          <span>100% Critical</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden p-0.5 relative">
          <div
            className={`h-full rounded-full ${style.bg} transition-all duration-700 ease-out`}
            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
