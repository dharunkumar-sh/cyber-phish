// =============================================================================
// GET /api/analytics
// Aggregated statistics and trend data
// =============================================================================

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { scans, analytics, reports } from "@/lib/db/schema";
import { ApiSuccess, ApiError } from "@/lib/utils/response";
import { createLogger } from "@/lib/utils/logger";
import { desc, count, avg, sql, eq, sum } from "drizzle-orm";

const logger = createLogger("API:Analytics");

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

  if (!db) {
    // Return empty analytics for dev without DB
    return ApiSuccess(
      {
        totalScans: 0,
        threatsDetected: 0,
        safeUrls: 0,
        reportsGenerated: 0,
        avgRiskScore: 0,
        threatLevelDistribution: {
          safe: 0,
          suspicious: 0,
          high_risk: 0,
          dangerous: 0,
        },
        recentTrend: [],
      },
      { requestId }
    );
  }

  try {
    // ---- Overall aggregate stats from scans table ----------------------------
    const [aggregates] = await db
      .select({
        totalScans: count(),
        avgRiskScore: avg(scans.riskScore),
      })
      .from(scans);

    // ---- Count total reports -------------------------------------------------
    const [reportsCount] = await db
      .select({ count: count() })
      .from(reports);

    // ---- Threat level distribution --------------------------------------------
    const distribution = await db
      .select({
        threatLevel: scans.threatLevel,
        count: count(),
      })
      .from(scans)
      .groupBy(scans.threatLevel);

    const distMap: Record<string, number> = {
      safe: 0,
      suspicious: 0,
      high_risk: 0,
      dangerous: 0,
    };
    for (const row of distribution) {
      distMap[row.threatLevel] = Number(row.count);
    }

    const total = Number(aggregates?.totalScans ?? 0);
    const threatsDetected =
      distMap.suspicious + distMap.high_risk + distMap.dangerous;
    const safeUrls = distMap.safe;

    // ---- Recent 7-day trend from analytics table -----------------------------
    const recentTrend = await db
      .select()
      .from(analytics)
      .orderBy(desc(analytics.date))
      .limit(7);

    // Reverse so latest is last (chart-friendly)
    recentTrend.reverse();

    logger.info(`Analytics fetched: ${total} total scans`, { requestId });

    return ApiSuccess(
      {
        totalScans: total,
        threatsDetected,
        safeUrls,
        reportsGenerated: Number(reportsCount?.count ?? 0),
        avgRiskScore: aggregates?.avgRiskScore
          ? Math.round(parseFloat(aggregates.avgRiskScore as string) * 10) / 10
          : 0,
        threatLevelDistribution: {
          safe: distMap.safe,
          suspicious: distMap.suspicious,
          high_risk: distMap.high_risk,
          dangerous: distMap.dangerous,
        },
        recentTrend,
      },
      { requestId }
    );
  } catch (err) {
    logger.error("Failed to fetch analytics", err, requestId);
    return ApiError("Failed to retrieve analytics data", "DATABASE_ERROR", 500);
  }
}
