// =============================================================================
// CyberPhish Guardian — WHOIS Provider Stub
// Uses RDAP (Registration Data Access Protocol) — no API key required
// RDAP is the modern, open replacement for WHOIS
// =============================================================================

import type { WhoisResult } from "@/lib/types";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("WHOIS");

// ---------------------------------------------------------------------------
// Fetch domain registration data via RDAP
// ---------------------------------------------------------------------------

export async function checkWhois(domain: string): Promise<WhoisResult | null> {
  try {
    // Use IANA RDAP bootstrap to find the right registry
    const rdapUrl = `https://rdap.org/domain/${domain}`;

    const response = await fetch(rdapUrl, {
      headers: { Accept: "application/rdap+json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      logger.debug(`RDAP lookup returned ${response.status} for ${domain}`);
      return null;
    }

    const data = await response.json();

    // Parse events array for creation/expiration dates
    const events: Array<{ eventAction: string; eventDate: string }> =
      data?.events ?? [];

    const createdEvent = events.find((e) => e.eventAction === "registration");
    const updatedEvent = events.find((e) => e.eventAction === "last changed");
    const expiresEvent = events.find((e) => e.eventAction === "expiration");

    const createdDate = createdEvent ? new Date(createdEvent.eventDate) : null;
    const updatedDate = updatedEvent ? new Date(updatedEvent.eventDate) : null;
    const expiresDate = expiresEvent ? new Date(expiresEvent.eventDate) : null;

    const now = new Date();
    const domainAgeDays = createdDate
      ? Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Domain is considered "new" if registered within the last 30 days
    const isNewDomain = domainAgeDays !== null && domainAgeDays < 30;

    // Registrar info
    const registrar =
      data?.entities
        ?.find((e: { roles?: string[] }) => e.roles?.includes("registrar"))
        ?.vcardArray?.[1]
        ?.find((v: string[]) => v[0] === "fn")?.[3] ?? null;

    return {
      createdDate,
      updatedDate,
      expiresDate,
      registrar,
      domainAgeDays,
      isNewDomain,
    };
  } catch (err) {
    logger.warn(`WHOIS/RDAP lookup failed for ${domain}`, err);
    return null;
  }
}
