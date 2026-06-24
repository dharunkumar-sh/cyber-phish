// =============================================================================
// GET /api/health
// System health check endpoint
// =============================================================================

import { NextRequest } from "next/server";
import { pingDatabase } from "@/lib/db";
import { config } from "@/lib/config/env";
import { ApiSuccess } from "@/lib/utils/response";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("API:Health");

// Record server start time
const SERVER_START = new Date();

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

  const dbConnected = await pingDatabase();

  const uptimeSeconds = Math.floor(
    (Date.now() - SERVER_START.getTime()) / 1000
  );

  const status = {
    status: "ok" as "ok" | "degraded",
    timestamp: new Date().toISOString(),
    uptime: uptimeSeconds,
    version: process.env.npm_package_version ?? "1.0.0",
    environment: config.app.nodeEnv,
    services: {
      database: {
        status: dbConnected ? "connected" : "disconnected",
        configured: !!process.env.DATABASE_URL,
      },
      ai: {
        status: config.ai.hasKey ? "configured" : "not_configured",
        model: config.ai.hasKey ? config.ai.model : null,
      },
      threatIntel: {
        virusTotal: config.threatIntel.hasVirusTotal ? "configured" : "not_configured",
        whois: "available", // RDAP requires no API key
      },
    },
  };

  if (!dbConnected && process.env.DATABASE_URL) {
    status.status = "degraded";
  }

  logger.info(`Health check: ${status.status}`, { requestId });

  return ApiSuccess(status, { requestId });
}
