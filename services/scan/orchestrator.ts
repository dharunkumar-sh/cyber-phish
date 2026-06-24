// =============================================================================
// CyberPhish Guardian — Scan Orchestrator
// Top-level workflow: validate → gather intel → score → explain → persist
// =============================================================================

import { db } from "@/lib/db";
import { scans, reports, analytics } from "@/lib/db/schema";
import { validateURL } from "@/services/url/validator";
import { gatherThreatIntelligence } from "@/services/threat/intelligence";
import { calculateRiskScore, calculatePhishingProbability } from "@/services/risk/engine";
import { generateAIExplanation } from "@/services/ai/explainer";
import { generateReport } from "@/services/report/generator";
import { InvalidURLError, DatabaseError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";
import type { ScanResult, RequestMeta } from "@/lib/types";
import { eq, sql } from "drizzle-orm";

const logger = createLogger("ScanOrchestrator");

// ---------------------------------------------------------------------------
// Update daily analytics aggregate
// ---------------------------------------------------------------------------

async function updateDailyAnalytics(
  riskScore: number,
  level: string
): Promise<void> {
  if (!db) return;

  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    await db
      .insert(analytics)
      .values({
        date: today,
        totalScans: 1,
        threatsDetected: level !== "safe" ? 1 : 0,
        safeUrls: level === "safe" ? 1 : 0,
        avgRiskScore: riskScore.toString(),
        dangerousCount: level === "dangerous" ? 1 : 0,
        highRiskCount: level === "high_risk" ? 1 : 0,
        suspiciousCount: level === "suspicious" ? 1 : 0,
      })
      .onConflictDoUpdate({
        target: analytics.date,
        set: {
          totalScans: sql`${analytics.totalScans} + 1`,
          threatsDetected: sql`${analytics.threatsDetected} + ${level !== "safe" ? 1 : 0}`,
          safeUrls: sql`${analytics.safeUrls} + ${level === "safe" ? 1 : 0}`,
          // Running average: (old_avg * old_count + new_score) / new_count
          avgRiskScore: sql`(${analytics.avgRiskScore} * ${analytics.totalScans} + ${riskScore}) / (${analytics.totalScans} + 1)`,
          dangerousCount: sql`${analytics.dangerousCount} + ${level === "dangerous" ? 1 : 0}`,
          highRiskCount: sql`${analytics.highRiskCount} + ${level === "high_risk" ? 1 : 0}`,
          suspiciousCount: sql`${analytics.suspiciousCount} + ${level === "suspicious" ? 1 : 0}`,
        },
      });
  } catch (err) {
    // Analytics failure is non-critical — log and continue
    logger.error("Failed to update daily analytics", err);
  }
}

// ---------------------------------------------------------------------------
// Main scan workflow
// ---------------------------------------------------------------------------

