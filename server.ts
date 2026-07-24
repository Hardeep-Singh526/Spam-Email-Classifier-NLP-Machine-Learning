import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;

// Lazy initialization for Gemini API client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return genAI;
}

// Spam Keywords and Weights dictionary (Simulating TF-IDF + Logistic Regression Weights)
const SPAM_TRIGGERS: Record<string, { weight: number; category: string }> = {
  urgent: { weight: 2.5, category: "Urgency Tactic" },
  immediately: { weight: 2.2, category: "Urgency Tactic" },
  "action required": { weight: 3.0, category: "Urgency Tactic" },
  suspended: { weight: 3.2, category: "Account Scare" },
  unauthorized: { weight: 2.8, category: "Account Scare" },
  verify: { weight: 2.1, category: "Credential Harvesting" },
  "confirm your account": { weight: 3.5, category: "Phishing Link" },
  winner: { weight: 3.8, category: "Financial Bait" },
  "congratulations!": { weight: 3.2, category: "Financial Bait" },
  claim: { weight: 2.4, category: "Financial Bait" },
  free: { weight: 1.8, category: "Promotional Spam" },
  bitcoin: { weight: 2.9, category: "Crypto Scam" },
  crypto: { weight: 2.5, category: "Crypto Scam" },
  investment: { weight: 2.0, category: "Financial Bait" },
  "wire transfer": { weight: 3.6, category: "CEO Fraud / BEC" },
  giftcard: { weight: 3.4, category: "Impersonation" },
  "gift card": { weight: 3.4, category: "Impersonation" },
  "click here": { weight: 2.6, category: "Phishing Link" },
  "login now": { weight: 3.1, category: "Credential Harvesting" },
  "update payment": { weight: 3.7, category: "Financial Scam" },
  refund: { weight: 2.3, category: "Financial Bait" },
  lottery: { weight: 4.0, category: "Financial Scam" },
  prize: { weight: 3.0, category: "Financial Bait" },
  inheritance: { weight: 4.2, category: "Advance Fee Scam" },
  million: { weight: 2.7, category: "Financial Scam" },
  password: { weight: 2.1, category: "Credential Harvesting" },
  security: { weight: 1.5, category: "Security Scare" },
  ssn: { weight: 3.9, category: "Identity Theft" },
  "social security": { weight: 4.0, category: "Identity Theft" },
  invoice: { weight: 1.8, category: "Financial / Invoice Scam" },
  overdue: { weight: 2.2, category: "Urgency Tactic" },
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
    });
  });

  // Machine Learning Classification API
  app.post("/api/classify", (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Email text is required." });
      }

      const lowerText = text.toLowerCase();
      let totalWeight = 0;
      const detectedKeywords: { word: string; weight: number; category: string }[] = [];

      // Check keyphrase matches
      for (const [trigger, data] of Object.entries(SPAM_TRIGGERS)) {
        if (lowerText.includes(trigger)) {
          totalWeight += data.weight;
          detectedKeywords.push({ word: trigger, weight: data.weight, category: data.category });
        }
      }

      // Check structural signals
      const hasUrl = /https?:\/\/|[a-z0-9]+\.[a-z]{2,3}/i.test(text);
      const isShortenedUrl = /bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd/i.test(text);
      const uppercaseRatio = (text.replace(/[^A-Z]/g, "").length) / (text.length || 1);
      const exclamationCount = (text.match(/!/g) || []).length;
      const dollarCount = (text.match(/\$/g) || []).length;

      if (hasUrl) totalWeight += 1.2;
      if (isShortenedUrl) totalWeight += 2.8;
      if (uppercaseRatio > 0.25) totalWeight += 2.0;
      if (exclamationCount > 2) totalWeight += 1.5;
      if (dollarCount > 2) totalWeight += 1.8;

      // Calculate score & confidence (logistic sigmoid approximation)
      const rawScore = 1 / (1 + Math.exp(-(totalWeight - 3.2)));
      const isSpam = rawScore >= 0.5;
      
      let riskLevel: "Low" | "Medium" | "High" | "Critical" = "Low";
      if (rawScore > 0.85) riskLevel = "Critical";
      else if (rawScore > 0.65) riskLevel = "High";
      else if (rawScore > 0.45) riskLevel = "Medium";

      const confidence = Math.min(99.9, Math.max(52.0, (Math.abs(rawScore - 0.5) * 2 * 45) + 54));

      res.json({
        isSpam,
        confidence: Number(confidence.toFixed(1)),
        spamScore: Number((rawScore * 100).toFixed(1)),
        riskLevel,
        detectedKeywords,
        features: {
          hasUrl,
          isShortenedUrl,
          uppercaseRatio: Number((uppercaseRatio * 100).toFixed(1)),
          exclamationCount,
          dollarCount,
          wordCount: text.trim().split(/\s+/).length,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to classify email." });
    }
  });

  // Gemini AI Explanation API
  app.post("/api/explain", async (req, res) => {
    try {
      const { emailText, mlResult } = req.body;
      if (!emailText) {
        return res.status(400).json({ error: "Email text is required for AI explanation." });
      }

      const aiClient = getGenAI();
      if (!aiClient) {
        // Fallback explanation if API key is not configured
        return res.json({
          source: "heuristic_fallback",
          summary: mlResult?.isSpam
            ? "This email exhibits multiple high-risk indicators typical of phishing and scam attempts, including urgent language and suspicious verification prompts."
            : "This email appears legitimate. It lacks common scam triggers, excessive urgency, or deceptive links.",
          suspiciousIndicators: mlResult?.detectedKeywords?.map((k: any) => `${k.word} (${k.category})`) || [
            "Check sender address domain",
            "Verify link destinations",
          ],
          scamTechniques: mlResult?.isSpam
            ? ["Artificial Urgency", "Credential Harvesting", "Brand Impersonation"]
            : ["None detected"],
          psychologicalTriggers: mlResult?.isSpam
            ? ["Fear of Account Suspension", "Fear of Financial Loss"]
            : ["Standard Informational Communication"],
          grammarAnalysis: "Sentence structure is moderate. Review original sender headers for verification.",
          trustScore: mlResult?.isSpam ? 18 : 92,
          actionableSuggestions: mlResult?.isSpam
            ? [
                "Do NOT click any embedded links or buttons.",
                "Do NOT reply with sensitive credentials or financial details.",
                "Verify by directly visiting the official organization website in a new browser tab.",
                "Report this email as Phishing to your IT security team.",
              ]
            : ["Safe to process, but always maintain standard cybersecurity awareness."],
          howToIdentifySimilar:
            "Watch out for mismatched domain names, high urgency, requests for immediate action, and generic greetings like 'Dear Customer'.",
        });
      }

      const prompt = `You are a World-Class Cybersecurity AI Expert and Machine Learning Threat Specialist.
Analyze the following email text and the Machine Learning prediction results. Provide a detailed, professional cybersecurity analysis.

Email Content:
"""
${emailText}
"""

Machine Learning Result:
- Is Spam: ${mlResult?.isSpam}
- Risk Level: ${mlResult?.riskLevel}
- Spam Score: ${mlResult?.spamScore}%
- Detected ML Triggers: ${JSON.stringify(mlResult?.detectedKeywords || [])}

Provide your response in JSON format matching this exact schema:
{
  "summary": "Concise summary of why this email was classified as spam or safe",
  "suspiciousIndicators": ["Array of specific suspicious phrases or patterns found in the text"],
  "scamTechniques": ["Array of specific techniques like Urgency, Spoofing, Credential Harvesting, Gift Card Scam"],
  "psychologicalTriggers": ["Array of psychological manipulation tactics like Fear, Scarcity, Authority, Greed"],
  "grammarAnalysis": "Assessment of the tone, grammar quality, awkward phrasing, or synthetic generated text markers",
  "trustScore": 15, // Number between 0 (complete scam) and 100 (100% legitimate trust)
  "actionableSuggestions": ["Array of 3-4 clear step-by-step security actions for the recipient"],
  "howToIdentifySimilar": "A 2-sentence practical guide on how a user can spot similar scams in the future"
}`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              suspiciousIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
              scamTechniques: { type: Type.ARRAY, items: { type: Type.STRING } },
              psychologicalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
              grammarAnalysis: { type: Type.STRING },
              trustScore: { type: Type.NUMBER },
              actionableSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              howToIdentifySimilar: { type: Type.STRING },
            },
            required: [
              "summary",
              "suspiciousIndicators",
              "scamTechniques",
              "psychologicalTriggers",
              "grammarAnalysis",
              "trustScore",
              "actionableSuggestions",
              "howToIdentifySimilar",
            ],
          },
        },
      });

      let parsed = {};
      try {
        parsed = JSON.parse(response.text || "{}");
      } catch (pErr) {
        parsed = {
          summary: response.text || "Analysis completed.",
          suspiciousIndicators: [],
          scamTechniques: [],
          psychologicalTriggers: [],
          grammarAnalysis: "Standard text syntax.",
          trustScore: mlResult?.isSpam ? 20 : 90,
          actionableSuggestions: ["Verify sender credentials directly."],
          howToIdentifySimilar: "Check sender email headers carefully.",
        };
      }

      res.json({ source: "gemini", ...parsed });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({
        error: "Failed to generate Gemini explanation.",
        details: err.message,
      });
    }
  });

  // Vite Dev Server or Production Static Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
