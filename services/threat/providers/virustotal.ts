// =============================================================================
// CyberPhish Guardian — VirusTotal Provider Stub
// Fill in VIRUSTOTAL_API_KEY in .env.local to activate
// =============================================================================

import type { VirusTotalResult } from "@/lib/types";
import { config } from "@/lib/config/env";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("VirusTotal");
const VIRUSTOTAL_API = "https://www.virustotal.com/api/v3";

// ---------------------------------------------------------------------------
// Look up a URL against the VirusTotal database
// ---------------------------------------------------------------------------

export async function checkVirusTotal(url: string): Promise<VirusTotalResult | null> {
  if (!config.threatIntel.hasVirusTotal) {
    logger.debug("VirusTotal API key not configured — skipping");
    return null;
  }

  try {
    // Encode URL for VT API (base64url without padding)
    const encodedUrl = Buffer.from(url).toString("base64url");

    const response = await fetch(`${VIRUSTOTAL_API}/urls/${encodedUrl}`, {
      headers: {
        "x-apikey": config.threatIntel.virusTotalApiKey,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (response.status === 404) {
      // URL not found in VT database — submit for analysis
      logger.info("URL not in VT database, submitting for analysis...");
      return await submitAndWait(url);
    }

    if (!response.ok) {
      logger.warn(`VirusTotal API returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    const stats = data?.data?.attributes?.last_analysis_stats;

    if (!stats) return null;

    return {
      malicious: stats.malicious ?? 0,
      suspicious: stats.suspicious ?? 0,
      harmless: stats.harmless ?? 0,
      undetected: stats.undetected ?? 0,
      permalink: `https://www.virustotal.com/gui/url/${encodedUrl}`,
    };
  } catch (err) {
    logger.error("VirusTotal check failed", err);
    return null;
  }
}

// Submit URL for scanning and return basic result
async function submitAndWait(url: string): Promise<VirusTotalResult | null> {
  try {
    const formData = new FormData();
    formData.append("url", url);

    const submitRes = await fetch(`${VIRUSTOTAL_API}/urls`, {
      method: "POST",
      headers: { "x-apikey": config.threatIntel.virusTotalApiKey },
      body: formData,
      signal: AbortSignal.timeout(10000),
    });

    if (!submitRes.ok) return null;

    // Return placeholder — scan results take a moment to be available
    return {
      malicious: 0,
      suspicious: 0,
      harmless: 0,
      undetected: 0,
      permalink: null,
    };
  } catch {
    return null;
  }
}
