import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Paths that middleware applies to
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    // Apply to all API routes
    "/api/:path*",
    // Apply to all pages (for security headers)
    "/((?!_next/static|_next/image|favicon.ico|icon.png).*)",
  ],
};

// ---------------------------------------------------------------------------
// Security headers applied to every response
// ---------------------------------------------------------------------------

const SECURITY_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  // Prevent MIME sniffing
  "X-Content-Type-Options": "nosniff",
  // Enable XSS protection in older browsers
  "X-XSS-Protection": "1; mode=block",
  // Don't send referrer for cross-origin requests
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Disable FLoC / Topics API
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  // Basic CSP (permissive for dev, tighten for prod)
  "Content-Security-Policy":
    process.env.NODE_ENV === "production"
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none';"
      : "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
};

// ---------------------------------------------------------------------------
// Middleware function
// ---------------------------------------------------------------------------

export function proxy(request: NextRequest) {
  // ---- Generate request ID for correlation ---------------------------------
  const requestId =
    request.headers.get("x-request-id") ?? crypto.randomUUID();

  // ---- Build response with injected headers --------------------------------
  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers.entries()),
        "x-request-id": requestId,
      }),
    },
  });

  // Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Pass request ID back in response for client correlation
  response.headers.set("x-request-id", requestId);

  return response;
}

