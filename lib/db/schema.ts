import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, numeric, pgEnum, date, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const threatLevelEnum = pgEnum("threat_level", [
  "safe",
  "suspicious",
  "high_risk",
  "dangerous",
]);

// ---------------------------------------------------------------------------
// Scans Table
// ---------------------------------------------------------------------------

export const scans = pgTable(
  "scans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    normalizedUrl: text("normalized_url").notNull(),
    domain: text("domain").notNull(),

    // Risk assessment
    riskScore: integer("risk_score").notNull().default(0),
    threatLevel: threatLevelEnum("threat_level").notNull().default("safe"),
    phishingProbability: numeric("phishing_probability", { precision: 5, scale: 4 })
      .notNull()
      .default("0"),

    // SSL info
    sslValid: boolean("ssl_valid").notNull().default(false),
    sslIssuer: text("ssl_issuer"),
    sslExpiry: timestamp("ssl_expiry", { withTimezone: true }),

    // Domain info
    domainAgeDays: integer("domain_age_days"),

    // Redirect info
    redirectCount: integer("redirect_count").notNull().default(0),

    // Structured analysis data (JSONB)
    threatIndicators: jsonb("threat_indicators").notNull().default([]),
    scoringFactors: jsonb("scoring_factors").notNull().default([]),

    // AI generated content
    aiSummary: text("ai_summary"),
    recommendations: jsonb("recommendations").notNull().default([]),

    // Scan metadata
    scanDurationMs: integer("scan_duration_ms").notNull().default(0),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    domainIdx: index("scans_domain_idx").on(table.domain),
    threatLevelIdx: index("scans_threat_level_idx").on(table.threatLevel),
    createdAtIdx: index("scans_created_at_idx").on(table.createdAt),
    riskScoreIdx: index("scans_risk_score_idx").on(table.riskScore),
  })
);

// ---------------------------------------------------------------------------
// Reports Table
// ---------------------------------------------------------------------------

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scanId: uuid("scan_id")
      .notNull()
      .references(() => scans.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    executiveSummary: text("executive_summary").notNull(),

    // Structured report data
    technicalFindings: jsonb("technical_findings").notNull().default({}),
    fullReport: jsonb("full_report").notNull().default({}),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    scanIdIdx: index("reports_scan_id_idx").on(table.scanId),
    createdAtIdx: index("reports_created_at_idx").on(table.createdAt),
  })
);

// ---------------------------------------------------------------------------
// Analytics Table (daily aggregates)
// ---------------------------------------------------------------------------

export const analytics = pgTable(
  "analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    date: date("date").notNull().unique(),

    totalScans: integer("total_scans").notNull().default(0),
    threatsDetected: integer("threats_detected").notNull().default(0),
    safeUrls: integer("safe_urls").notNull().default(0),
    avgRiskScore: numeric("avg_risk_score", { precision: 5, scale: 2 })
      .notNull()
      .default("0"),

    // Breakdown by threat level
    dangerousCount: integer("dangerous_count").notNull().default(0),
    highRiskCount: integer("high_risk_count").notNull().default(0),
    suspiciousCount: integer("suspicious_count").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    dateIdx: index("analytics_date_idx").on(table.date),
  })
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const scansRelations = relations(scans, ({ many }) => ({
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  scan: one(scans, {
    fields: [reports.scanId],
    references: [scans.id],
  }),
}));

// ---------------------------------------------------------------------------
// Type exports (inferred from schema)
// ---------------------------------------------------------------------------

export type DbScan = typeof scans.$inferSelect;
export type DbScanInsert = typeof scans.$inferInsert;
export type DbReport = typeof reports.$inferSelect;
export type DbReportInsert = typeof reports.$inferInsert;
export type DbAnalytics = typeof analytics.$inferSelect;
export type DbAnalyticsInsert = typeof analytics.$inferInsert;
