// =============================================================================
// CyberPhish Guardian — Risk Scoring Engine
// Evaluates all rules and produces a final risk score + threat level
// =============================================================================

import type {
  ThreatIntelligence,
  RiskResult,
  ThreatLevel,
  ThreatIndicator,
  TriggeredRule,
} from "@/lib/types";
import { SCORING_RULES } from "./rules";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("RiskEngine");

// ---------------------------------------------------------------------------
// Threat level thresholds
// ---------------------------------------------------------------------------

const THRESHOLDS: Record<ThreatLevel, [number, number]> = {
  safe: [0, 25],
  suspicious: [26, 50],
  high_risk: [51, 75],
  dangerous: [76, 100],
};

function classifyScore(score: number): ThreatLevel {
  for (const [level, [min, max]] of Object.entries(THRESHOLDS) as [ThreatLevel, [number, number]][]) {
    if (score >= min && score <= max) return level;
  }
  return "dangerous";
}

// ---------------------------------------------------------------------------
// Map triggered rules to ThreatIndicators for display
// ---------------------------------------------------------------------------

function ruleToIndicator(rule: TriggeredRule, intel: ThreatIntelligence): ThreatIndicator {
  const categoryMap: Record<string, ThreatIndicator["category"]> = {
    SSL: "ssl",
    Domain: "domain",
    URL: "url_pattern",
    Reputation: "reputation",
    DNS: "dns",
    Redirect: "redirect",
    Pattern: "keyword",
  };

  const severity: ThreatIndicator["severity"] =
    rule.weight >= 35 ? "critical" :
    rule.weight >= 20 ? "high" :
    rule.weight >= 10 ? "medium" : "low";

  // Build evidence string
  let evidence: string | undefined;
  if (rule.id === "PHISHING_KEYWORDS_MANY" || rule.id === "PHISHING_KEYWORDS_FEW") {
    evidence = `Found: ${intel.suspiciousKeywords.slice(0, 5).join(", ")}`;
  } else if (rule.id === "REDIRECT_CHAIN") {
    evidence = `${intel.redirectCount} redirect(s) detected`;
  } else if (rule.id === "NEW_DOMAIN" || rule.id === "DOMAIN_AGE_YOUNG") {
    evidence = intel.whois?.domainAgeDays
      ? `Domain age: ${intel.whois.domainAgeDays} days`
      : undefined;
  } else if (rule.id === "SSL_EXPIRING_SOON") {
    evidence = `Expires in ${intel.ssl.daysUntilExpiry} days`;
  } else if (rule.id === "VT_MALICIOUS" || rule.id === "VT_SUSPICIOUS") {
    evidence = intel.virusTotal
      ? `${intel.virusTotal.malicious} malicious, ${intel.virusTotal.suspicious} suspicious detections`
      : undefined;
  }

  return {
    id: rule.id,
    category: categoryMap[rule.category] ?? "url_pattern",
    severity,
    title: rule.name,
    description: rule.description,
    ...(evidence && { evidence }),
  };
}

// ---------------------------------------------------------------------------
// Build recommendations based on triggered rules and intel
// ---------------------------------------------------------------------------

function buildRecommendations(
  triggeredRules: TriggeredRule[],
  intel: ThreatIntelligence,
  level: ThreatLevel
): string[] {
  const recs: string[] = [];
  const ruleIds = new Set(triggeredRules.map((r) => r.id));

  if (level === "dangerous" || level === "high_risk") {
    recs.push("Do not visit this URL. Close this tab immediately if open.");
    recs.push("If you have entered any credentials, change your passwords immediately.");
    recs.push("Run a malware scan on your device if you clicked the link.");
  }

  if (ruleIds.has("NO_HTTPS") || ruleIds.has("SSL_INVALID") || ruleIds.has("SSL_SELF_SIGNED")) {
    recs.push("Never enter sensitive information on a site without a valid HTTPS certificate.");
  }

  if (ruleIds.has("URL_SHORTENER")) {
    recs.push("Use a URL expander service (e.g. checkshorturl.com) to reveal the final destination before clicking.");
  }

  if (ruleIds.has("NEW_DOMAIN") || ruleIds.has("DOMAIN_AGE_YOUNG")) {
    recs.push("Be cautious of newly registered domains — legitimate organizations typically have established domains.");
  }

  if (ruleIds.has("PHISHING_KEYWORDS_MANY") || ruleIds.has("PHISHING_KEYWORDS_FEW")) {
    recs.push("Phishing URLs often impersonate well-known brands. Verify the URL by navigating directly to the official website.");
  }

  if (ruleIds.has("VT_MALICIOUS")) {
    recs.push("This URL has been flagged by VirusTotal. Report it to your IT/security team immediately.");
  }

  if (level === "suspicious") {
    recs.push("Exercise caution. Verify the source of this link before proceeding.");
    recs.push("Check if the URL matches the official domain of the service it claims to represent.");
  }

  if (level === "safe" && recs.length === 0) {
    recs.push("This URL appears safe based on current analysis. Always stay cautious online.");
    recs.push("Keep your browser and security software up to date.");
  }

  // Deduplicate
  return [...new Set(recs)].slice(0, 6);
}

// ---------------------------------------------------------------------------
// Main scoring function
// ---------------------------------------------------------------------------

export function calculateRiskScore(intel: ThreatIntelligence): RiskResult {
  const triggeredRules: TriggeredRule[] = [];
  let rawScore = 0;

  for (const rule of SCORING_RULES) {
    let triggered = false;
    try {
      triggered = rule.check(intel);
    } catch (err) {
      logger.warn(`Rule "${rule.id}" threw during check`, err);
      continue;
    }

    if (triggered) {
      rawScore += rule.weight;
      triggeredRules.push({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        weight: rule.weight,
        category: rule.category,
      });
    }
  }

  // Cap at 100
  const score = Math.min(rawScore, 100);
  const level = classifyScore(score);

  // Build indicators for display
  const indicators: ThreatIndicator[] = triggeredRules.map((rule) =>
    ruleToIndicator(rule, intel)
  );

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  indicators.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const recommendations = buildRecommendations(triggeredRules, intel, level);

  logger.info(`Risk scoring complete: score=${score}, level=${level}, rules_triggered=${triggeredRules.length}`);

  return {
    score,
    level,
    triggeredRules,
    totalRulesChecked: SCORING_RULES.length,
    indicators,
    recommendations,
  };
}

// ---------------------------------------------------------------------------
// Calculate phishing probability (0.0 – 1.0)
// ---------------------------------------------------------------------------

export function calculatePhishingProbability(
  score: number,
  intel: ThreatIntelligence
): number {
  // Base probability from score (sigmoid-like mapping)
  let prob = score / 100;

  // Boost if VirusTotal confirmed malicious
  if (intel.virusTotal && intel.virusTotal.malicious >= 3) prob = Math.max(prob, 0.9);

  // Boost if multiple high-signal indicators
  if (intel.suspiciousKeywords.length >= 3 && intel.isIPBased) prob = Math.min(prob + 0.2, 1.0);

  return Math.round(prob * 10000) / 10000; // 4 decimal places
}
