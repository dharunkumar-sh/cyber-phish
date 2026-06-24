// =============================================================================
// CyberPhish Guardian — Professional B&W PDF Report (jsPDF)
// Single-page, clean black-and-white, no icons or emojis
// =============================================================================

import { jsPDF } from "jspdf";

type RGB = [number, number, number];

// ─── Monochrome Palette ───────────────────────────────────────────────────────
const BK: RGB   = [0,   0,   0  ];  // pure black
const WH: RGB   = [255, 255, 255];  // pure white
const G1: RGB   = [30,  30,  30 ];  // near-black (headings)
const G2: RGB   = [80,  80,  80 ];  // dark grey (body)
const G3: RGB   = [130, 130, 130];  // mid grey (labels / secondary)
const G4: RGB   = [200, 200, 200];  // light grey (borders / lines)
const G5: RGB   = [240, 240, 240];  // near-white (card backgrounds)

// ─── Page constants ───────────────────────────────────────────────────────────
const PW  = 210;          // A4 width  mm
const PH  = 297;          // A4 height mm
const ML  = 18;           // left margin
const MR  = 18;           // right margin
const CW  = PW - ML - MR; // usable content width

// ─── Low-level helpers ────────────────────────────────────────────────────────

function fill(doc: jsPDF, x: number, y: number, w: number, h: number, color: RGB) {
  doc.setFillColor(...color);
  doc.rect(x, y, w, h, "F");
}

function stroke(doc: jsPDF, x: number, y: number, w: number, h: number, color: RGB, lw = 0.3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(lw);
  doc.rect(x, y, w, h, "S");
}

function hline(doc: jsPDF, y: number, color: RGB = G4, lw = 0.3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(lw);
  doc.line(ML, y, PW - MR, y);
}

function txt(
  doc: jsPDF,
  str: string,
  x: number,
  y: number,
  color: RGB,
  size: number,
  style: "normal" | "bold" | "italic" = "normal",
  align: "left" | "center" | "right" = "left"
) {
  doc.setTextColor(...color);
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
  doc.text(str, x, y, { align });
}

// ─── Threat verdict helpers ────────────────────────────────────────────────────

function verdictLabel(level: string): string {
  switch (level) {
    case "dangerous":  return "DANGEROUS";
    case "high_risk":  return "HIGH RISK";
    case "suspicious": return "SUSPICIOUS";
    default:           return "SAFE";
  }
}

function sevLabel(sev: string): string {
  return (sev || "low").toUpperCase();
}

// ─── Section heading ──────────────────────────────────────────────────────────

function sectionHead(doc: jsPDF, label: string, y: number): number {
  fill(doc, ML, y, CW, 6.5, G1);
  txt(doc, label.toUpperCase(), ML + 4, y + 4.5, WH, 7.5, "bold");
  return y + 8;
}

// ─── Two-column KV table helper ───────────────────────────────────────────────

