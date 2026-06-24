'use client';

import { useState } from 'react';
import { Download, FileText, Printer, ShieldAlert, ShieldCheck, Lock, Globe, Zap, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  scan?: any;
  report?: any;
}

function ThreatBadge({ level }: { level: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    dangerous:  { label: 'Dangerous',  cls: 'bg-red-500/15 border-red-500/40 text-red-400' },
    high_risk:  { label: 'High Risk',  cls: 'bg-orange-500/15 border-orange-500/40 text-orange-400' },
    suspicious: { label: 'Suspicious', cls: 'bg-amber-500/15 border-amber-500/40 text-amber-400' },
    safe:       { label: 'Safe',       cls: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' },
  };
  const { label, cls } = cfg[level] ?? cfg.safe;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cls}`}>
      {level === 'safe' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
      {label}
    </span>
  );
}

function SeverityDot({ sev }: { sev: string }) {
  const cls: Record<string, string> = {
    critical: 'bg-red-500',
    high:     'bg-orange-500',
    medium:   'bg-amber-500',
    low:      'bg-emerald-500',
  };
  return <span className={`w-2 h-2 rounded-full shrink-0 ${cls[sev?.toLowerCase()] ?? 'bg-slate-500'}`} />;
}

function KVRow({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-800/70 last:border-0">
      <span className="text-slate-500 text-xs font-medium shrink-0 w-28">{label}</span>
      <span className={`text-xs font-mono text-right break-all ${highlight ?? 'text-slate-200'}`}>{value || '—'}</span>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const fill = ((100 - score) / 100) * circ;
  const color = score > 75 ? '#ef4444' : score > 50 ? '#f97316' : score > 25 ? '#f59e0b' : '#22c55e';

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#1e293b" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={radius} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div className="relative text-center">
        <div className="text-2xl font-black" style={{ color }}>{score}</div>
        <div className="text-[9px] text-slate-500 font-medium">/ 100</div>
      </div>
    </div>
  );
}

export default function ReportPreview({ scan, report }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  if (!scan || !report) return null;

  const cyberReport  = report?.fullReport   || {};
  const execSummary  = cyberReport?.executiveSummary  || {};
  const techFindings = cyberReport?.technicalFindings || {};
  const indicators: any[]      = cyberReport?.detectedIndicators || scan?.threatIndicators || [];
  const recommendations: string[] = cyberReport?.recommendations || scan?.recommendations || [];
  const aiSummary: string      = cyberReport?.aiExplanation?.summary || scan?.aiSummary || '';
  const vt = techFindings?.externalReputation?.virusTotal;
  const ssl = techFindings?.ssl || {};
  const dns = techFindings?.dns || {};

  const level = scan?.threatLevel || 'safe';
  const riskScore = scan?.riskScore ?? 0;
  const domain = scan?.domain || '';
  const phishProb = Math.round(parseFloat(scan?.phishingProbability || '0') * 100);

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { exportToPDF } = await import('@/lib/utils/pdfExport');
      await exportToPDF(scan, report);
    } catch (err) {
      console.error('PDF export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-slate-700/50 bg-slate-900/60 print:hidden">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Security Report
        </h3>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-wait rounded-lg text-xs font-bold text-white shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all cursor-pointer"
          >
            {isExporting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
            ) : (
              <><Download className="w-3.5 h-3.5" /> Export PDF</>
            )}
          </button>
        </div>
      </div>

      {/* ── Verdict Hero ──────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-slate-800/60">
        <ScoreRing score={riskScore} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <ThreatBadge level={level} />
            <span className="text-xs text-slate-500 font-mono">
              {phishProb}% phishing probability
            </span>
          </div>
          <h2 className="text-lg font-bold text-white truncate">{domain}</h2>
          <p className="text-slate-500 text-xs font-mono truncate mt-0.5">{scan?.url}</p>
        </div>
        <div className="text-right text-xs text-slate-500 shrink-0 space-y-1">
          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-3 h-3" />
            {new Date(report?.createdAt || Date.now()).toLocaleString()}
          </div>
          <div className="text-slate-600 font-mono text-[10px]">
            ID: {(report?.id || '').substring(0, 16).toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/60">

        {/* LEFT: Target Info + SSL */}
        <div className="p-6 space-y-6">
          {/* Target info card */}
          <div>
            <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Target Information
            </h4>
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 px-4 py-1">
              <KVRow label="URL" value={scan?.url?.length > 55 ? scan.url.substring(0, 52) + '…' : scan?.url} />
              <KVRow label="Domain" value={domain} highlight="text-cyan-300" />
              <KVRow label="IP Addresses" value={dns?.ipAddresses?.join(', ') || '—'} />
              <KVRow label="Domain Age" value={scan?.domainAgeDays != null ? `${scan.domainAgeDays} days` : 'Unknown'} />
              <KVRow label="Redirects" value={`${scan?.redirectCount ?? 0}`} />
              <KVRow label="Scan Duration" value={scan?.scanDurationMs ? `${(scan.scanDurationMs / 1000).toFixed(2)}s` : '—'} />
            </div>
          </div>

          {/* SSL/Network */}
          <div>
            <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> SSL &amp; Network
            </h4>
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 px-4 py-1">
              <KVRow label="SSL Valid"
                value={ssl?.valid ? '✓ Valid' : '✗ Invalid'}
                highlight={ssl?.valid ? 'text-emerald-400' : 'text-red-400'} />
              <KVRow label="Self-Signed" value={ssl?.selfSigned ? 'Yes' : 'No'} highlight={ssl?.selfSigned ? 'text-red-400' : 'text-slate-200'} />
              <KVRow label="Expiry" value={ssl?.daysUntilExpiry != null ? `${ssl.daysUntilExpiry} days` : '—'} />
              <KVRow label="DNS Resolves" value={dns?.resolves ? '✓ Yes' : '✗ No'} highlight={dns?.resolves ? 'text-emerald-400' : 'text-red-400'} />
              <KVRow label="SPF Record" value={dns?.hasSPF ? 'Present' : 'Missing'} highlight={dns?.hasSPF ? 'text-emerald-400' : 'text-amber-400'} />
              <KVRow label="DMARC" value={dns?.hasDMARC ? 'Present' : 'Missing'} highlight={dns?.hasDMARC ? 'text-emerald-400' : 'text-amber-400'} />
            </div>
          </div>
        </div>

        {/* RIGHT: Findings + VT + Recommendations */}
        <div className="p-6 space-y-6">
          {/* Immediate action */}
          <div className={`rounded-xl border px-4 py-3 ${
            level === 'safe'
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : level === 'suspicious'
              ? 'bg-amber-500/5 border-amber-500/20'
              : 'bg-red-500/5 border-red-500/20'
          }`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Immediate Action</p>
            <p className="text-sm font-semibold text-slate-100 leading-snug">
              {execSummary?.immediateAction || '—'}
            </p>
          </div>

          {/* Key findings */}
          {(execSummary?.keyFindings || []).length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Key Findings
              </h4>
              <ul className="space-y-1.5">
                {(execSummary.keyFindings as string[]).slice(0, 5).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* VirusTotal widget */}
          {vt && (
            <div>
              <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-3">VirusTotal Intelligence</h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Malicious',  val: vt.malicious,  cls: 'text-red-400' },
                  { label: 'Suspicious', val: vt.suspicious, cls: 'text-amber-400' },
                  { label: 'Harmless',   val: vt.harmless,   cls: 'text-emerald-400' },
                  { label: 'Undetected', val: vt.undetected, cls: 'text-slate-400' },
                ].map(({ label, val, cls }) => (
                  <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-center">
                    <div className={`text-xl font-black ${cls}`}>{val}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Threat Indicators ─────────────────────────────────────────── */}
      {indicators.length > 0 && (
        <div className="px-6 pb-6 border-t border-slate-800/60 pt-5">
          <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Threat Indicators ({indicators.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {indicators.slice(0, 8).map((ind: any, i: number) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                <SeverityDot sev={ind.severity} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{ind.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{ind.evidence || ind.description}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase shrink-0 ml-auto ${
                  ind.severity === 'critical' ? 'text-red-400' :
                  ind.severity === 'high'     ? 'text-orange-400' :
                  ind.severity === 'medium'   ? 'text-amber-400' : 'text-emerald-400'
                }`}>{ind.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recommendations ───────────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <div className="px-6 pb-6 border-t border-slate-800/60 pt-5">
          <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Recommendations
          </h4>
          <ol className="space-y-2">
            {recommendations.slice(0, 6).map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-slate-300">
                <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-700/40 text-cyan-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── AI Summary strip ─────────────────────────────────────────── */}
      {aiSummary && (
        <div className="mx-6 mb-6 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">AI Analysis Summary</p>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
            {aiSummary.replace(/\*\*(.*?)\*\*/g, '$1').replace(/#{1,4}\s/g, '').substring(0, 400)}
            {aiSummary.length > 400 ? '…' : ''}
          </p>
          <p className="text-[10px] text-slate-600 mt-2 italic">Full AI analysis included in exported PDF.</p>
        </div>
      )}
    </div>
  );
}
