// =============================================================================
// CyberPhish Guardian — URL Validation Engine
// =============================================================================

import type { ValidationResult } from "@/lib/types";
import { normalizeURL, extractDomain, countSubdomains, extractRegisteredDomain } from "./normalizer";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("URLValidator");

// ---------------------------------------------------------------------------
// URL shortener domains
// ---------------------------------------------------------------------------

const URL_SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly",
  "adf.ly", "j.mp", "short.link", "rb.gy", "cutt.ly", "shorturl.at",
  "tiny.cc", "lnkd.in", "fb.me", "x.co", "bc.vc", "su.pr", "clck.ru",
  "mcaf.ee", "tr.im", "twurl.nl", "url4.eu", "v.gd", "cli.gs",
]);

// ---------------------------------------------------------------------------
// Suspicious TLDs commonly used in phishing
// ---------------------------------------------------------------------------

const SUSPICIOUS_TLDS = new Set([
  "xyz", "tk", "ml", "ga", "cf", "gq", "top", "club", "work", "party",
  "loan", "men", "win", "download", "racing", "date", "faith", "review",
  "stream", "bid", "webcam", "accountant", "science", "trade", "gdn",
]);

// ---------------------------------------------------------------------------
// Suspicious keywords commonly found in phishing URLs
// ---------------------------------------------------------------------------

const SUSPICIOUS_KEYWORDS = [
  "login", "signin", "sign-in", "account", "update", "verify", "secure",
  "banking", "paypal", "paypa1", "amazon", "amaz0n", "microsoft", "micros0ft",
  "apple", "appl3", "google", "g00gle", "facebook", "faceb00k", "netflix",
  "nettflix", "ebay", "ebay-", "wellsfargo", "chase", "citibank", "usps",
  "fedex", "dhl", "irs", "refund", "suspended", "locked", "urgent", "alert",
  "confirm", "password", "credential", "wallet", "crypto", "bitcoin",
];

// ---------------------------------------------------------------------------
// Homoglyph / lookalike character detection
// ---------------------------------------------------------------------------

const HOMOGLYPH_PAIRS = [
  ["0", "o"], ["1", "l"], ["1", "i"], ["3", "e"], ["4", "a"],
  ["5", "s"], ["6", "b"], ["7", "t"], ["8", "b"],
];

// ---------------------------------------------------------------------------
// IPv4 address pattern
// ---------------------------------------------------------------------------

const IPV4_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/;

// ---------------------------------------------------------------------------
// Main validation function
// ---------------------------------------------------------------------------

export function validateURL(raw: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ---- Basic input check ---------------------------------------------------
  if (!raw || raw.trim().length === 0) {
    return {
      valid: false, normalizedUrl: null, domain: null, subdomain: null,
      tld: null, protocol: null, isIPBased: false, isShortened: false,
      hasEncodedChars: false, subdomainDepth: 0, errors: ["URL is required"], warnings: [],
    };
  }

  const input = raw.trim();

  // ---- Maximum length check ------------------------------------------------
  if (input.length > 2048) {
    errors.push("URL exceeds maximum allowed length (2048 characters)");
  }

  // ---- Parse URL -----------------------------------------------------------
  let parsed: URL;
  let input2 = input;

  try {
    if (!/^https?:\/\//i.test(input2)) {
      input2 = "https://" + input2;
    }
    parsed = new URL(input2);
  } catch {
    return {
      valid: false, normalizedUrl: null, domain: null, subdomain: null,
      tld: null, protocol: null, isIPBased: false, isShortened: false,
      hasEncodedChars: false, subdomainDepth: 0,
      errors: [`Invalid URL format: "${raw.substring(0, 100)}"`],
      warnings: [],
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.replace(":", "");
  const pathAndQuery = parsed.pathname + parsed.search;

  // ---- Protocol check ------------------------------------------------------
  if (!["http", "https"].includes(protocol)) {
    errors.push(`Unsupported protocol: ${protocol}. Only HTTP and HTTPS are supported.`);
  }

  // ---- IP-based URL detection ----------------------------------------------
  const isIPBased = IPV4_PATTERN.test(hostname) || hostname.startsWith("["); // IPv6 in brackets

  if (isIPBased) {
    warnings.push("URL uses a numeric IP address instead of a domain name — a common phishing indicator.");
  }

  // ---- TLD extraction ------------------------------------------------------
  const hostnameParts = hostname.split(".");
  const tld = hostnameParts.length >= 2 ? hostnameParts[hostnameParts.length - 1] : null;

  if (!tld || tld.length < 2) {
    errors.push("Invalid or missing TLD (top-level domain).");
  }

  // ---- Suspicious TLD check ------------------------------------------------
  if (tld && SUSPICIOUS_TLDS.has(tld.toLowerCase())) {
    warnings.push(`TLD ".${tld}" is frequently used in phishing and spam campaigns.`);
  }

  // ---- URL shortener detection ---------------------------------------------
  const registeredDomain = extractRegisteredDomain(hostname);
  const isShortened = URL_SHORTENERS.has(registeredDomain) || URL_SHORTENERS.has(hostname);

  if (isShortened) {
    warnings.push("URL appears to be shortened — the final destination is unknown without following the redirect.");
  }

  // ---- Subdomain analysis --------------------------------------------------
  const subdomainDepth = countSubdomains(hostname);
  const subdomain = subdomainDepth > 0
    ? hostname.replace(registeredDomain, "").replace(/\.$/, "")
    : null;

  if (subdomainDepth > 3) {
    warnings.push(`Excessive subdomain depth (${subdomainDepth} levels) — often used to obscure the true domain.`);
  }

  // ---- Encoded character detection -----------------------------------------
  const hasEncodedChars = /%[0-9a-fA-F]{2}/.test(pathAndQuery) ||
    pathAndQuery.includes("%25") ||
    /@/.test(hostname); // @ in hostname is a URL trick

  if (hasEncodedChars) {
    warnings.push("URL contains percent-encoded or obfuscated characters.");
  }

  // ---- Suspicious keyword detection ----------------------------------------
  const fullUrlLower = (hostname + pathAndQuery).toLowerCase();
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => fullUrlLower.includes(kw));

  if (foundKeywords.length > 0) {
    warnings.push(`URL contains suspicious keywords: ${foundKeywords.slice(0, 5).join(", ")}`);
  }

  // ---- Homoglyph detection -------------------------------------------------
  const hasHomoglyphs = HOMOGLYPH_PAIRS.some(([digit, letter]) =>
    hostname.includes(digit) && hostname.replace(new RegExp(digit, "g"), letter) !== hostname
  );
  if (hasHomoglyphs) {
    warnings.push("Domain may contain digit-letter substitutions (e.g. 0→o, 1→l) to impersonate legitimate sites.");
  }

  // ---- Excessive hyphens ---------------------------------------------------
  if ((hostname.match(/-/g) ?? []).length >= 4) {
    warnings.push("Domain contains many hyphens — common in generated phishing domains.");
  }

  // ---- Final validity ------------------------------------------------------
  const valid = errors.length === 0;
  const normalizedUrl = valid ? normalizeURL(raw) : null;
  const domain = valid ? extractDomain(raw) : null;

  logger.debug("URL validation complete", {
    raw: raw.substring(0, 100),
    valid,
    warnings: warnings.length,
    errors: errors.length,
  });

  return {
    valid,
    normalizedUrl,
    domain,
    subdomain,
    tld,
    protocol,
    isIPBased,
    isShortened,
    hasEncodedChars,
    subdomainDepth,
    errors,
    warnings,
  };
}
