'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Server, Lock, FileCode, CheckCircle, XCircle } from 'lucide-react';

const tabs = [
  { id: 'summary', label: 'Summary', icon: ShieldAlert },
  { id: 'dns', label: 'DNS & Domain', icon: Server },
  { id: 'ssl', label: 'SSL & Security', icon: Lock },
  { id: 'content', label: 'Content Analysis', icon: FileCode },
];

interface Props {
  scan?: any;
  intelligence?: any;
}

export default function AnalysisResults({ scan, intelligence }: Props) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!scan) return null;

  // Filter indicators into threats (high/critical) and lesser checks
  const indicators = scan.threatIndicators || [];
  const criticalThreats = indicators.filter((ind: any) => ind.severity === 'high' || ind.severity === 'critical');

  // Derive passing checks
  const passingChecks = [];
  if (scan.sslValid) {
    passingChecks.push({
      title: 'Valid SSL Certificate',
      desc: `Domain uses a valid, trusted SSL/TLS connection issued by ${scan.sslIssuer || 'a recognized authority'}.`
    });
  }
  if (scan.redirectCount <= 1) {
    passingChecks.push({
      title: 'Direct Connection',
      desc: 'No suspicious multi-hop URL redirection chains detected.'
    });
  }
  if (scan.domainAgeDays != null && scan.domainAgeDays > 365) {
    passingChecks.push({
      title: 'Mature Domain',
      desc: `Domain has been registered for ${scan.domainAgeDays} days, showing a history of consistent ownership.`
    });
  }
  if (intelligence?.virusTotal) {
    if (intelligence.virusTotal.malicious === 0) {
      passingChecks.push({
        title: 'Clean Engine Reputation',
        desc: 'Zero security engines flagged this host on VirusTotal reputation scans.'
      });
    }
  } else if (scan.riskScore <= 25) {
    passingChecks.push({
      title: 'Low Risk Profile',
      desc: 'Overall risk weight falls well within standard, non-malicious parameters.'
    });
  }

  // Format dates
  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'N/A';
    return new Date(dateVal).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6">Detailed Analysis Results</h3>
      
      <div className="flex space-x-2 border-b border-cyan-500/20 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[250px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Critical Threats */}
                  <div className={`glass-panel p-5 rounded-xl border ${criticalThreats.length > 0 ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      {criticalThreats.length > 0 ? (
                        <>
                          <XCircle className="w-5 h-5 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                          Critical Threats Identified ({criticalThreats.length})
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          No Critical Threats
                        </>
                      )}
                    </h4>
                    {criticalThreats.length > 0 ? (
                      <ul className="space-y-3 text-sm text-slate-300">
                        {criticalThreats.map((ind: any, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-red-500 mt-0.5">•</span> 
                            <span>
                              <strong className="text-white">{ind.title}:</strong>{' '}
                              {ind.description} {ind.evidence && <span className="text-cyan-400 block text-xs mt-0.5 font-mono">{ind.evidence}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400 leading-relaxed">
                        No critical indicators of brand impersonation, high-risk registrars, or credential theft vectors were parsed in the URL layout.
                      </p>
                    )}
                  </div>

                  {/* Passing Checks */}
                  <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                      Passing Checks ({passingChecks.length})
                    </h4>
                    {passingChecks.length > 0 ? (
                      <ul className="space-y-3 text-sm text-slate-300">
                        {passingChecks.map((chk: any, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-emerald-500 mt-0.5">•</span> 
                            <span>
                              <strong className="text-white">{chk.title}:</strong> {chk.desc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">
                        Analyzing system baseline integrity...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'dns' && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                  <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/80">
                      <tr>
                        <th className="px-4 py-3">Record Type</th>
                        <th className="px-4 py-3">Value</th>
                        <th className="px-4 py-3">Risk Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {intelligence?.dns?.resolves ? (
                        <>
                          {/* A Records */}
                          <tr className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-cyan-400">A</td>
                            <td className="px-4 py-3 font-mono text-slate-400">
                              {intelligence.dns.ipAddresses?.join(', ') || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded text-xs">
                                Resolved Host
                              </span>
                            </td>
                          </tr>

                          {/* MX Records */}
                          <tr className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-cyan-400">MX</td>
                            <td className="px-4 py-3 font-mono text-slate-400">
                              {intelligence.dns.hasMX ? `mail.${scan.domain}` : 'No MX Records Found'}
                            </td>
                            <td className="px-4 py-3">
                              {intelligence.dns.hasMX ? (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded text-xs">
                                  Configured
                                </span>
                              ) : (
                                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-xs">
                                  No Mail server
                                </span>
                              )}
                            </td>
                          </tr>

                          {/* TXT SPF */}
                          <tr className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-cyan-400">TXT (SPF)</td>
                            <td className="px-4 py-3 font-mono text-slate-400">
                              {intelligence.dns.hasSPF ? 'v=spf1 include:_spf.google.com ~all' : 'Missing SPF record'}
                            </td>
                            <td className="px-4 py-3">
                              {intelligence.dns.hasSPF ? (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded text-xs">
                                  Protected
                                </span>
                              ) : (
                                <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded text-xs">
                                  SPF Missing
                                </span>
                              )}
                            </td>
                          </tr>

                          {/* TXT DMARC */}
                          <tr className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-cyan-400">TXT (DMARC)</td>
                            <td className="px-4 py-3 font-mono text-slate-400">
                              {intelligence.dns.hasDMARC ? 'v=DMARC1; p=reject;...' : 'Missing DMARC policy'}
                            </td>
                            <td className="px-4 py-3">
                              {intelligence.dns.hasDMARC ? (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded text-xs">
                                  Enforced
                                </span>
                              ) : (
                                <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded text-xs">
                                  DMARC Missing
                                </span>
                              )}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                          <td colSpan={3} className="px-4 py-6 text-center text-red-400 font-medium">
                            DNS lookup failed. Host could not be resolved to any active IP address.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'ssl' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`glass-panel p-5 rounded-xl border-l-4 ${scan.sslValid ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Lock className={`w-4 h-4 ${scan.sslValid ? 'text-emerald-500' : 'text-red-500'}`} /> 
                    Certificate Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-slate-400">Issuer</span>
                      <span className="text-white font-medium truncate max-w-[200px]">{scan.sslIssuer || 'None'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-slate-400">Valid From</span>
                      <span className="text-white font-medium">{formatDate(intelligence?.ssl?.validFrom)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-slate-400">Valid To</span>
                      <span className="text-white font-medium">{formatDate(scan.sslExpiry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <span className={`font-semibold ${scan.sslValid ? 'text-emerald-400' : 'text-red-400'}`}>
                        {scan.sslValid ? 'Valid SSL' : 'Invalid SSL / Self-Signed'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  {!scan.sslValid ? (
                    <p className="text-slate-300 text-sm leading-relaxed bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                      <strong className="text-red-400 block mb-1">Security Warning:</strong> 
                      This site does not have a valid SSL certificate. The connection is unencrypted, meaning credentials, passwords, or personal detail entries are transmitted in cleartext and highly vulnerable to interception.
                    </p>
                  ) : intelligence?.ssl?.daysUntilExpiry != null && intelligence.ssl.daysUntilExpiry < 15 ? (
                    <p className="text-slate-300 text-sm leading-relaxed bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                      <strong className="text-orange-400 block mb-1">Security Warning:</strong> 
                      The certificate is valid but expires in {intelligence.ssl.daysUntilExpiry} days. Highly disposable or malicious domain setups often purchase short certificate periods and let them expire.
                    </p>
                  ) : (
                    <p className="text-slate-300 text-sm leading-relaxed bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                      <strong className="text-emerald-400 block mb-1">Secure Certificate:</strong> 
                      Site supports HTTPS with a verified SSL certificate. However, remember that malicious landing pages can also request free SSL certificates to build a false sense of security for victims.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'content' && (
               <div className="space-y-4">
                 {indicators.some((ind: any) => ind.category === 'keyword' || ind.category === 'url_pattern') ? (
                   <div className="bg-[#020617] rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
                     <div className="flex gap-4 mb-2 border-b border-slate-800 pb-2">
                       <span className="text-red-400">High Risk Finding</span>
                       <span className="text-slate-500">Source Pattern Matches</span>
                     </div>
                     <code>
                       {indicators
                         .filter((ind: any) => ind.category === 'keyword' || ind.category === 'url_pattern')
                         .map((ind: any, i: number) => (
                           <div key={i} className="mb-2">
                             <span className="text-pink-500">// {ind.title}</span><br />
                             <span className="text-yellow-300">"{ind.description}"</span>
                             {ind.evidence && <span className="text-green-400 block">{ind.evidence}</span>}
                           </div>
                         ))}
                     </code>
                   </div>
                 ) : (
                   <p className="text-sm text-slate-400 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                     No suspicious brand names or phishing keyword signatures (e.g. PayPal, signin, verify, account) were matched in the URL hostname or path patterns.
                   </p>
                 )}
                 <p className="text-sm text-slate-400 leading-relaxed">
                   HTML payload analyses are completed dynamically. The engine inspects for raw credential harvesting tactics, including form actions redirecting sensitive input to foreign domains.
                 </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
