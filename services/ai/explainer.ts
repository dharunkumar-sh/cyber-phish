// =============================================================================
// CyberPhish Guardian — AI Explanation Service (OpenRouter)
// =============================================================================

import OpenAI from "openai";
import type { AIExplanation, RiskResult, ThreatIntelligence, ThreatLevel } from "@/lib/types";
import { config } from "@/lib/config/env";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("AIExplainer");

// ---------------------------------------------------------------------------
// OpenRouter client (OpenAI-compatible API)
// ---------------------------------------------------------------------------

const openrouter = config.ai.hasKey
  ? new OpenAI({
      apiKey: config.ai.openRouterApiKey,
      baseURL: config.ai.baseURL,
      defaultHeaders: {
        "HTTP-Referer": config.app.url,
        "X-Title": "CyberPhish Guardian",
      },
    })
  : null;

// ---------------------------------------------------------------------------
// Threat level labels
// ---------------------------------------------------------------------------

const LEVEL_LABELS: Record<ThreatLevel, string> = {
  safe: "SAFE",
  suspicious: "SUSPICIOUS",
  high_risk: "HIGH RISK",
  dangerous: "DANGEROUS",
};

// ---------------------------------------------------------------------------
// Fallback template (used when AI is not available)
// ---------------------------------------------------------------------------

function generateFallback(
  url: string,
  riskResult: RiskResult,
  intel: ThreatIntelligence
): string {
  const level = LEVEL_LABELS[riskResult.level];
  const topIndicators = riskResult.indicators
    .slice(0, 3)
    .map((i) => `• ${i.title}: ${i.description}`)
    .join("\n");

  const sslStatus = intel.ssl.valid
    ? "The website has a valid SSL certificate, meaning your connection is encrypted."
    : intel.hasHttps
    ? "The website uses HTTPS but has certificate issues that could indicate a problem."
    : "The website does not use HTTPS encryption, meaning any data you enter could be intercepted.";

  const domainAge = intel.whois?.domainAgeDays
    ? `The domain was registered approximately ${intel.whois.domainAgeDays} days ago.`
    : "";

  return `**Security Analysis for ${intel.domain}**

This URL has been classified as **${level}** with a risk score of ${riskResult.score}/100.

**Why this classification?**
${topIndicators || "• No significant threat indicators were detected."}

**Connection Security**
${sslStatus} ${domainAge}

**What you should do**
${riskResult.recommendations[0] ?? "Exercise caution when visiting unfamiliar URLs."}
${riskResult.recommendations[1] ?? "Verify the source before entering any personal information."}

This analysis was performed automatically by CyberPhish Guardian using pattern recognition and threat intelligence databases.`;
}

// ---------------------------------------------------------------------------
// Build the AI prompt
// ---------------------------------------------------------------------------

function buildPrompt(
  url: string,
  riskResult: RiskResult,
  intel: ThreatIntelligence
): string {
  const indicators = riskResult.indicators
    .slice(0, 8)
    .map((i) => `- ${i.title} (${i.severity}): ${i.description}${i.evidence ? ` [${i.evidence}]` : ""}`)
    .join("\n");

  const sslInfo = intel.ssl.valid
    ? `Valid (issuer: ${intel.ssl.issuer ?? "unknown"}, expires in ${intel.ssl.daysUntilExpiry ?? "?"} days)`
    : `Invalid/Missing (${intel.ssl.error ?? "unknown error"})`;

  const domainInfo = [
    `Domain: ${intel.domain}`,
    `Age: ${intel.whois?.domainAgeDays ? `${intel.whois.domainAgeDays} days` : "Unknown"}`,
    `DNS resolves: ${intel.dns.resolves ? "Yes" : "No"}`,
    `Redirects: ${intel.redirectCount}`,
  ].join(", ");

  return `You are a cybersecurity expert writing a clear, concise security report for a non-technical user.

A URL has been analyzed with the following findings:

URL: ${url.substring(0, 200)}
Risk Score: ${riskResult.score}/100
Threat Level: ${LEVEL_LABELS[riskResult.level]}
Domain Info: ${domainInfo}
SSL Certificate: ${sslInfo}
HTTPS: ${intel.hasHttps ? "Yes" : "No"}
Suspicious Keywords Found: ${intel.suspiciousKeywords.slice(0, 5).join(", ") || "None"}

Threat Indicators Detected (${riskResult.indicators.length} total):
${indicators || "None"}

Top Recommendations:
${riskResult.recommendations.map((r) => `- ${r}`).join("\n")}

Write a 3-4 paragraph explanation that:
1. States the verdict clearly and what it means for the user
2. Explains the key reasons for this classification in simple terms
3. Describes any SSL/security certificate findings
4. Gives clear, actionable advice

Use markdown formatting. Do not use technical jargon. Make it understandable to someone who is not a security expert. Keep it concise — under 300 words total.`;
}

// ---------------------------------------------------------------------------
// Main explanation function
// ---------------------------------------------------------------------------

export async function generateAIExplanation(
  url: string,
  riskResult: RiskResult,
  intel: ThreatIntelligence
): Promise<AIExplanation> {
  if (!openrouter) {
    logger.info("OpenRouter not configured — using fallback explanation");
    return {
      summary: generateFallback(url, riskResult, intel),
      generated: false,
      model: null,
      tokensUsed: null,
      fallback: true,
    };
  }

  try {
    logger.info(`Generating AI explanation for ${intel.domain}`);

    const completion = await openrouter.chat.completions.create({
      model: config.ai.model,
      messages: [
        {
          role: "user",
          content: buildPrompt(url, riskResult, intel),
        },
      ],
      max_tokens: 600,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content ?? generateFallback(url, riskResult, intel);
    const tokensUsed = completion.usage?.total_tokens ?? null;

    logger.info(`AI explanation generated (${tokensUsed} tokens)`);

    return {
      summary,
      generated: true,
      model: completion.model ?? config.ai.model,
      tokensUsed,
      fallback: false,
    };
  } catch (err) {
    logger.error("AI explanation generation failed — using fallback", err);
    return {
      summary: generateFallback(url, riskResult, intel),
      generated: false,
      model: null,
      tokensUsed: null,
      fallback: true,
    };
  }
}
