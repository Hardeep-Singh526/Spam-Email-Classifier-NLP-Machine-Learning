import React from "react";
import { DetectedKeyword } from "../types";
import { AlertCircle } from "lucide-react";

interface HighlightedEmailProps {
  emailText: string;
  detectedKeywords: DetectedKeyword[];
}

export const HighlightedEmail: React.FC<HighlightedEmailProps> = ({
  emailText,
  detectedKeywords,
}) => {
  if (!emailText) return null;

  if (!detectedKeywords || detectedKeywords.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
        {emailText}
      </div>
    );
  }

  // Create a regex to match detected words/phrases case-insensitively
  const phrases = detectedKeywords.map((k) => k.word.toLowerCase());
  // Sort by length descending so longer phrases match first
  phrases.sort((a, b) => b.length - a.length);

  const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");

  const parts = emailText.split(pattern);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Suspicious Keyword & Trigger Words Highlighted</span>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
        {parts.map((part, index) => {
          const match = detectedKeywords.find(
            (k) => k.word.toLowerCase() === part.toLowerCase()
          );

          if (match) {
            return (
              <mark
                key={index}
                className="bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 font-bold px-1 rounded border border-amber-300 dark:border-amber-700/80 inline-block my-0.5 cursor-help"
                title={`Spam Trigger: "${match.word}" (${match.category})`}
              >
                {part}
              </mark>
            );
          }

          return <span key={index}>{part}</span>;
        })}
      </div>
    </div>
  );
};
