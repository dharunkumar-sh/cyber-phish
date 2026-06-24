'use client';

import { Bot, Sparkles } from 'lucide-react';

interface Props {
  scan?: any;
}

export default function AIAssistant({ scan }: Props) {
  if (!scan) return null;

  const isHighRisk = scan.threatLevel === 'dangerous' || scan.threatLevel === 'high_risk';

  // Lightweight markdown-to-react parser for **bold** and *italic*
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      // Split by bold (** or __)
      const parts = line.split('**');
      const elements = parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="text-white font-bold">{part}</strong>;
        }
        // Split by italic (*)
        const subParts = part.split('*');
        return subParts.map((subPart, j) => {
          if (j % 2 === 1) {
            return <em key={j} className="text-cyan-300 font-medium italic">{subPart}</em>;
          }
          return subPart;
        });
      });

      return (
        <p key={idx} className="mb-3 last:mb-0">
          {elements}
        </p>
      );
    });
  };

  return (
    <div className={`glass-panel rounded-2xl p-6 mb-8 border relative overflow-hidden bg-gradient-to-br from-[#020617] ${isHighRisk ? 'to-red-950/10 border-red-500/20' : 'to-cyan-900/10 border-cyan-500/20'}`}>
      <div className={`absolute top-0 right-0 w-[300px] h-[300px] ${isHighRisk ? 'bg-red-500/5' : 'bg-cyan-500/5'} rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none`} />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className={`p-2 rounded-lg border shadow-lg ${isHighRisk ? 'bg-red-500/20 border-red-500/50 shadow-red-500/10' : 'bg-cyan-500/20 border-cyan-500/50 shadow-cyan-500/10'}`}>
          <Bot className={`w-6 h-6 ${isHighRisk ? 'text-red-400' : 'text-cyan-400'}`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            AI Security Assistant <Sparkles className={`w-4 h-4 animate-pulse ${isHighRisk ? 'text-red-400' : 'text-cyan-400'}`} />
          </h3>
          <p className="text-xs text-slate-400">Powered by CyberPhish Nexus Engine</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10 text-slate-300 leading-relaxed text-sm bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 max-h-[400px] overflow-y-auto">
        {scan.aiSummary ? (
          renderMarkdown(scan.aiSummary)
        ) : (
          <p className="text-slate-400 italic">No summary assessment was generated for this target.</p>
        )}

        {isHighRisk && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200">
            <strong className="text-red-400 block mb-1">Critical Action Warning:</strong> 
            Do not enter any authentication credentials or upload files to this site. If anyone has entered information, immediately trigger incident response credentials rotations.
          </div>
        )}
      </div>
    </div>
  );
}
