// =============================================================================
// GET /api/scans/[id]
// Single scan detail with full data
// =============================================================================

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { scans, reports } from "@/lib/db/schema";
import { ApiSuccess, ApiError, ApiNotFound } from "@/lib/utils/response";
import { createLogger } from "@/lib/utils/logger";
import { eq } from "drizzle-orm";

const logger = createLogger("API:Scans:Detail");

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return ApiError("Invalid scan ID format", "VALIDATION_ERROR", 400);
  }

  if (!db) {
    return ApiError("Database not configured", "SERVICE_UNAVAILABLE", 503);
  }

  try {
    // Fetch scan with its report
    const [scan] = await db
      .select()
      .from(scans)
      .where(eq(scans.id, id))
      .limit(1);

    if (!scan) {
      return ApiNotFound("Scan");
    }

    // Fetch associated report
    const [report] = await db
      .select({
        id: reports.id,
        scanId: reports.scanId,
        title: reports.title,
        executiveSummary: reports.executiveSummary,
        fullReport: reports.fullReport,
        createdAt: reports.createdAt,
      })
      .from(reports)
      .where(eq(reports.scanId, id))
      .limit(1);

    logger.info(`Fetched scan detail: ${id}`, { requestId });

    return ApiSuccess({ scan, report: report ?? null }, { requestId });
  } catch (err) {
    logger.error(`Failed to fetch scan ${id}`, err, requestId);
    return ApiError("Failed to retrieve scan", "DATABASE_ERROR", 500);
  }
}
