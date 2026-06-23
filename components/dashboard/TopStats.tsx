'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, FileText, Globe } from 'lucide-react';

const stats = [
  { name: 'Total URLs Scanned', value: '14,293', change: '+12%', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { name: 'Threats Detected', value: '1,842', change: '+5%', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10' },
  { name: 'Safe URLs', value: '12,451', change: '+15%', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { name: 'Avg. Risk Score', value: '34/100', change: '-2%', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { name: 'Reports Gen.', value: '892', change: '+8%', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
];

export default function TopStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-panel p-4 rounded-xl hover:border-cyan-500/30 transition-colors group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-semibold ${stat.change.startsWith('-') && stat.name === 'Avg. Risk Score' ? 'text-emerald-400' : stat.name === 'Threats Detected' ? 'text-red-400' : 'text-emerald-400'}`}>
              {stat.change}
            </span>
          </div>
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.name}</h3>
            <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
