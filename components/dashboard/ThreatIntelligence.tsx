'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Globe, 
  Zap, 
  Database, 
  Loader2, 
  Lock, 
  Search, 
  BookOpen, 
  Shield, 
  Filter, 
  ArrowUpRight, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

interface Props {
  scan?: any;
  intelligence?: any;
}

export default function ThreatIntelligence({ scan, intelligence }: Props) {
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [correlation, setCorrelation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'dangerous' | 'high_risk' | 'suspicious' | 'safe'>('all');

  const isGlobalView = !scan;

  useEffect(() => {
    if (!isGlobalView) return;

    async function fetchTelemetry() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch up to 50 scans to support live searching and filtering
        const scansRes = await fetch('/api/scans?limit=50');
        const scansJson = await scansRes.json();
        if (!scansRes.ok || !scansJson.success) {
          throw new Error(scansJson.error || 'Failed to fetch threat telemetry');
        }
        setTelemetry(scansJson.data || []);

        // Fetch analytics for correlation stats
        const analyticsRes = await fetch('/api/analytics');
        const analyticsJson = await analyticsRes.json();
        if (analyticsRes.ok && analyticsJson.success) {
          const stats = analyticsJson.data;
          setAnalyticsData(stats);
          if (stats.totalScans > 0) {
            const ratio = (stats.threatsDetected / stats.totalScans) * 100;
            setCorrelation(Math.round(ratio));
          }
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load threat telemetry feed');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTelemetry();
  }, [isGlobalView]);

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'dangerous':
      case 'high':
      case 'high_risk':
        return 'bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]';
      case 'medium':
      case 'suspicious':
        return 'bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
      case 'safe':
      case 'low':
      default:
        return 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'Critical';
      case 'high':
      case 'high_risk': return 'High Risk';
      case 'medium':
      case 'suspicious': return 'Suspicious';
      default: return 'Safe';
    }
  };

  // If specific scan is provided, show current scan indicators
  if (!isGlobalView) {
    const indicators = scan.threatIndicators || [];
    const probability = Math.round(parseFloat(scan.phishingProbability || '0') * 100);

    return (
      <div className="glass-panel rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 relative z-10">
          <Activity className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] w-5 h-5" />
          Threat Intelligence Signals
        </h3>
        <p className="text-slate-400 text-xs mb-6 max-w-3xl relative z-10">
          Heuristic signals and indicators gathered dynamically for this specific scan host. We cross-reference network configuration, cryptographical handshakes, and reputational blacklists.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Triggered Indicators</h4>
            {indicators.length === 0 ? (
              <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-xl text-slate-500 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                No active threat indicators or malicious matches were triggered for this domain.
              </div>
            ) : (
              indicators.slice(0, 5).map((ind: any, index: number) => {
                const isDns = ind.category === 'dns';
                const isSsl = ind.category === 'ssl';
                const Icon = isDns ? Zap : isSsl ? Lock : Database;

                return (
                  <div key={index} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-cyan-500/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-semibold text-sm">{ind.title}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 max-w-[200px] md:max-w-[400px] truncate">{ind.description || ind.evidence}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${getSeverityBadgeClass(ind.severity)}`}>
                      {getSeverityLabel(ind.severity).toUpperCase()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Probability Engine</h4>
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 relative overflow-hidden flex flex-col justify-center items-center text-center group hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" />
              <div className="absolute w-full h-full bg-gradient-to-t from-purple-950/20 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">AI Phishing Likelihood</p>
                <div className={`w-24 h-24 rounded-full border-4 ${probability > 75 ? 'border-red-500/40' : probability > 25 ? 'border-amber-500/40' : 'border-emerald-500/40'} flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.15)] bg-slate-950`}>
                  <span className={`text-3xl font-black tracking-tight ${probability > 75 ? 'text-red-500' : probability > 25 ? 'text-amber-400' : 'text-emerald-400'}`}>{probability}%</span>
                </div>
                <p className="text-xs text-slate-300 max-w-[180px] leading-relaxed mx-auto">
                  {probability > 75 
                    ? 'Extremely high likelihood of credential harvesting intent.' 
                    : probability > 25 
                    ? 'Suspicious structural layout matches phishing signatures.' 
                    : 'Target features appear legitimate and safe.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter list of telemetry items based on search and tab selections
  const filteredTelemetry = telemetry.filter((item) => {
    const matchesSearch = 
      item.domain?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.url?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && item.threatLevel === activeTab;
  });

  return (
    <div className="space-y-8">
      {/* ─── EDUCATIONAL INTRODUCTION CARD ─────────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-cyan-500/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" /> Threat Education Portal
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Understanding Threat Intelligence</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              CyberPhish Threat Intelligence compiles scanning results, DNS records, SSL certificates, and external blacklist indicators to map global security patterns. When you analyze a URL, our heuristics engine checks these criteria to calculate a precise **Risk Score** out of 100.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-slate-200 text-xs font-bold uppercase tracking-wider mb-0.5">Threat Indicators</h5>
                  <p className="text-slate-400 text-[11px] leading-normal">Granular security warnings representing specific vulnerabilities detected during checks.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-slate-200 text-xs font-bold uppercase tracking-wider mb-0.5">Correlation Feed</h5>
                  <p className="text-slate-400 text-[11px] leading-normal">Visual representation of real-time phishing attacks tracked across our networks.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Live Threat Rate
            </h4>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-black text-red-500 tracking-tight">{correlation}%</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Correlation Index</div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-[150px]">
                Percentage of scanned URLs classified as malicious, suspicious, or high risk.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Telemetry Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── METRICS CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Telemetry Scans', 
            val: analyticsData ? analyticsData.totalScans : '—', 
            desc: 'Aggregate url queries analyzed', 
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10 border-cyan-500/20' 
          },
          { 
            label: 'Threats Blocked', 
            val: analyticsData ? analyticsData.threatsDetected : '—', 
            desc: 'Campaign domains isolated', 
            color: 'text-red-400',
            bg: 'bg-red-500/10 border-red-500/20' 
          },
          { 
            label: 'Clean Targets', 
            val: analyticsData ? analyticsData.safeUrls : '—', 
            desc: 'Verified benign hosts', 
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20' 
          },
          { 
            label: 'Average Risk Score', 
            val: analyticsData ? `${analyticsData.avgRiskScore}/100` : '—', 
            desc: 'Global threat weight mean', 
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20' 
          },
        ].map((c, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{c.label}</p>
            <div className="my-4">
              <span className={`text-3xl font-black ${c.color}`}>{c.val}</span>
            </div>
            <p className="text-[11px] text-slate-500">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* ─── CORE PILLARS OF THREAT ANALYSIS ─────────────────────────────── */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">How We Classify Threats</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              title: 'Domain & DNS Reputation',
              icon: Globe,
              color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
              text: 'We inspect the domain age (new domains are high-risk), name spoofing similarity (typosquatting), and check SPF/DMARC settings to authenticate mail routing.'
            },
            {
              title: 'Cryptographic Security',
              icon: Lock,
              color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
              text: 'Analyses of SSL handshakes, validity periods, authority trust chains, and flag self-signed certs which are widely used by temporary phishing kits.'
            },
            {
              title: 'Global Intelligence',
              icon: Database,
              color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
              text: 'Multi-engine analysis integrating community scores and reputational logs (e.g. VirusTotal API) to identify hosts matching active blocklist patterns.'
            },
            {
              title: 'AI Classifier heuristics',
              icon: Zap,
              color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
              text: 'Deep inspection of visual structures, logo branding spoof risks, keyword harvesting kits, and script obfuscations to determine final probabilities.'
            }
          ].map((item, index) => (
            <div key={index} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700/50 hover:bg-slate-900/20 transition-all flex flex-col justify-between">
              <div>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-bold text-slate-100 mb-2">{item.title}</h5>
                <p className="text-slate-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── LIVE TELEMETRY DEEP VIEW ────────────────────────────────────── */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Telemetry Explorer
            </h4>
            <p className="text-slate-500 text-xs mt-0.5">Search or filter through recent system assessments and triggered scores.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by domain..."
                className="w-full sm:w-60 pl-9 pr-3 py-1.5 bg-slate-900/60 border border-slate-850 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-850 p-1 rounded-lg">
              {[
                { id: 'all', label: 'All' },
                { id: 'dangerous', label: 'Dangerous' },
                { id: 'high_risk', label: 'High' },
                { id: 'suspicious', label: 'Suspicious' },
                { id: 'safe', label: 'Safe' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-cyan-600 text-white shadow-[0_0_8px_rgba(8,145,178,0.3)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FEED CONTENT */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-slate-500 text-xs font-mono">Loading telemetry logs...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl inline-block max-w-md">
              {error}
            </div>
          </div>
        ) : filteredTelemetry.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-sm font-medium">
            No telemetry records found matching your filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-850">
            {filteredTelemetry.map((item, index) => {
              const isSafe = item.threatLevel === 'safe';
              const riskColor = 
                item.threatLevel === 'dangerous' ? 'text-red-400' :
                item.threatLevel === 'high_risk' ? 'text-orange-400' :
                item.threatLevel === 'suspicious' ? 'text-amber-400' : 'text-emerald-400';

              return (
                <div key={index} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/10 transition-colors group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-200 font-semibold text-sm block truncate max-w-xs md:max-w-md" title={item.url}>
                        {item.domain}
                      </span>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap text-[10px] font-mono text-slate-500">
                        <span>SSL: {item.sslValid ? '✓ Valid' : '✗ Invalid'}</span>
                        <span>•</span>
                        <span>Hops: {item.redirectCount}</span>
                        <span>•</span>
                        <span>Time: {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Risk Rating</div>
                      <div className={`text-sm font-black mt-0.5 ${riskColor}`}>
                        {item.riskScore} <span className="text-[10px] text-slate-600 font-normal">/100</span>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider ${getSeverityBadgeClass(item.threatLevel)}`}>
                      {getSeverityLabel(item.threatLevel).toUpperCase()}
                    </span>

                    <Link 
                      href={`/dashboard/reports?scanId=${item.id}`}
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-900 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                      title="Inspect Security Report"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
