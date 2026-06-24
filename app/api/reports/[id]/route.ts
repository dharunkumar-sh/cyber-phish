// =============================================================================
// GET  /api/reports/[id]  — retrieve single report
// DELETE /api/reports/[id] — delete report
// =============================================================================

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { reports, scans } from "@/lib/db/schema";
import { ApiSuccess, ApiError, ApiNotFound } from "@/lib/utils/response";
import { createLogger } from "@/lib/utils/logger";
import { eq } from "drizzle-orm";

const logger = createLogger("API:Reports:Detail");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------------------------------------------------------------------------
// GET — fetch single report with associated scan
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return ApiError("Invalid report ID format", "VALIDATION_ERROR", 400);
  }

  if (!db) {
    return ApiError("Database not configured", "SERVICE_UNAVAILABLE", 503);
  }

  try {
    const [row] = await db
      .select({
        report: reports,
        scan: {
          id: scans.id,
          url: scans.url,
          domain: scans.domain,
          riskScore: scans.riskScore,
          threatLevel: scans.threatLevel,
          createdAt: scans.createdAt,
        },
      })
      .from(reports)
      .innerJoin(scans, eq(reports.scanId, scans.id))
      .where(eq(reports.id, id))
      .limit(1);

    if (!row) {
      return ApiNotFound("Report");
    }

    logger.info(`Fetched report: ${id}`, { requestId });
    return ApiSuccess(row, { requestId });
  } catch (err) {
    logger.error(`Failed to fetch report ${id}`, err, requestId);
    return ApiError("Failed to retrieve report", "DATABASE_ERROR", 500);
  }
}

// ---------------------------------------------------------------------------
// DELETE — remove a report
// ---------------------------------------------------------------------------

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return ApiError("Invalid report ID format", "VALIDATION_ERROR", 400);
  }

  if (!db) {
    return ApiError("Database not configured", "SERVICE_UNAVAILABLE", 503);
  }

  try {
    const [deleted] = await db
      .delete(reports)
      .where(eq(reports.id, id))
      .returning({ id: reports.id });

    if (!deleted) {
      return ApiNotFound("Report");
    }

    logger.info(`Deleted report: ${id}`, { requestId });
    return ApiSuccess({ deleted: true, id }, { requestId });
  } catch (err) {
    logger.error(`Failed to delete report ${id}`, err, requestId);
    return ApiError("Failed to delete report", "DATABASE_ERROR", 500);
  }
}
