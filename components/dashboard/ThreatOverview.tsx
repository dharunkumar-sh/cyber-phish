'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ShieldX, Globe2, Lock, ActivitySquare, AlertOctagon, Clock, ArrowRightLeft } from 'lucide-react';

const overviewData = [
  { label: 'Risk Score', value: '94/100', icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { label: 'Threat Level', value: 'Critical', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { label: 'Domain Rep', value: 'Suspicious', icon: Globe2, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  { label: 'SSL Security', value: 'Invalid', icon: Lock, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { label: 'Phishing Prob', value: '98.5%', icon: ActivitySquare, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { label: 'Indicators', value: '14 Found', icon: ShieldX, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  { label: 'Domain Age', value: '2 Days', icon: Clock, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { label: 'Redirects', value: '4 Hops', icon: ArrowRightLeft, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
];

export default function ThreatOverview() {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertOctagon className="text-red-500" />
        Threat Overview
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {overviewData.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-panel p-4 rounded-xl border ${item.border} hover:bg-white/5 transition-all flex items-center gap-4`}
          >
            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{item.label}</p>
              <p className={`text-xl font-bold ${item.color} drop-shadow-md`}>{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
