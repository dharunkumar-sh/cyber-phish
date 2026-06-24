// =============================================================================
// CyberPhish Guardian — Structured Logger
// =============================================================================

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  service?: string;
  data?: unknown;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const isDev = process.env.NODE_ENV !== "production";

// ---------------------------------------------------------------------------
// ANSI colors for dev console output
// ---------------------------------------------------------------------------

const colors: Record<LogLevel, string> = {
  debug: "\x1b[36m", // cyan
  info: "\x1b[32m",  // green
  warn: "\x1b[33m",  // yellow
  error: "\x1b[31m", // red
};
const reset = "\x1b[0m";

function formatDev(entry: LogEntry): string {
  const color = colors[entry.level];
  const prefix = `${color}[${entry.level.toUpperCase()}]${reset}`;
  const svc = entry.service ? ` [${entry.service}]` : "";
  const rid = entry.requestId ? ` rid=${entry.requestId}` : "";
  const base = `${prefix}${svc}${rid} ${entry.message}`;
  const extra = entry.data ? `\n  data: ${JSON.stringify(entry.data, null, 2)}` : "";
  const err = entry.error ? `\n  error: ${entry.error.message}\n  ${entry.error.stack ?? ""}` : "";
  return `${base}${extra}${err}`;
}

// ---------------------------------------------------------------------------
// Core log function
// ---------------------------------------------------------------------------

function log(
  level: LogLevel,
  message: string,
  options?: { service?: string; requestId?: string; data?: unknown; error?: unknown }
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(options?.service && { service: options.service }),
    ...(options?.requestId && { requestId: options.requestId }),
    ...(options?.data !== undefined && { data: options.data }),
  };

  if (options?.error) {
    const e = options.error;
    entry.error = {
      name: e instanceof Error ? e.name : "Error",
      message: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
    };
  }

  if (isDev) {
    // Human-readable colored output in development
    const output = formatDev(entry);
    if (level === "error") {
      console.error(output);
    } else if (level === "warn") {
      console.warn(output);
    } else {
      console.log(output);
    }
  } else {
    // JSON output in production (for log aggregation services)
    const json = JSON.stringify(entry);
    if (level === "error") {
      console.error(json);
    } else if (level === "warn") {
      console.warn(json);
    } else {
      console.log(json);
    }
  }
}

// ---------------------------------------------------------------------------
// Logger factory — create a named logger for a service/module
// ---------------------------------------------------------------------------

export function createLogger(service: string) {
  return {
    debug: (msg: string, data?: unknown, requestId?: string) =>
      log("debug", msg, { service, data, requestId }),
    info: (msg: string, data?: unknown, requestId?: string) =>
      log("info", msg, { service, data, requestId }),
    warn: (msg: string, data?: unknown, requestId?: string) =>
      log("warn", msg, { service, data, requestId }),
    error: (msg: string, error?: unknown, requestId?: string) =>
      log("error", msg, { service, error, requestId }),
  };
}

// ---------------------------------------------------------------------------
// Root logger (use for app-level events)
// ---------------------------------------------------------------------------

export const logger = createLogger("CyberPhish");
