'use client';

import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SecurityRecommendations() {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6">Security Recommendations</h3>
      
      <div className="space-y-4">
        <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-5 hover:bg-red-500/10 transition-colors">
          <h4 className="flex items-center gap-2 text-red-500 font-bold mb-3 drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]">
            <ShieldAlert className="w-5 h-5" /> Critical Actions
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
            <li>Block this domain immediately on all corporate firewalls and DNS filters.</li>
            <li>Initiate a password reset for any user who may have interacted with this URL in the past 24 hours.</li>
            <li>Update email security gateways to quarantine inbound messages containing this URL.</li>
          </ul>
        </div>
        
        <div className="border border-orange-500/30 bg-orange-500/5 rounded-xl p-5 hover:bg-orange-500/10 transition-colors">
          <h4 className="flex items-center gap-2 text-orange-400 font-bold mb-3 drop-shadow-[0_0_5px_rgba(249,115,22,0.6)]">
            <AlertTriangle className="w-5 h-5" /> Recommended Actions
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
            <li>Monitor authentication logs for unusual login attempts targeting the compromised service.</li>
            <li>Report the domain to Google Safe Browsing and Microsoft SmartScreen.</li>
          </ul>
        </div>

        <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-5 hover:bg-emerald-500/10 transition-colors">
          <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-3 drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]">
            <ShieldCheck className="w-5 h-5" /> Best Practices
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
            <li>Ensure all employees have completed the Q3 phishing awareness training.</li>
            <li>Enforce MFA (Multi-Factor Authentication) for all external service access.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
