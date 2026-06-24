// =============================================================================
// CyberPhish Guardian — DNS Analysis
// Uses Node.js built-in dns/promises module
// =============================================================================

import { promises as dns } from "dns";
import type { DNSInfo } from "@/lib/types";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("DNSAnalyzer");

// ---------------------------------------------------------------------------
// Analyze DNS records for a hostname
// ---------------------------------------------------------------------------

export async function analyzeDNS(hostname: string): Promise<DNSInfo> {
  const result: DNSInfo = {
    resolves: false,
    ipAddresses: [],
    hasIPv6: false,
    hasMX: false,
    hasSPF: false,
    hasDMARC: false,
    error: null,
  };

  try {
    // Parallel DNS lookups
    const [aRecords, aaaaRecords, mxRecords, txtRecords, dmarcTxtRecords] =
      await Promise.allSettled([
        dns.resolve4(hostname).catch(() => [] as string[]),
        dns.resolve6(hostname).catch(() => [] as string[]),
        dns.resolveMx(hostname).catch(() => [] as { exchange: string; priority: number }[]),
        dns.resolveTxt(hostname).catch(() => [] as string[][]),
        dns.resolveTxt(`_dmarc.${hostname}`).catch(() => [] as string[][]),
      ]);

    // IPv4 addresses
    if (aRecords.status === "fulfilled") {
      result.ipAddresses.push(...(aRecords.value as string[]));
      if ((aRecords.value as string[]).length > 0) {
        result.resolves = true;
      }
    }

    // IPv6 addresses
    if (aaaaRecords.status === "fulfilled" && (aaaaRecords.value as string[]).length > 0) {
      result.hasIPv6 = true;
      result.resolves = true;
    }

    // MX records (mail server presence)
    if (mxRecords.status === "fulfilled" && (mxRecords.value as { exchange: string; priority: number }[]).length > 0) {
      result.hasMX = true;
    }

    // SPF record (TXT containing "v=spf1")
    if (txtRecords.status === "fulfilled") {
      const allTxt = (txtRecords.value as string[][]).flat().join(" ").toLowerCase();
      result.hasSPF = allTxt.includes("v=spf1");
    }

    // DMARC record
    if (dmarcTxtRecords.status === "fulfilled") {
      const dmarcTxt = (dmarcTxtRecords.value as string[][]).flat().join(" ").toLowerCase();
      result.hasDMARC = dmarcTxt.includes("v=dmarc1");
    }

    if (!result.resolves) {
      result.error = "Domain does not resolve to any IP address";
    }
  } catch (err) {
    logger.error(`DNS analysis failed for ${hostname}`, err);
    result.error = err instanceof Error ? err.message : "DNS lookup failed";
  }

  return result;
}
