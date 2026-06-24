// =============================================================================
// CyberPhish Guardian — Risk Scoring Rules
// Each rule is a pure function that checks one threat signal
// =============================================================================

import type { ScoringRule } from "@/lib/types";

// ---------------------------------------------------------------------------
// Rule definitions — ordered from highest to lowest weight
// ---------------------------------------------------------------------------

export const SCORING_RULES: ScoringRule[] = [
  // ---- Reputation (external provider signals) --------------------------------

  {
    id: "VT_MALICIOUS",
    name: "VirusTotal: Malicious Detections",
    description: "Multiple security vendors flagged this URL as malicious.",
    weight: 40,
    category: "Reputation",
    check: (intel) =>
      intel.virusTotal !== null && intel.virusTotal.malicious >= 3,
  },
  {
    id: "VT_SUSPICIOUS",
    name: "VirusTotal: Suspicious Detections",
    description: "One or more security vendors flagged this URL as suspicious.",
    weight: 20,
    category: "Reputation",
    check: (intel) =>
      intel.virusTotal !== null &&
      intel.virusTotal.malicious >= 1 &&
      intel.virusTotal.malicious < 3,
  },

  // ---- SSL ------------------------------------------------------------------

  {
    id: "SSL_INVALID",
    name: "Invalid SSL Certificate",
    description: "The SSL certificate is invalid, expired, or not trusted.",
    weight: 20,
    category: "SSL",
    check: (intel) => !intel.ssl.valid && !intel.hasHttps === false,
  },
  {
    id: "SSL_SELF_SIGNED",
    name: "Self-Signed SSL Certificate",
    description: "The SSL certificate is self-signed, which is not trusted by browsers.",
    weight: 15,
    category: "SSL",
    check: (intel) => intel.ssl.selfSigned,
  },
  {
    id: "SSL_EXPIRING_SOON",
    name: "SSL Certificate Expiring Soon",
    description: "SSL certificate expires within 14 days.",
    weight: 8,
    category: "SSL",
    check: (intel) =>
      intel.ssl.daysUntilExpiry !== null &&
      intel.ssl.daysUntilExpiry > 0 &&
      intel.ssl.daysUntilExpiry <= 14,
  },
  {
    id: "NO_HTTPS",
    name: "No HTTPS Encryption",
    description: "The URL uses HTTP instead of HTTPS, meaning data is transmitted unencrypted.",
    weight: 18,
    category: "SSL",
    check: (intel) => !intel.hasHttps,
  },

  // ---- Domain ---------------------------------------------------------------

  {
    id: "NEW_DOMAIN",
    name: "Recently Registered Domain",
    description: "Domain was registered within the last 30 days — a common phishing pattern.",
    weight: 25,
    category: "Domain",
    check: (intel) => intel.whois?.isNewDomain === true,
  },
  {
    id: "DOMAIN_AGE_YOUNG",
    name: "Young Domain",
    description: "Domain is less than 6 months old.",
    weight: 12,
    category: "Domain",
    check: (intel) =>
      intel.whois !== null &&
      intel.whois.domainAgeDays !== null &&
      intel.whois.domainAgeDays !== undefined &&
      intel.whois.domainAgeDays < 180,
  },
  {
    id: "DNS_NO_RESOLVE",
    name: "Domain Does Not Resolve",
    description: "The domain has no DNS A record and cannot be reached.",
    weight: 30,
    category: "DNS",
    check: (intel) => !intel.dns.resolves,
  },
  {
    id: "NO_MX_RECORD",
    name: "No Mail Server (MX Record)",
    description: "Domain has no MX record — unusual for legitimate organizations.",
    weight: 5,
    category: "DNS",
    check: (intel) => !intel.dns.hasMX,
  },
  {
    id: "NO_SPF_DMARC",
    name: "No Email Authentication (SPF/DMARC)",
    description: "Domain lacks SPF and DMARC records — poor email security posture.",
    weight: 5,
    category: "DNS",
    check: (intel) => !intel.dns.hasSPF && !intel.dns.hasDMARC,
  },
  {
    id: "SUSPICIOUS_TLD",
    name: "Suspicious Top-Level Domain",
    description: "The TLD is frequently abused in phishing campaigns (e.g. .xyz, .tk, .ml).",
    weight: 15,
    category: "Domain",
    check: (intel) => intel.suspiciousTLD,
  },

  // ---- URL Patterns --------------------------------------------------------

  {
    id: "IP_BASED_URL",
    name: "IP Address in URL",
    description: "URL uses a numeric IP address instead of a domain name.",
    weight: 20,
    category: "URL",
    check: (intel) => intel.isIPBased,
  },
  {
    id: "URL_SHORTENER",
    name: "URL Shortener Detected",
    description: "URL uses a shortening service that hides the final destination.",
    weight: 15,
    category: "URL",
    check: (intel) => intel.isShortened,
  },
  {
    id: "EXCESSIVE_SUBDOMAINS",
    name: "Excessive Subdomains",
    description: "URL has more than 3 subdomain levels — often used to obscure phishing domains.",
    weight: 15,
    category: "URL",
    check: (intel) => intel.subdomainDepth > 3,
  },
  {
    id: "ENCODED_CHARS",
    name: "Obfuscated / Encoded Characters",
    description: "URL contains percent-encoded characters often used to bypass filters.",
    weight: 12,
    category: "Pattern",
    check: (intel) => intel.hasEncodedChars,
  },
  {
    id: "LONG_URL",
    name: "Unusually Long URL",
    description: "URL is excessively long (> 200 chars), often used to hide the true destination.",
    weight: 8,
    category: "URL",
    check: (intel) => intel.urlLength > 200,
  },

  // ---- Keywords / Phishing Patterns ----------------------------------------

  {
    id: "PHISHING_KEYWORDS_MANY",
    name: "Multiple Phishing Keywords",
    description: "URL contains 3 or more keywords commonly found in phishing attacks.",
    weight: 20,
    category: "Pattern",
    check: (intel) => intel.suspiciousKeywords.length >= 3,
  },
  {
    id: "PHISHING_KEYWORDS_FEW",
    name: "Phishing Keywords Detected",
    description: "URL contains keywords commonly used in phishing or social engineering attacks.",
    weight: 10,
    category: "Pattern",
    check: (intel) =>
      intel.suspiciousKeywords.length >= 1 && intel.suspiciousKeywords.length < 3,
  },

  // ---- Redirects -----------------------------------------------------------

  {
    id: "REDIRECT_CHAIN",
    name: "Redirect Chain Detected",
    description: "URL redirects through multiple destinations — may be hiding the final endpoint.",
    weight: 12,
    category: "Redirect",
    check: (intel) => intel.redirectCount >= 2,
  },
];
