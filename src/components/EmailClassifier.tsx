import React, { useState } from "react";
import { SAMPLE_EMAILS } from "../data/sampleEmails";
import { ClassificationResult, GeminiExplanationData, HistoryRecord, SampleEmail } from "../types";
import { RiskMeter } from "./RiskMeter";
import { HighlightedEmail } from "./HighlightedEmail";
import { GeminiExplanation } from "./GeminiExplanation";
import {
  Send,
  RotateCcw,
  Download,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface EmailClassifierProps {
  onAddHistory: (record: HistoryRecord) => void;
}

export const EmailClassifier: React.FC<EmailClassifierProps> = ({ onAddHistory }) => {
  const [emailText, setEmailText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);
  const [mlResult, setMlResult] = useState<ClassificationResult | null>(null);
  const [geminiData, setGeminiData] = useState<GeminiExplanationData | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle sample selection
  const handleSelectSample = (sample: SampleEmail) => {
    setActiveSampleId(sample.id);
    setEmailText(sample.body);
    setMlResult(null);
    setGeminiData(null);
    setErrorMsg(null);
  };

  // Reset form
  const handleReset = () => {
    setEmailText("");
    setActiveSampleId("");
    setMlResult(null);
    setGeminiData(null);
    setErrorMsg(null);
  };

  // Run Classification and Gemini Explanation
  const handleClassify = async () => {
    if (!emailText.trim()) {
      setErrorMsg("Please paste or enter an email text before running classification.");
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    setIsGeminiLoading(true);

    try {
      // Step 1: Call ML Classification API
      const classifyRes = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: emailText }),
      });

      if (!classifyRes.ok) {
        throw new Error("Failed to classify email. Server returned error.");
      }

      const mlData: ClassificationResult = await classifyRes.json();
      setMlResult(mlData);
      setIsAnalyzing(false);

      // Step 2: Call Gemini Explanation API
      try {
        const explainRes = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailText, mlResult: mlData }),
        });

        if (explainRes.ok) {
          const gData: GeminiExplanationData = await explainRes.json();
          setGeminiData(gData);

          // Save to Scan History
          onAddHistory({
            id: `scan-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            subject: emailText.slice(0, 45) + "...",
            snippet: emailText.slice(0, 90) + "...",
            fullText: emailText,
            result: mlData,
            explanation: gData,
          });
        }
      } catch (gErr) {
        console.warn("Gemini explanation error:", gErr);
      } finally {
        setIsGeminiLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during prediction.");
      setIsAnalyzing(false);
      setIsGeminiLoading(false);
    }
  };

  // Download Prediction Report
  const handleDownloadReport = () => {
    if (!mlResult) return;

    const reportContent = `====================================================
SENTINEL AI SPAM EMAIL THREAT ANALYSIS REPORT
====================================================
Timestamp: ${new Date().toLocaleString()}
Prediction: ${mlResult.isSpam ? "SPAM / PHISHING THREAT" : "SAFE / LEGITIMATE EMAIL"}
Confidence Score: ${mlResult.confidence}%
Spam Risk Level: ${mlResult.riskLevel} (${mlResult.spamScore}%)

----------------------------------------------------
DETECTED ML FEATURE TRIGGERS
----------------------------------------------------
${
  mlResult.detectedKeywords.length > 0
    ? mlResult.detectedKeywords.map((k) => `- "${k.word}" (Weight: ${k.weight}, Category: ${k.category})`).join("\n")
    : "No high-risk keywords detected."
}

----------------------------------------------------
STRUCTURAL METRICS
----------------------------------------------------
- Word Count: ${mlResult.features.wordCount}
- Has URL: ${mlResult.features.hasUrl}
- Is Shortened URL: ${mlResult.features.isShortenedUrl}
- Uppercase Character Ratio: ${mlResult.features.uppercaseRatio}%
- Exclamation Mark Count: ${mlResult.features.exclamationCount}

----------------------------------------------------
GEMINI 3.6 AI EXPLANATION
----------------------------------------------------
Summary:
${geminiData?.summary || "N/A"}

Scam Techniques Identified:
${geminiData?.scamTechniques.map((t) => `- ${t}`).join("\n") || "N/A"}

Psychological Manipulation Tactics:
${geminiData?.psychologicalTriggers.map((p) => `- ${p}`).join("\n") || "N/A"}

Actionable Security Advice:
${geminiData?.actionableSuggestions.map((s) => `- ${s}`).join("\n") || "N/A"}

----------------------------------------------------
ORIGINAL EMAIL CONTENT
----------------------------------------------------
${emailText}
`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Spam-Report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Quick Load Test Email Samples Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Load Sample Emails for Instant Testing</span>
          </div>
          <span className="text-[11px] text-slate-400">Click to auto-fill</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_EMAILS.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                id={`sample-${sample.id}-btn`}
                onClick={() => handleSelectSample(sample)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : sample.expectedSpam
                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
                }`}
              >
                <span>{sample.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    sample.expectedSpam
                      ? "bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100"
                      : "bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100"
                  }`}
                >
                  {sample.expectedSpam ? "Spam" : "Safe"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Email Input Box & Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="email-textarea"
            className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Email Content Input
          </label>
          <span className="text-xs text-slate-400">
            {emailText.length} characters | {emailText.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <textarea
          id="email-textarea"
          value={emailText}
          onChange={(e) => {
            setEmailText(e.target.value);
            setActiveSampleId("");
            setErrorMsg(null);
          }}
          placeholder="Paste full email subject and body text here (e.g. 'URGENT: Your account access has been suspended...')"
          rows={7}
          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans transition-all leading-relaxed"
        />

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              id="predict-btn"
              onClick={handleClassify}
              disabled={isAnalyzing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Threat Vector...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Predict & Explain Threat</span>
                </>
              )}
            </button>

            <button
              id="reset-btn"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-sm transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {mlResult && (
            <button
              id="download-report-btn"
              onClick={handleDownloadReport}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Threat Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Dashboard Grid */}
      {mlResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          {/* Top Gauge & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <RiskMeter
                score={mlResult.spamScore}
                riskLevel={mlResult.riskLevel}
                confidence={mlResult.confidence}
                isSpam={mlResult.isSpam}
              />
            </div>

            {/* Feature Statistics */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Structural Feature Vector
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Embedded Link:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {mlResult.features.hasUrl ? "Yes (URL Detected)" : "No URLs"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Shortened Domain:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {mlResult.features.isShortenedUrl ? "Yes (High Risk)" : "Standard Domain"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400">Uppercase Ratio:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {mlResult.features.uppercaseRatio}%
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400">Trigger Keywords:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {mlResult.detectedKeywords.length} Detected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Highlighting Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <HighlightedEmail
              emailText={emailText}
              detectedKeywords={mlResult.detectedKeywords}
            />
          </div>

          {/* Gemini AI Detailed Threat Explanation Panel */}
          <GeminiExplanation
            explanation={geminiData}
            isLoading={isGeminiLoading}
          />
        </div>
      )}
    </div>
  );
};
