'use client';

import { Activity, Globe, Zap, Database } from 'lucide-react';

export default function ThreatIntelligence() {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Activity className="text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        Threat Intelligence Signals
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <Zap className="text-orange-400 w-5 h-5" />
              <span className="text-slate-300 font-medium">Fast Flux DNS Detected</span>
            </div>
            <span className="text-xs bg-orange-500/20 border border-orange-500/30 text-orange-400 px-2 py-1 rounded shadow-[0_0_8px_rgba(249,115,22,0.2)]">Medium</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <Database className="text-red-500 w-5 h-5" />
              <span className="text-slate-300 font-medium">Known Phishing Kit Signature</span>
            </div>
            <span className="text-xs bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-1 rounded shadow-[0_0_8px_rgba(239,68,68,0.2)]">High</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="text-red-500 w-5 h-5" />
              <span className="text-slate-300 font-medium">Suspicious TLD Abuse (.xyz)</span>
            </div>
            <span className="text-xs bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-1 rounded shadow-[0_0_8px_rgba(239,68,68,0.2)]">High</span>
          </div>
        </div>
        
        <div className="glass-panel p-4 rounded-xl border border-purple-500/30 relative overflow-hidden flex flex-col justify-center items-center text-center group hover:border-purple-500/50 transition-colors">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />
          <div className="absolute w-full h-full bg-gradient-to-t from-purple-900/30 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-sm text-slate-400 mb-3 font-medium tracking-wide">Campaign Correlation</p>
            <div className="w-24 h-24 rounded-full border-4 border-red-500/50 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-shadow bg-[#020617]">
              <span className="text-3xl font-bold text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">94%</span>
            </div>
            <p className="text-xs text-slate-300">Match with active threats</p>
          </div>
        </div>
      </div>
    </div>
  );
}
