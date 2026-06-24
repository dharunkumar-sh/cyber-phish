// =============================================================================
// GET /api/reports
// Paginated list of generated reports
// =============================================================================

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { reports, scans } from "@/lib/db/schema";
import { ApiSuccess, ApiError, buildPagination } from "@/lib/utils/response";
import { createLogger } from "@/lib/utils/logger";
import { desc, count, eq } from "drizzle-orm";

const logger = createLogger("API:Reports");

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const offset = (page - 1) * limit;

  if (!db) {
    return ApiError("Database not configured", "SERVICE_UNAVAILABLE", 503);
  }

  try {
    const [{ total }] = await db.select({ total: count() }).from(reports);

    const rows = await db
      .select({
        id: reports.id,
        scanId: reports.scanId,
        title: reports.title,
        executiveSummary: reports.executiveSummary,
        createdAt: reports.createdAt,
        // Scan summary fields
        domain: scans.domain,
        riskScore: scans.riskScore,
        threatLevel: scans.threatLevel,
        scanCreatedAt: scans.createdAt,
      })
      .from(reports)
      .innerJoin(scans, eq(reports.scanId, scans.id))
      .orderBy(desc(reports.createdAt))
      .limit(limit)
      .offset(offset);

    const pagination = buildPagination(page, limit, Number(total));

    logger.info(`Reports list: ${rows.length} results (page ${page})`, { requestId });

    return ApiSuccess(rows, { requestId, pagination });
  } catch (err) {
    logger.error("Failed to fetch reports list", err, requestId);
    return ApiError("Failed to retrieve reports", "DATABASE_ERROR", 500);
  }
}