export async function performScan(
  rawUrl: string,
  meta: RequestMeta
): Promise<ScanResult> {
  const startTime = Date.now();
  logger.info(`Starting scan for URL: ${rawUrl.substring(0, 100)}`, { requestId: meta.requestId });

  // ---- Step 1: Validate URL ------------------------------------------------
  const validation = validateURL(rawUrl);

  if (!validation.valid || !validation.domain || !validation.normalizedUrl) {
    throw new InvalidURLError(rawUrl, validation.errors.join("; "));
  }

  logger.info(`URL validated: ${validation.domain}`, { requestId: meta.requestId });

  // ---- Step 2: Gather threat intelligence (parallel) -----------------------
  const intel = await gatherThreatIntelligence(validation, rawUrl);
  logger.info(`Intelligence gathered for ${validation.domain}`, { requestId: meta.requestId });

  // ---- Step 3: Calculate risk score ----------------------------------------
  const riskResult = calculateRiskScore(intel);
  const phishingProb = calculatePhishingProbability(riskResult.score, intel);
  logger.info(`Risk score: ${riskResult.score} (${riskResult.level})`, { requestId: meta.requestId });

  // ---- Step 4: Generate AI explanation -------------------------------------
  const aiExplanation = await generateAIExplanation(rawUrl, riskResult, intel);

  // ---- Step 5: Calculate duration ------------------------------------------
  const scanDurationMs = Date.now() - startTime;

  // ---- Step 6: Generate report ---------------------------------------------
  const scanId = crypto.randomUUID();
  const report = generateReport(
    scanId,
    rawUrl,
    validation,
    intel,
    riskResult,
    aiExplanation,
    scanDurationMs
  );

  // ---- Step 7: Persist to database -----------------------------------------
  let scanRecord: typeof scans.$inferSelect;
  let reportRecord: typeof reports.$inferSelect;

  if (db) {
    try {
      // Insert scan
      const [insertedScan] = await db
        .insert(scans)
        .values({
          id: scanId,
          url: rawUrl,
          normalizedUrl: validation.normalizedUrl,
          domain: validation.domain,
          riskScore: riskResult.score,
          threatLevel: riskResult.level,
          phishingProbability: phishingProb.toString(),
          sslValid: intel.ssl.valid,
          sslIssuer: intel.ssl.issuer,
          sslExpiry: intel.ssl.validTo,
          domainAgeDays: intel.whois?.domainAgeDays ?? null,
          redirectCount: intel.redirectCount,
          threatIndicators: riskResult.indicators,
          scoringFactors: riskResult.triggeredRules,
          aiSummary: aiExplanation.summary,
          recommendations: riskResult.recommendations,
          scanDurationMs,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
        })
        .returning();

      scanRecord = insertedScan;

      // Insert report
      const [insertedReport] = await db
        .insert(reports)
        .values({
          id: report.id,
          scanId,
          title: report.title,
          executiveSummary: report.executiveSummary.verdict,
          technicalFindings: report.technicalFindings,
          fullReport: report,
        })
        .returning();

      reportRecord = insertedReport;

      // Update analytics (non-blocking)
      updateDailyAnalytics(riskResult.score, riskResult.level).catch(() => {});

      logger.info(`Scan and report persisted: ${scanId}`, { requestId: meta.requestId });
    } catch (err) {
      logger.error("Database persistence failed", err, meta.requestId);
      throw new DatabaseError("Failed to save scan results to database", err);
    }
  } else {
    // No database — return in-memory result (dev mode without DB)
    logger.warn("No database configured — returning in-memory result");
    scanRecord = {
      id: scanId,
      url: rawUrl,
      normalizedUrl: validation.normalizedUrl,
      domain: validation.domain,
      riskScore: riskResult.score,
      threatLevel: riskResult.level,
      phishingProbability: phishingProb.toString(),
      sslValid: intel.ssl.valid,
      sslIssuer: intel.ssl.issuer,
      sslExpiry: intel.ssl.validTo,
      domainAgeDays: intel.whois?.domainAgeDays ?? null,
      redirectCount: intel.redirectCount,
      threatIndicators: riskResult.indicators,
      scoringFactors: riskResult.triggeredRules,
      aiSummary: aiExplanation.summary,
      recommendations: riskResult.recommendations,
      scanDurationMs,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    reportRecord = {
      id: report.id,
      scanId,
      title: report.title,
      executiveSummary: report.executiveSummary.verdict,
      technicalFindings: report.technicalFindings,
      fullReport: report,
      createdAt: new Date(),
    };
  }

  return {
    scan: {
      id: scanRecord.id,
      url: scanRecord.url,
      normalizedUrl: scanRecord.normalizedUrl,
      domain: scanRecord.domain,
      riskScore: scanRecord.riskScore,
      threatLevel: scanRecord.threatLevel,
      phishingProbability: parseFloat(scanRecord.phishingProbability as string),
      sslValid: scanRecord.sslValid,
      sslIssuer: scanRecord.sslIssuer,
      sslExpiry: scanRecord.sslExpiry,
      domainAgeDays: scanRecord.domainAgeDays,
      redirectCount: scanRecord.redirectCount,
      threatIndicators: scanRecord.threatIndicators as never,
      scoringFactors: scanRecord.scoringFactors as never,
      aiSummary: scanRecord.aiSummary,
      recommendations: scanRecord.recommendations as string[],
      scanDurationMs: scanRecord.scanDurationMs,
      ipAddress: scanRecord.ipAddress,
      userAgent: scanRecord.userAgent,
      createdAt: scanRecord.createdAt,
      updatedAt: scanRecord.updatedAt,
    },
    report: {
      id: reportRecord.id,
      scanId: reportRecord.scanId,
      title: reportRecord.title,
      executiveSummary: reportRecord.executiveSummary,
      technicalFindings: reportRecord.technicalFindings as never,
      fullReport: reportRecord.fullReport as never,
      createdAt: reportRecord.createdAt,
    },
    intelligence: intel,
  };
}
