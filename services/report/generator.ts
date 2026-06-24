// =============================================================================
// CyberPhish Guardian — Report Generation Service
// Converts analysis results into a structured CyberReport
// =============================================================================

import type {
  CyberReport,
  RiskResult,
  ThreatIntelligence,
  AIExplanation,
  ValidationResult,
  ThreatLevel,
  ExecutiveSummary,
  TechnicalFindings,
} from "@/lib/types";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("ReportGenerator");

// ---------------------------------------------------------------------------
// Threat level display config
// ---------------------------------------------------------------------------

const THREAT_CONFIG: Record<
  ThreatLevel,
  { label: string; color: string; description: string }
> = {
  safe: {
    label: "Safe",
    color: "#22c55e",
    description:
      "This URL shows no significant threat indicators and appears to be safe for browsing.",
  },
  suspicious: {
    label: "Suspicious",
    color: "#f59e0b",
    description:
      "This URL has some indicators that warrant caution. Verify its legitimacy before proceeding.",
  },
  high_risk: {
    label: "High Risk",
    color: "#f97316",
    description:
      "This URL exhibits multiple high-risk patterns. It may be involved in phishing or malware distribution.",
  },
  dangerous: {
    label: "Dangerous",
    color: "#ef4444",
    description:
      "This URL is highly likely to be malicious. Do not visit it or share any personal information.",
  },
};

// ---------------------------------------------------------------------------
// Executive summary builder
// ---------------------------------------------------------------------------

function buildExecutiveSummary(
  riskResult: RiskResult,
  intel: ThreatIntelligence,
  validation: ValidationResult
): ExecutiveSummary {
  const level = riskResult.level;
  const config = THREAT_CONFIG[level];

  const verdictMap: Record<ThreatLevel, string> = {
    safe: `The URL "${intel.domain}" has been assessed as safe. No significant threat indicators were detected.`,
    suspicious: `The URL "${intel.domain}" shows suspicious characteristics and requires caution before visiting.`,
    high_risk: `The URL "${intel.domain}" is classified as HIGH RISK. Multiple threat indicators suggest phishing or malicious intent.`,
    dangerous: `WARNING: The URL "${intel.domain}" is DANGEROUS. Strong evidence of malicious activity was detected. Do not visit this site.`,
  };

  const immediateActionMap: Record<ThreatLevel, string> = {
    safe: "This URL appears safe. Standard browsing precautions apply.",
    suspicious: "Verify the legitimacy of this URL before entering any personal information.",
    high_risk: "Avoid visiting this URL. If accessed, do not enter any credentials or personal data.",
    dangerous: "Do NOT visit this URL. Report it to your security team and block it immediately.",
  };

  const keyFindings = riskResult.indicators
    .filter((i) => i.severity === "critical" || i.severity === "high")
    .slice(0, 4)
    .map((i) => i.title);

  if (keyFindings.length === 0) {
    keyFindings.push("No critical threat indicators detected");
  }

  return {
    verdict: verdictMap[level],
    threatLevel: level,
    riskScore: riskResult.score,
    keyFindings,
    immediateAction: immediateActionMap[level],
  };
}

// ---------------------------------------------------------------------------
// Technical findings builder
// ---------------------------------------------------------------------------

function buildTechnicalFindings(
  intel: ThreatIntelligence,
  validation: ValidationResult
): TechnicalFindings {
  return {
    ssl: intel.ssl,
    dns: intel.dns,
    urlAnalysis: {
      isIPBased: intel.isIPBased,
      isShortened: intel.isShortened,
      subdomainDepth: intel.subdomainDepth,
      hasEncodedChars: intel.hasEncodedChars,
      redirectCount: intel.redirectCount,
      finalUrl: intel.finalUrl,
    },
    externalReputation: {
      virusTotal: intel.virusTotal,
    },
  };
}

// ---------------------------------------------------------------------------
// Main report generator
// ---------------------------------------------------------------------------

export function generateReport(
  scanId: string,
  url: string,
  validation: ValidationResult,
  intel: ThreatIntelligence,
  riskResult: RiskResult,
  aiExplanation: AIExplanation,
  scanDurationMs: number
): CyberReport {
  logger.info(`Generating report for scan ${scanId}`);

  const threatConfig = THREAT_CONFIG[riskResult.level];
  const executiveSummary = buildExecutiveSummary(riskResult, intel, validation);
  const technicalFindings = buildTechnicalFindings(intel, validation);

  const report: CyberReport = {
    id: crypto.randomUUID(),
    scanId,
    title: `Security Analysis Report — ${intel.domain}`,
    generatedAt: new Date(),

    executiveSummary,

    threatClassification: {
      level: riskResult.level,
      label: threatConfig.label,
      color: threatConfig.color,
      description: threatConfig.description,
    },

    riskScore: riskResult.score,
    riskBreakdown: riskResult.triggeredRules,
    detectedIndicators: riskResult.indicators,
    technicalFindings,
    recommendations: riskResult.recommendations,
    aiExplanation,

    metadata: {
      scanDurationMs,
      analyzedUrl: url,
      normalizedUrl: validation.normalizedUrl ?? url,
      domain: intel.domain,
      timestamp: new Date(),
    },
  };

  logger.info(`Report generated: ${report.id} for domain ${intel.domain}`);
  return report;
}
