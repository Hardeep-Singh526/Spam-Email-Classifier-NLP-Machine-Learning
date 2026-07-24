export interface DetectedKeyword {
  word: string;
  weight: number;
  category: string;
}

export interface EmailFeatures {
  hasUrl: boolean;
  isShortenedUrl: boolean;
  uppercaseRatio: number;
  exclamationCount: number;
  dollarCount: number;
  wordCount: number;
}

export interface ClassificationResult {
  isSpam: boolean;
  confidence: number;
  spamScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  detectedKeywords: DetectedKeyword[];
  features: EmailFeatures;
}

export interface GeminiExplanationData {
  source: "gemini" | "heuristic_fallback";
  summary: string;
  suspiciousIndicators: string[];
  scamTechniques: string[];
  psychologicalTriggers: string[];
  grammarAnalysis: string;
  trustScore: number;
  actionableSuggestions: string[];
  howToIdentifySimilar: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  subject: string;
  snippet: string;
  fullText: string;
  result: ClassificationResult;
  explanation?: GeminiExplanationData;
}

export interface SampleEmail {
  id: string;
  title: string;
  category: "phishing" | "scam" | "ceo_fraud" | "legitimate" | "newsletter";
  subject: string;
  body: string;
  expectedSpam: boolean;
}

export interface PipelinePhase {
  phaseNumber: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "planned";
  keyOutputs: string[];
  pythonCode: string;
}
