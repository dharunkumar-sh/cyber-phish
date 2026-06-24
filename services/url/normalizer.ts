// =============================================================================
// CyberPhish Guardian — URL Normalizer
// =============================================================================

import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("URLNormalizer");

// Known tracking parameter prefixes to strip
const TRACKING_PARAMS = new Set([
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "fbclid", "gclid", "gclsrc", "dclid", "msclkid", "_ga", "ref", "mc_cid",
  "mc_eid", "yclid", "twclid", "_hsenc", "_hsmi", "hsa_cam", "hsa_grp",
]);

// ---------------------------------------------------------------------------
// Main normalizer
// ---------------------------------------------------------------------------

export function normalizeURL(raw: string): string {
  try {
    // Trim and add scheme if missing
    let input = raw.trim();
    if (!/^https?:\/\//i.test(input)) {
      input = "https://" + input;
    }

    const url = new URL(input);

    // Lowercase scheme and host
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase();

    // Remove default ports
    if (
      (url.protocol === "http:" && url.port === "80") ||
      (url.protocol === "https:" && url.port === "443")
    ) {
      url.port = "";
    }

    // Remove trailing slash from root
    if (url.pathname === "/") {
      url.pathname = "";
    }

    // Remove tracking query params
    const cleaned = new URLSearchParams();
    url.searchParams.forEach((value, key) => {
      if (!TRACKING_PARAMS.has(key.toLowerCase())) {
        cleaned.set(key, value);
      }
    });
    url.search = cleaned.toString() ? `?${cleaned.toString()}` : "";

    // Remove fragment (anchors don't affect server-side content)
    url.hash = "";

    return url.toString();
  } catch (err) {
    logger.warn("Failed to normalize URL, returning original", { raw }, undefined);
    return raw;
  }
}

// ---------------------------------------------------------------------------
// Extract domain from URL string
// ---------------------------------------------------------------------------

export function extractDomain(url: string): string | null {
  try {
    let input = url.trim();
    if (!/^https?:\/\//i.test(input)) {
      input = "https://" + input;
    }
    const parsed = new URL(input);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Extract the registered domain (e.g. "sub.example.com" → "example.com")
// Simple implementation that handles most cases without a full PSL library
// ---------------------------------------------------------------------------

export function extractRegisteredDomain(hostname: string): string {
  const parts = hostname.split(".");
  // Naive: return last 2 parts (or last 3 if second-to-last is short like "co.uk")
  const knownSLDs = new Set(["co", "com", "net", "org", "gov", "edu", "ac"]);
  if (parts.length >= 3 && knownSLDs.has(parts[parts.length - 2])) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

// ---------------------------------------------------------------------------
// Count subdomains (not counting www)
// ---------------------------------------------------------------------------

export function countSubdomains(hostname: string): number {
  const registered = extractRegisteredDomain(hostname);
  const prefix = hostname.replace(registered, "").replace(/\.$/, "");
  if (!prefix) return 0;
  const parts = prefix.split(".").filter(Boolean);
  const withoutWww = parts.filter((p) => p !== "www");
  return withoutWww.length;
}
