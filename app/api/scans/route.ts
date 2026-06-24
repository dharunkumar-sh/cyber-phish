// =============================================================================
// GET /api/scans
// Paginated scan history with filtering and search
// =============================================================================

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { scans } from "@/lib/db/schema";
import { ApiSuccess, ApiError, buildPagination } from "@/lib/utils/response";
import { createLogger } from "@/lib/utils/logger";
import { desc, asc, eq, like, or, and, count, sql } from "drizzle-orm";
import type { ThreatLevel } from "@/lib/types";

const logger = createLogger("API:Scans");

const VALID_THREAT_LEVELS: ThreatLevel[] = ["safe", "suspicious", "high_risk", "dangerous"];

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const { searchParams } = request.nextUrl;

  // ---- Parse query params --------------------------------------------------
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const offset = (page - 1) * limit;
  const threatLevelParam = searchParams.get("threat_level") as ThreatLevel | null;
  const search = searchParams.get("search")?.trim() ?? null;
  const sortBy = searchParams.get("sort") === "risk_score" ? "risk_score" : "created_at";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  // Validate threat level if provided
  if (threatLevelParam && !VALID_THREAT_LEVELS.includes(threatLevelParam)) {
    return ApiError(
      `Invalid threat_level. Must be one of: ${VALID_THREAT_LEVELS.join(", ")}`,
      "VALIDATION_ERROR",
      400
    );
  }

  if (!db) {
    return ApiError("Database not configured", "SERVICE_UNAVAILABLE", 503);
  }

  try {
    // ---- Build where conditions ---------------------------------------------
    const conditions = [];

    if (threatLevelParam) {
      conditions.push(eq(scans.threatLevel, threatLevelParam));
    }

    if (search) {
      conditions.push(
        or(
          like(scans.domain, `%${search}%`),
          like(scans.url, `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // ---- Count total matching records ----------------------------------------
    const [{ total }] = await db
      .select({ total: count() })
      .from(scans)
      .where(whereClause);

    // ---- Fetch records -------------------------------------------------------
    const orderCol = sortBy === "risk_score" ? scans.riskScore : scans.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const rows = await db
      .select({
        id: scans.id,
        url: scans.url,
        domain: scans.domain,
        riskScore: scans.riskScore,
        threatLevel: scans.threatLevel,
        phishingProbability: scans.phishingProbability,
        sslValid: scans.sslValid,
        redirectCount: scans.redirectCount,
        scanDurationMs: scans.scanDurationMs,
        createdAt: scans.createdAt,
      })
      .from(scans)
      .where(whereClause)
      .orderBy(orderFn(orderCol))
      .limit(limit)
      .offset(offset);

    const pagination = buildPagination(page, limit, Number(total));

    logger.info(`Scans list: ${rows.length} results (page ${page}/${pagination.totalPages})`, { requestId });

    return ApiSuccess(rows, { requestId, pagination });
  } catch (err) {
    logger.error("Failed to fetch scan history", err, requestId);
    return ApiError("Failed to retrieve scan history", "DATABASE_ERROR", 500);
  }
}
