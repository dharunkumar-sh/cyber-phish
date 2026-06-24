// =============================================================================
// CyberPhish Guardian — Custom Error Classes
// =============================================================================

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ---------------------------------------------------------------------------
// 400 — Bad input
// ---------------------------------------------------------------------------

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

// ---------------------------------------------------------------------------
// 404 — Resource not found
// ---------------------------------------------------------------------------

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}

// ---------------------------------------------------------------------------
// 429 — Rate limiting
// ---------------------------------------------------------------------------

export class RateLimitError extends AppError {
  constructor() {
    super("Too many requests. Please try again later.", "RATE_LIMIT", 429);
  }
}

// ---------------------------------------------------------------------------
// 503 — External service failures
// ---------------------------------------------------------------------------

export class ExternalServiceError extends AppError {
  public readonly service: string;

  constructor(service: string, message?: string, details?: unknown) {
    super(
      message ?? `${service} is temporarily unavailable`,
      "EXTERNAL_SERVICE_ERROR",
      503,
      details
    );
    this.service = service;
  }
}

// ---------------------------------------------------------------------------
// 500 — Database failures
// ---------------------------------------------------------------------------

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed", details?: unknown) {
    super(message, "DATABASE_ERROR", 500, details);
  }
}

// ---------------------------------------------------------------------------
// 500 — AI service failures (non-critical — should gracefully fallback)
// ---------------------------------------------------------------------------

export class AIServiceError extends AppError {
  constructor(message: string = "AI explanation service failed", details?: unknown) {
    super(message, "AI_SERVICE_ERROR", 500, details);
  }
}

// ---------------------------------------------------------------------------
// 400 — Invalid URL
// ---------------------------------------------------------------------------

export class InvalidURLError extends AppError {
  constructor(url: string, reason?: string) {
    super(
      reason ? `Invalid URL "${url}": ${reason}` : `Invalid URL: "${url}"`,
      "INVALID_URL",
      400
    );
  }
}

// ---------------------------------------------------------------------------
// Type guard
// ---------------------------------------------------------------------------

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// ---------------------------------------------------------------------------
// Extract safe error message from unknown
// ---------------------------------------------------------------------------

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}
