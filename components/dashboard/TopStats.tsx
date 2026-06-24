'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, FileText, Globe } from 'lucide-react';

export default function TopStats() {
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to load stats');
        }
        
        const data = json.data;
        
        // Calculate percentage changes based on data.recentTrend
        const trend = data.recentTrend || [];
        const today = trend[trend.length - 1];
        const yesterday = trend[trend.length - 2];
        
        const getChange = (field: string) => {
          if (!today || !yesterday) return '+0%';
          const vToday = Number(today[field] || 0);
          const vYesterday = Number(yesterday[field] || 0);
          if (vYesterday === 0) return vToday > 0 ? '+100%' : '+0%';
          const diff = ((vToday - vYesterday) / vYesterday) * 100;
          const sign = diff >= 0 ? '+' : '';
          return `${sign}${diff.toFixed(0)}%`;
        };

        const list = [
          { name: 'Total URLs Scanned', value: data.totalScans?.toLocaleString() ?? '0', change: getChange('totalScans'), icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { name: 'Threats Detected', value: data.threatsDetected?.toLocaleString() ?? '0', change: getChange('threatsDetected'), icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10' },
          { name: 'Safe URLs', value: data.safeUrls?.toLocaleString() ?? '0', change: getChange('safeUrls'), icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { name: 'Avg. Risk Score', value: `${data.avgRiskScore ?? 0}/100`, change: getChange('avgRiskScore'), icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { name: 'Reports Gen.', value: data.reportsGenerated?.toLocaleString() ?? '0', change: '+0%', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        ];
        
        setStats(list);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error fetching analytics');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-panel p-4 rounded-xl animate-pulse h-32 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-9 h-9 rounded-lg bg-slate-800" />
              <div className="w-10 h-4 bg-slate-800 rounded" />
            </div>
            <div>
              <div className="w-2/3 h-4 bg-slate-800 rounded mb-2" />
              <div className="w-1/2 h-6 bg-slate-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm mb-8">
        Failed to load stats: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => {
        const isNegativeChange = stat.change.startsWith('-');
        const isThreatsDetected = stat.name === 'Threats Detected';
        const isAvgRiskScore = stat.name === 'Avg. Risk Score';
        
        let isGood = true;
        if (isThreatsDetected) {
          isGood = isNegativeChange;
        } else if (isAvgRiskScore) {
          isGood = isNegativeChange;
        } else {
          isGood = !isNegativeChange;
        }

        const changeColor = isGood ? 'text-emerald-400' : 'text-red-400';

        return (
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
              <span className={`text-xs font-semibold ${changeColor}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.name}</h3>
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
