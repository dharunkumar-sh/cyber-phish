'use client';

import { Bot, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-cyan-500/30 relative overflow-hidden bg-gradient-to-br from-[#020617] to-cyan-900/10">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Bot className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            AI Security Assistant <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </h3>
          <p className="text-sm text-cyan-400/80">Powered by CyberPhish Nexus Engine</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10 text-slate-300 leading-relaxed text-sm bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
        <p>
          I've analyzed the URL you provided. <strong className="text-white">This looks highly suspicious and is likely a phishing attack.</strong>
        </p>
        <p>
          Here's why: The page is designed to look exactly like a legitimate service login screen, but the domain name is a close variation (typosquatting) and is not owned by the official brand. In fact, our records indicate it was registered just two days ago.
        </p>
        <p>
          Furthermore, when credentials are entered on this page, my analysis shows they aren't sent to official servers. Instead, they are secretly posted to a hidden drop-zone server, which is a known tactic used by cybercriminals to harvest passwords and credit card numbers.
        </p>
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200">
          <strong className="text-red-400 block mb-1">What you should do:</strong> 
          Do not enter any information on this page. If anyone in your organization has visited it, they should change their passwords immediately and monitor for unauthorized access.
        </div>
      </div>
    </div>
  );
}
