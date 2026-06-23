'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';

const stages = [
  { name: 'URL Submission', status: 'completed', time: '0.0s' },
  { name: 'Domain Intelligence Gathering', status: 'completed', time: '0.8s' },
  { name: 'SSL Certificate Verification', status: 'completed', time: '1.2s' },
  { name: 'Reputation Analysis', status: 'completed', time: '2.5s' },
  { name: 'Machine Learning Classification', status: 'completed', time: '3.1s' },
  { name: 'AI Threat Assessment', status: 'completed', time: '4.5s' },
  { name: 'Report Generation', status: 'current', time: '...' },
];

export default function ScanTimeline({ isScanning, scanComplete }: { isScanning: boolean, scanComplete: boolean }) {
  if (!isScanning && !scanComplete) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl mb-8">
      <h3 className="text-lg font-bold text-white mb-6">Analysis Timeline</h3>
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-800"></div>
        <div 
          className="absolute left-[11px] top-4 w-0.5 bg-cyan-500 transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          style={{ height: scanComplete ? '100%' : '85%' }}
        ></div>

        <div className="space-y-6 relative z-10">
          {stages.map((stage, index) => {
            const isCompleted = scanComplete || index < stages.length - 1;
            const isCurrent = isScanning && index === stages.length - 1;
            
            return (
              <motion.div 
                key={stage.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-4"
              >
                <div className="bg-[#020617] rounded-full relative z-10 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] bg-[#020617] rounded-full" />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin bg-[#020617] rounded-full" />
                  ) : (
                    <CircleDashed className="w-6 h-6 text-slate-600 bg-[#020617] rounded-full" />
                  )}
                </div>
                <div className="flex-1 pb-1 pt-0.5">
                  <div className="flex justify-between items-center">
                    <p className={`font-medium ${isCompleted ? 'text-slate-200' : isCurrent ? 'text-purple-400' : 'text-slate-500'}`}>
                      {stage.name}
                    </p>
                    <span className="text-xs text-slate-500 font-mono">{isCompleted ? stage.time : isCurrent ? 'running...' : 'pending'}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
