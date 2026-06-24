// =============================================================================
// CyberPhish Guardian — Threat Intelligence Orchestrator
// Collects all intelligence signals and structures them for the risk engine
// =============================================================================

import type { ThreatIntelligence, ValidationResult } from "@/lib/types";
import { analyzeSSL } from "./ssl";
import { analyzeDNS } from "./dns";
import { checkVirusTotal } from "./providers/virustotal";
import { checkWhois } from "./providers/whois";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("ThreatIntelligence");

// ---------------------------------------------------------------------------
// Suspicious keywords for content-based checks
// ---------------------------------------------------------------------------

const SUSPICIOUS_KEYWORDS = [
  "login", "signin", "sign-in", "account", "update", "verify", "secure",
  "banking", "paypal", "amazon", "microsoft", "apple", "google", "facebook",
  "netflix", "ebay", "wellsfargo", "chase", "citibank", "usps", "fedex",
  "dhl", "irs", "refund", "suspended", "locked", "urgent", "alert",
  "confirm", "password", "credential", "wallet", "crypto", "bitcoin",
];

const SUSPICIOUS_TLDS = new Set([
  "xyz", "tk", "ml", "ga", "cf", "gq", "top", "club", "work", "party",
  "loan", "men", "win", "download", "racing", "date", "faith",
]);

// ---------------------------------------------------------------------------
// Follow redirects and count hops (max 5)
// ---------------------------------------------------------------------------

async function followRedirects(
  url: string
): Promise<{ finalUrl: string; count: number }> {
  let current = url;
  let count = 0;
  const maxRedirects = 5;

  try {
    while (count < maxRedirects) {
      const response = await fetch(current, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(5000),
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) break;
        current = location.startsWith("http") ? location : new URL(location, current).toString();
        count++;
      } else {
        break;
      }
    }
  } catch {
    // Network errors — return what we have
  }

  return { finalUrl: current, count };
}

// ---------------------------------------------------------------------------
// Main intelligence gathering function
// ---------------------------------------------------------------------------

export async function gatherThreatIntelligence(
  validation: ValidationResult,
  originalUrl: string
): Promise<ThreatIntelligence> {
  const domain = validation.domain!;
  const normalizedUrl = validation.normalizedUrl ?? originalUrl;
  const hostname = domain;
  const tld = validation.tld ?? "";

  logger.info(`Gathering threat intelligence for ${domain}`);

  // ---- Parallel collection -------------------------------------------------
  const [sslResult, dnsResult, vtResult, whoisResult, redirectResult] =
    await Promise.allSettled([
      analyzeSSL(hostname),
      analyzeDNS(hostname),
      checkVirusTotal(normalizedUrl),
      checkWhois(domain),
      followRedirects(normalizedUrl),
    ]);

  const ssl = sslResult.status === "fulfilled" ? sslResult.value : {
    valid: false, issuer: null, subject: null, validFrom: null, validTo: null,
    daysUntilExpiry: null, selfSigned: false, error: "SSL analysis failed",
  };

  const dnsInfo = dnsResult.status === "fulfilled" ? dnsResult.value : {
    resolves: false, ipAddresses: [], hasIPv6: false, hasMX: false,
    hasSPF: false, hasDMARC: false, error: "DNS analysis failed",
  };

  const virusTotal = vtResult.status === "fulfilled" ? vtResult.value : null;
  const whois = whoisResult.status === "fulfilled" ? whoisResult.value : null;

  const { finalUrl, count: redirectCount } =
    redirectResult.status === "fulfilled" ? redirectResult.value : { finalUrl: null, count: 0 };

  // ---- Keyword detection ---------------------------------------------------
  const urlLower = (domain + (new URL(normalizedUrl).pathname ?? "") + (new URL(normalizedUrl).search ?? "")).toLowerCase();
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => urlLower.includes(kw));

  logger.info(`Intelligence gathered for ${domain}`, {
    ssl: ssl.valid,
    dns: dnsInfo.resolves,
    redirects: redirectCount,
    keywords: foundKeywords.length,
    virusTotal: virusTotal ? `${virusTotal.malicious} malicious` : "not checked",
    whoisAge: whois?.domainAgeDays ?? "unknown",
  });

  return {
    url: originalUrl,
    domain,
    suspiciousKeywords: foundKeywords,
    subdomainDepth: validation.subdomainDepth,
    isIPBased: validation.isIPBased,
    isShortened: validation.isShortened,
    hasEncodedChars: validation.hasEncodedChars,
    urlLength: originalUrl.length,
    hasHttps: validation.protocol === "https",
    suspiciousTLD: SUSPICIOUS_TLDS.has(tld.toLowerCase()),
    redirectCount,
    finalUrl,
    ssl,
    dns: dnsInfo,
    virusTotal,
    whois,
  };
}
