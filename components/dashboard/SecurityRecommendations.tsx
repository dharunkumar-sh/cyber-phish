'use client';

import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  scan?: any;
}

export default function SecurityRecommendations({ scan }: Props) {
  if (!scan) return null;

  const rawRecs = scan.recommendations || [];

  // Categorize based on text keyword matches
  const critical = rawRecs.filter((r: string) => 
    /close|immediately|reset|block|quarantine|malware|do not/i.test(r)
  );

  const recommended = rawRecs.filter((r: string) => 
    /monitor|report|verify|check|cautious/i.test(r) && !critical.includes(r)
  );

  // Fallback to remaining or generic
  const others = rawRecs.filter((r: string) => 
    !critical.includes(r) && !recommended.includes(r)
  );

  const defaultBestPractices = [
    'Enforce MFA (Multi-Factor Authentication) for all corporate accounts.',
    'Ensure all team members complete security and phishing awareness simulations.',
  ];

  const bestPractices = others.length > 0 ? others : defaultBestPractices;

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6">Security Recommendations</h3>
      
      <div className="space-y-4">
        {/* Critical Actions */}
        {critical.length > 0 && (
          <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-5 hover:bg-red-500/10 transition-colors animate-pulse-slow">
            <h4 className="flex items-center gap-2 text-red-500 font-bold mb-3 drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]">
              <ShieldAlert className="w-5 h-5" /> Critical Actions
            </h4>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
              {critical.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Recommended Actions */}
        {(recommended.length > 0 || critical.length === 0) && (
          <div className="border border-orange-500/30 bg-orange-500/5 rounded-xl p-5 hover:bg-orange-500/10 transition-colors">
            <h4 className="flex items-center gap-2 text-orange-400 font-bold mb-3 drop-shadow-[0_0_5px_rgba(249,115,22,0.6)]">
              <AlertTriangle className="w-5 h-5" /> Recommended Actions
            </h4>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
              {recommended.length > 0 ? (
                recommended.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))
              ) : (
                <li>Verify source authenticity before entering details on this domain.</li>
              )}
            </ul>
          </div>
        )}

        {/* Best Practices */}
        <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-5 hover:bg-emerald-500/10 transition-colors">
          <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-3 drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]">
            <ShieldCheck className="w-5 h-5" /> Best Practices
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
            {bestPractices.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
