// =============================================================================
// CyberPhish Guardian — SSL Certificate Analyzer
// Uses Node.js built-in tls module (works in Vercel serverless)
// =============================================================================

import * as tls from "tls";
import type { SSLInfo } from "@/lib/types";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("SSLAnalyzer");

const SSL_TIMEOUT_MS = 8000;

// ---------------------------------------------------------------------------
// Analyze SSL certificate for a hostname
// ---------------------------------------------------------------------------

export async function analyzeSSL(hostname: string, port: number = 443): Promise<SSLInfo> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      logger.warn(`SSL analysis timed out for ${hostname}`);
      resolve({
        valid: false,
        issuer: null,
        subject: null,
        validFrom: null,
        validTo: null,
        daysUntilExpiry: null,
        selfSigned: false,
        error: "Connection timed out",
      });
    }, SSL_TIMEOUT_MS);

    try {
      const socket = tls.connect(
        {
          host: hostname,
          port,
          servername: hostname,
          rejectUnauthorized: false, // We'll check validity manually
          timeout: SSL_TIMEOUT_MS,
        },
        () => {
          clearTimeout(timeout);

          try {
            const cert = socket.getPeerCertificate(true);

            if (!cert || Object.keys(cert).length === 0) {
              socket.destroy();
              resolve({
                valid: false,
                issuer: null,
                subject: null,
                validFrom: null,
                validTo: null,
                daysUntilExpiry: null,
                selfSigned: false,
                error: "No certificate returned",
              });
              return;
            }

            const authorized = socket.authorized;
            const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
            const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
            const now = new Date();

            const daysUntilExpiry = validTo
              ? Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              : null;

            // Self-signed check — issuer matches subject
            const issuerCN = cert.issuer?.CN
              ? (Array.isArray(cert.issuer.CN) ? cert.issuer.CN[0] : cert.issuer.CN)
              : null;
            const subjectCNRaw = cert.subject?.CN ?? null;
            const subjectCN: string | null = Array.isArray(subjectCNRaw)
              ? subjectCNRaw[0] ?? null
              : subjectCNRaw;
            const selfSigned =
              !!issuerCN && !!subjectCN && issuerCN === subjectCN;

            const issuerStr = cert.issuer
              ? Object.entries(cert.issuer)
                  .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(",") : v}`)
                  .join(", ")
              : null;

            socket.destroy();

            resolve({
              valid: authorized && !selfSigned && daysUntilExpiry !== null && daysUntilExpiry > 0,
              issuer: issuerStr,
              subject: subjectCN,
              validFrom,
              validTo,
              daysUntilExpiry,
              selfSigned,
              error: authorized ? null : (socket.authorizationError instanceof Error ? socket.authorizationError.message : String(socket.authorizationError ?? "Certificate not authorized")),
            });
          } catch (err) {
            socket.destroy();
            logger.error(`SSL cert parsing error for ${hostname}`, err);
            resolve({
              valid: false,
              issuer: null,
              subject: null,
              validFrom: null,
              validTo: null,
              daysUntilExpiry: null,
              selfSigned: false,
              error: err instanceof Error ? err.message : "Certificate parse error",
            });
          }
        }
      );

      socket.on("error", (err) => {
        clearTimeout(timeout);
        logger.warn(`SSL socket error for ${hostname}: ${err.message}`);
        resolve({
          valid: false,
          issuer: null,
          subject: null,
          validFrom: null,
          validTo: null,
          daysUntilExpiry: null,
          selfSigned: false,
          error: err.message,
        });
      });
    } catch (err) {
      clearTimeout(timeout);
      logger.error(`SSL analysis threw for ${hostname}`, err);
      resolve({
        valid: false,
        issuer: null,
        subject: null,
        validFrom: null,
        validTo: null,
        daysUntilExpiry: null,
        selfSigned: false,
        error: err instanceof Error ? err.message : "SSL analysis failed",
      });
    }
  });
}
