// =============================================================================
// POST /api/analyze
// Main URL analysis endpoint
// =============================================================================

import { NextRequest } from "next/server";
import { z } from "zod";
import { performScan } from "@/services/scan/orchestrator";
import {
  ApiCreated,
  ApiError,
  ApiValidationError,
} from "@/lib/utils/response";
import { isAppError } from "@/lib/utils/errors";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("API:Analyze");

// ---------------------------------------------------------------------------
// Request validation schema
// ---------------------------------------------------------------------------

const analyzeSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .max(2048, "URL is too long")
    .refine(
      (val) => {
        try {
          const withScheme = /^https?:\/\//i.test(val) ? val : `https://${val}`;
          new URL(withScheme);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid URL format" }
    ),
});

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

  logger.info("Analyze request received", { requestId });

  // ---- Parse request body --------------------------------------------------
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return ApiValidationError("Request body must be valid JSON");
  }

  // ---- Validate input -------------------------------------------------------
  const parsed = analyzeSchema.safeParse(body);
  if (!parsed.success) {
    return ApiValidationError(
      parsed.error.issues[0]?.message ?? "Invalid input",
      parsed.error.flatten()
    );
  }

  const { url } = parsed.data;

  // ---- Extract request metadata --------------------------------------------
  const meta = {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      null,
    userAgent: request.headers.get("user-agent") ?? null,
    requestId,
  };

  // ---- Perform scan --------------------------------------------------------
  try {
    const result = await performScan(url, meta);

    logger.info(`Scan complete: ${result.scan.domain} — ${result.scan.threatLevel} (${result.scan.riskScore}/100)`, { requestId });

    return ApiCreated(result, { requestId });
  } catch (err) {
    if (isAppError(err)) {
      logger.warn(`Scan failed: ${err.message}`, { requestId });
      return ApiError(err.message, err.code, err.statusCode);
    }

    logger.error("Unexpected error during scan", err, requestId);
    return ApiError("An unexpected error occurred during analysis", "INTERNAL_ERROR", 500);
  }
}

// ---------------------------------------------------------------------------
// Block other methods
// ---------------------------------------------------------------------------

export async function GET() {
  return ApiError("Method not allowed. Use POST to analyze a URL.", "METHOD_NOT_ALLOWED", 405);
}