function kvTable(
  doc: jsPDF,
  rows: [string, string][],
  x: number,
  y: number,
  colW: number,
  rowH = 5.5
): number {
  const labelW = 40;
  rows.forEach(([k, v], i) => {
    const ry = y + i * rowH;
    if (i % 2 === 0) {
      fill(doc, x, ry - 1, colW, rowH, G5);
    }
    txt(doc, k, x + 2, ry + 3, G3, 7.5, "bold");
    txt(doc, v || "—", x + labelW, ry + 3, G1, 7.5, "normal");
  });
  stroke(doc, x, y - 1, colW, rows.length * rowH, G4);
  return y + rows.length * rowH;
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

export async function exportToPDF(
  scan: Record<string, any>,
  report: Record<string, any>
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // ── Extract data ─────────────────────────────────────────────────────────────
  const full      = report?.fullReport     || {};
  const exec      = full?.executiveSummary || {};
  const tech      = full?.technicalFindings || {};
  const ssl       = tech?.ssl              || {};
  const dns       = tech?.dns              || {};
  const vt        = tech?.externalReputation?.virusTotal;
  const indicators: any[]   = full?.detectedIndicators  || scan?.threatIndicators || [];
  const recs: string[]      = full?.recommendations      || scan?.recommendations  || [];
  const aiText: string      = full?.aiExplanation?.summary || scan?.aiSummary || "";

  const level     = scan?.threatLevel || "safe";
  const riskScore = Number(scan?.riskScore ?? 0);
  const domain    = scan?.domain || "—";
  const url       = scan?.url   || "—";
  const phishProb = Math.round(parseFloat(scan?.phishingProbability || "0") * 100);
  const reportId  = (report?.id || "").substring(0, 20).toUpperCase();
  const scanDate  = new Date(report?.createdAt || Date.now()).toLocaleString();

  // ============================================================================
  // WHITE PAGE BACKGROUND
  // ============================================================================
  fill(doc, 0, 0, PW, PH, WH);

  let y = 0;

  // ============================================================================
  // HEADER BLOCK
  // ============================================================================
  fill(doc, 0, 0, PW, 26, G1);

  // Organisation / product name
  txt(doc, "CyberPhish", ML, 11, WH, 16, "bold");
  txt(doc, "Threat Analysis Report  |  Confidential", ML, 18, G3, 8, "normal");

  // Report meta — right side
  txt(doc, `Report ID: ${reportId}`,   PW - MR, 9,  G3, 7, "normal", "right");
  txt(doc, `Generated: ${scanDate}`,   PW - MR, 14, G3, 7, "normal", "right");
  txt(doc, `Duration: ${scan?.scanDurationMs ? (scan.scanDurationMs / 1000).toFixed(2) + "s" : "—"}`,
                                       PW - MR, 19, G3, 7, "normal", "right");

  y = 30;

  // ============================================================================
  // VERDICT SUMMARY STRIP
  // ============================================================================
  fill(doc, ML, y, CW, 20, G5);
  stroke(doc, ML, y, CW, 20, G4, 0.3);

  // Risk score box — left
  fill(doc, ML, y, 28, 20, G1);
  txt(doc, `${riskScore}`, ML + 14, y + 9.5, WH, 18, "bold", "center");
  txt(doc, "RISK SCORE", ML + 14, y + 15.5, G3, 5.5, "bold", "center");
  txt(doc, "/ 100", ML + 14, y + 18.5, G4, 5.5, "normal", "center");

  // Verdict label — next to score
  txt(doc, verdictLabel(level), ML + 36, y + 10, G1, 14, "bold");
  txt(doc, `Phishing Probability: ${phishProb}%`, ML + 36, y + 16, G2, 8, "normal");

  // Domain — right side
  txt(doc, domain, PW - MR, y + 9,  G1, 11, "bold",   "right");
  txt(doc, url.length > 60 ? url.substring(0, 57) + "..." : url,
           PW - MR, y + 15, G3, 6.5, "normal", "right");

  y += 24;

  // ============================================================================
  // SECTION 1 — TARGET INFORMATION  |  SSL & NETWORK (two-column table)
  // ============================================================================
  y = sectionHead(doc, "Target Information & Network Details", y);

  const halfCW = (CW - 4) / 2;
  const leftX  = ML;
  const rightX = ML + halfCW + 4;

  // Left: Target details
  const targetRows: [string, string][] = [
    ["Domain",       domain],
    ["URL",          url.length > 32 ? url.substring(0, 29) + "..." : url],
    ["IP Address",   dns?.ipAddresses?.join(", ") || "—"],
    ["Domain Age",   scan?.domainAgeDays != null ? `${scan.domainAgeDays} days` : "Unknown"],
    ["Redirects",    `${scan?.redirectCount ?? 0}`],
  ];

  // Right: SSL + DNS details
  const netRows: [string, string][] = [
    ["SSL Valid",    ssl?.valid      ? "Valid"   : "Invalid"],
    ["Self-Signed",  ssl?.selfSigned ? "Yes"     : "No"],
    ["Days to Exp.", ssl?.daysUntilExpiry != null ? `${ssl.daysUntilExpiry} days` : "—"],
    ["DNS Resolves", dns?.resolves   ? "Yes"     : "No"],
    ["SPF Record",   dns?.hasSPF    ? "Present" : "Missing"],
  ];

  kvTable(doc, targetRows, leftX,  y, halfCW);
  kvTable(doc, netRows,    rightX, y, halfCW);

  y += targetRows.length * 5.5 + 4;

  // ============================================================================
  // SECTION 2 — VIRUSTOTAL INTELLIGENCE (compact row)
  // ============================================================================
  y = sectionHead(doc, "VirusTotal Intelligence", y);

  if (vt) {
    const vtCols = [
      { label: "Malicious",  val: vt.malicious  ?? 0 },
      { label: "Suspicious", val: vt.suspicious ?? 0 },
      { label: "Harmless",   val: vt.harmless   ?? 0 },
      { label: "Undetected", val: vt.undetected ?? 0 },
      { label: "Timeout",    val: vt.timeout    ?? 0 },
    ];
    const cw = CW / vtCols.length;
    vtCols.forEach(({ label, val }, i) => {
      const cx = ML + cw * i;
      fill(doc, cx, y, cw - 1, 14, G5);
      stroke(doc, cx, y, cw - 1, 14, G4);
      txt(doc, `${val}`, cx + (cw - 1) / 2, y + 7,  G1, 13, "bold",   "center");
      txt(doc, label,    cx + (cw - 1) / 2, y + 12, G3, 6,  "normal", "center");
    });
    y += 18;
  } else {
    txt(doc, "VirusTotal data not available for this scan.", ML, y + 5, G3, 8, "italic");
    y += 10;
  }

  // ============================================================================
  // SECTION 3 — KEY FINDINGS & IMMEDIATE ACTION (two-column)
  // ============================================================================
  const findings: string[] = exec?.keyFindings || [];
  const action: string     = exec?.immediateAction || "";

  if (findings.length > 0 || action) {
    y = sectionHead(doc, "Key Findings & Recommended Action", y);

    const leftFindings = findings.slice(0, 5);
    const findingRowH  = 5.5;
    const findingsH    = leftFindings.length * findingRowH + 2;
    const actionH      = action ? 14 : 0;
    const blockH       = Math.max(findingsH, actionH);

    // Left — findings list
    fill(doc, leftX, y, halfCW, blockH, G5);
    stroke(doc, leftX, y, halfCW, blockH, G4);
    leftFindings.forEach((f, i) => {
      const row = y + 2 + i * findingRowH;
      fill(doc, leftX + 2, row + 1, 1.5, 3.5, G1);
      txt(
        doc,
        f.length > 48 ? f.substring(0, 45) + "..." : f,
        leftX + 7, row + 4, G1, 7, "normal"
      );
    });

    // Right — immediate action
    if (action) {
      fill(doc, rightX, y, halfCW, blockH, G5);
      stroke(doc, rightX, y, halfCW, blockH, G4);
      fill(doc, rightX, y, 3, blockH, G1);
      txt(doc, "IMMEDIATE ACTION", rightX + 6, y + 5.5, G2, 6.5, "bold");
      const wrapped = doc.splitTextToSize(action, halfCW - 10);
      doc.setTextColor(...G1);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      wrapped.slice(0, 4).forEach((ln: string, i: number) => {
        doc.text(ln, rightX + 6, y + 10 + i * 4);
      });
    }

    y += blockH + 4;
  }

  // ============================================================================
  // SECTION 4 — THREAT INDICATORS
  // ============================================================================
  if (indicators.length > 0) {
    y = sectionHead(doc, `Threat Indicators  (${indicators.length} triggered)`, y);

    // Table header row
    fill(doc, ML, y, CW, 5.5, G1);
    txt(doc, "INDICATOR",  ML + 2,      y + 4, WH, 6.5, "bold");
    txt(doc, "SEVERITY",   ML + 95,     y + 4, WH, 6.5, "bold");
    txt(doc, "EVIDENCE",   ML + 120,    y + 4, WH, 6.5, "bold");
    y += 5.5;

    indicators.slice(0, 8).forEach((ind: any, i: number) => {
      const rowH = 6;
      const bg   = i % 2 === 0 ? G5 : WH;
      fill(doc, ML, y, CW, rowH, bg);
      txt(doc, ind.title || "Unknown",                                                ML + 2,  y + 4, G1, 7, "bold");
      txt(doc, sevLabel(ind.severity),                                                ML + 95, y + 4, G2, 7, "bold");
      const ev = ind.evidence || ind.description || "—";
      txt(doc, ev.length > 50 ? ev.substring(0, 47) + "..." : ev,                   ML + 120, y + 4, G2, 7, "normal");
      y += rowH;
    });

    stroke(doc, ML, y - indicators.slice(0, 8).length * 6 - 5.5, CW,
      indicators.slice(0, 8).length * 6 + 5.5, G4);
    y += 4;
  }

  // ============================================================================
  // SECTION 5 — RECOMMENDATIONS
  // ============================================================================
  if (recs.length > 0) {
    y = sectionHead(doc, "Security Recommendations", y);

    recs.slice(0, 6).forEach((rec, i) => {
      fill(doc, ML, y, CW, 6, i % 2 === 0 ? G5 : WH);
      txt(doc, `${i + 1}.`, ML + 3,  y + 4, G2, 8, "bold");
      txt(
        doc,
        rec.length > 100 ? rec.substring(0, 97) + "..." : rec,
        ML + 11, y + 4, G1, 7.5, "normal"
      );
      y += 6;
    });

    stroke(doc, ML, y - recs.slice(0, 6).length * 6, CW, recs.slice(0, 6).length * 6, G4);
    y += 4;
  }

  // ============================================================================
  // SECTION 6 — AI ANALYSIS SUMMARY (truncated to fit)
  // ============================================================================
  if (aiText && y < PH - 50) {
    y = sectionHead(doc, "AI Analysis Summary", y);

    const clean = aiText
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g,   "$1")
      .replace(/#{1,4}\s/g,    "")
      .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-")
      .trim();

    const available = PH - 24 - y;   // space left before footer
    const lineH     = 4.5;
    const maxLines  = Math.floor((available - 2) / lineH);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(clean.replace(/\n/g, " "), CW - 6);
    const shown   = wrapped.slice(0, maxLines);
    const blockH  = shown.length * lineH + 4;

    fill(doc, ML, y, CW, blockH, G5);
    stroke(doc, ML, y, CW, blockH, G4);
    doc.setTextColor(...G1);
    shown.forEach((ln: string, i: number) => {
      doc.text(ln, ML + 3, y + 5 + i * lineH);
    });

    if (wrapped.length > maxLines) {
      txt(doc, "[ Analysis continues — see full report for complete details ]",
          ML + 3, y + blockH - 1, G3, 6, "italic");
    }
    y += blockH + 4;
  }

  // ============================================================================
  // FOOTER
  // ============================================================================
  fill(doc, 0, PH - 16, PW, 16, G1);
  fill(doc, 0, PH - 16, PW, 0.4, BK);

  const footerY = PH - 7;
  txt(doc, "CYBERPHISH GUARDIAN  |  CONFIDENTIAL SECURITY REPORT", PW / 2, footerY, G3, 6, "normal", "center");
  txt(doc, new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      ML, footerY, G3, 6, "normal");
  txt(doc, `Page 1 of 1`, PW - MR, footerY, G3, 6, "normal", "right");

  // ── Save ───────────────────────────────────────────────────────────────────
  const filename = `cyberphish-report-${domain.replace(/\./g, "-")}-${Date.now()}.pdf`;
  doc.save(filename);
}
