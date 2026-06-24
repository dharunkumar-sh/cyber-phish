// =============================================================================
// CyberPhish Guardian — Central TypeScript Types
// =============================================================================

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type ThreatLevel = "safe" | "suspicious" | "high_risk" | "dangerous";

export type ScanStatus = "pending" | "processing" | "complete" | "failed";

export type IndicatorCategory =
  | "ssl"
  | "domain"
  | "url_pattern"
  | "reputation"
  | "dns"
  | "redirect"
  | "keyword";

export type RuleCategory =
  | "SSL"
  | "Domain"
  | "URL"
  | "Reputation"
  | "Pattern"
  | "DNS"
  | "Redirect";

// ---------------------------------------------------------------------------
// Threat Indicators
// ---------------------------------------------------------------------------

export interface ThreatIndicator {
  id: string;
  category: IndicatorCategory;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  evidence?: string;
}

// ---------------------------------------------------------------------------
// SSL Analysis
// ---------------------------------------------------------------------------

export interface SSLInfo {
  valid: boolean;
  issuer: string | null;
  subject: string | null;
  validFrom: Date | null;
  validTo: Date | null;
  daysUntilExpiry: number | null;
  selfSigned: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// DNS Analysis
// ---------------------------------------------------------------------------

export interface DNSInfo {
  resolves: boolean;
  ipAddresses: string[];
  hasIPv6: boolean;
  hasMX: boolean;
  hasSPF: boolean;
  hasDMARC: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// URL Validation
// ---------------------------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  normalizedUrl: string | null;
  domain: string | null;
  subdomain: string | null;
  tld: string | null;
  protocol: string | null;
  isIPBased: boolean;
  isShortened: boolean;
  hasEncodedChars: boolean;
  subdomainDepth: number;
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Threat Intelligence
// ---------------------------------------------------------------------------

export interface ThreatIntelligence {
  url: string;
  domain: string;
  // Built-in checks
  suspiciousKeywords: string[];
  subdomainDepth: number;
  isIPBased: boolean;
  isShortened: boolean;
  hasEncodedChars: boolean;
  urlLength: number;
  hasHttps: boolean;
  suspiciousTLD: boolean;
  redirectCount: number;
  finalUrl: string | null;
  // SSL
  ssl: SSLInfo;
  // DNS
  dns: DNSInfo;
  // External providers (null if key not configured)
  virusTotal: VirusTotalResult | null;
  whois: WhoisResult | null;
}

// Provider result types
export interface VirusTotalResult {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  permalink: string | null;
}

export interface WhoisResult {
  createdDate: Date | null;
  updatedDate: Date | null;
  expiresDate: Date | null;
  registrar: string | null;
  domainAgeDays: number | null;
  isNewDomain: boolean;
}

// ---------------------------------------------------------------------------
// Risk Scoring
// ---------------------------------------------------------------------------

export interface ScoringRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  category: RuleCategory;
  check: (intel: ThreatIntelligence) => boolean;
}

export interface TriggeredRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  category: RuleCategory;
}

export interface RiskResult {
  score: number; // 0–100
  level: ThreatLevel;
  triggeredRules: TriggeredRule[];
  totalRulesChecked: number;
  indicators: ThreatIndicator[];
  recommendations: string[];
}

// ---------------------------------------------------------------------------
// AI Explanation
// ---------------------------------------------------------------------------

export interface AIExplanation {
  summary: string;
  generated: boolean;
  model: string | null;
  tokensUsed: number | null;
  fallback: boolean;
}

// ---------------------------------------------------------------------------
// Scan Records (matches DB schema)
// ---------------------------------------------------------------------------

export interface ScanRecord {
  id: string;
  url: string;
  normalizedUrl: string;
  domain: string;
  riskScore: number;
  threatLevel: ThreatLevel;
  phishingProbability: number;
  sslValid: boolean;
  sslIssuer: string | null;
  sslExpiry: Date | null;
  domainAgeDays: number | null;
  redirectCount: number;
  threatIndicators: ThreatIndicator[];
  scoringFactors: TriggeredRule[];
  aiSummary: string | null;
  recommendations: string[];
  scanDurationMs: number;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Report Records
// ---------------------------------------------------------------------------

export interface ExecutiveSummary {
  verdict: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  keyFindings: string[];
  immediateAction: string;
}

export interface TechnicalFindings {
  ssl: SSLInfo;
  dns: DNSInfo;
  urlAnalysis: {
    isIPBased: boolean;
    isShortened: boolean;
    subdomainDepth: number;
    hasEncodedChars: boolean;
    redirectCount: number;
    finalUrl: string | null;
  };
  externalReputation: {
    virusTotal: VirusTotalResult | null;
  };
}

export interface CyberReport {
  id: string;
  scanId: string;
  title: string;
  generatedAt: Date;
  executiveSummary: ExecutiveSummary;
  threatClassification: {
    level: ThreatLevel;
    label: string;
    color: string;
    description: string;
  };
  riskScore: number;
  riskBreakdown: TriggeredRule[];
  detectedIndicators: ThreatIndicator[];
  technicalFindings: TechnicalFindings;
  recommendations: string[];
  aiExplanation: AIExplanation;
  metadata: {
    scanDurationMs: number;
    analyzedUrl: string;
    normalizedUrl: string;
    domain: string;
    timestamp: Date;
  };
}

export interface ReportRecord {
  id: string;
  scanId: string;
  title: string;
  executiveSummary: string;
  technicalFindings: TechnicalFindings;
  fullReport: CyberReport;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface AnalyticsRecord {
  id: string;
  date: string;
  totalScans: number;
  threatsDetected: number;
  safeUrls: number;
  avgRiskScore: number;
  dangerousCount: number;
  highRiskCount: number;
  suspiciousCount: number;
  createdAt: Date;
}

export interface AnalyticsSummary {
  totalScans: number;
  threatsDetected: number;
  safeUrls: number;
  avgRiskScore: number;
  threatLevelDistribution: {
    safe: number;
    suspicious: number;
    high_risk: number;
    dangerous: number;
  };
  recentTrend: AnalyticsRecord[];
}

// ---------------------------------------------------------------------------
// API Request / Response
// ---------------------------------------------------------------------------

export interface AnalyzeRequest {
  url: string;
}

export interface ScanResult {
  scan: ScanRecord;
  report: ReportRecord;
  intelligence: ThreatIntelligence;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ---------------------------------------------------------------------------
// Query Params
// ---------------------------------------------------------------------------

export interface ScanHistoryQuery {
  page?: number;
  limit?: number;
  threatLevel?: ThreatLevel;
  search?: string;
  sort?: "created_at" | "risk_score";
  order?: "asc" | "desc";
}

export interface RequestMeta {
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string;
}
