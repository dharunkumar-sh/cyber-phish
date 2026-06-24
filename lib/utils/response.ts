import { NextResponse } from "next/server";
import type { ApiResponse, PaginationMeta } from "@/lib/types";

// ---------------------------------------------------------------------------
// Standard success response — 200
// ---------------------------------------------------------------------------

export function ApiSuccess<T>(
  data: T,
  meta?: Partial<{ requestId: string; pagination: PaginationMeta }>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status: 200 }
  );
}

// ---------------------------------------------------------------------------
// Created response — 201
// ---------------------------------------------------------------------------

export function ApiCreated<T>(
  data: T,
  meta?: Partial<{ requestId: string }>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status: 201 }
  );
}

// ---------------------------------------------------------------------------
// Error responses
// ---------------------------------------------------------------------------

export function ApiError(
  message: string,
  code: string = "INTERNAL_ERROR",
  status: number = 500,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined && { details }),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

export function ApiValidationError(
  message: string,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return ApiError(message, "VALIDATION_ERROR", 400, details);
}

export function ApiNotFound(resource: string = "Resource"): NextResponse<ApiResponse<never>> {
  return ApiError(`${resource} not found`, "NOT_FOUND", 404);
}

export function ApiUnauthorized(message = "Unauthorized"): NextResponse<ApiResponse<never>> {
  return ApiError(message, "UNAUTHORIZED", 401);
}

export function ApiRateLimit(): NextResponse<ApiResponse<never>> {
  return ApiError("Too many requests. Please try again later.", "RATE_LIMIT", 429);
}

export function ApiServiceUnavailable(service: string): NextResponse<ApiResponse<never>> {
  return ApiError(
    `${service} is temporarily unavailable`,
    "SERVICE_UNAVAILABLE",
    503
  );
}

// ---------------------------------------------------------------------------
// Build pagination metadata
// ---------------------------------------------------------------------------

export function buildPagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
