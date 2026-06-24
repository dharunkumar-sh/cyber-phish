'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ShieldX, Globe2, Lock, ActivitySquare, AlertOctagon, Clock, ArrowRightLeft } from 'lucide-react';

interface Props {
  scan?: any;
  intelligence?: any;
}

export default function ThreatOverview({ scan, intelligence }: Props) {
  if (!scan) return null;

  const levelText = (level: string) => {
    switch (level) {
      case 'safe': return 'Safe';
      case 'suspicious': return 'Suspicious';
      case 'high_risk': return 'High Risk';
      case 'dangerous': return 'Dangerous';
      default: return level;
    }
  };

  const getLevelColors = (level: string) => {
    switch (level) {
      case 'dangerous': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
      case 'high_risk': return { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' };
      case 'suspicious': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
      case 'safe': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };
      default: return { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' };
    }
  };

  const getDomainRep = () => {
    const vt = intelligence?.virusTotal;
    if (vt) {
      if (vt.malicious > 0) return 'Malicious';
      if (vt.suspicious > 0) return 'Suspicious';
      return 'Clean';
    }
    return scan.riskScore > 50 ? 'Suspicious' : 'Clean';
  };

  const domainRep = getDomainRep();
  const repColors = domainRep === 'Malicious' 
    ? { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    : domainRep === 'Suspicious'
    ? { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' }
    : { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };

  const threatLvlColors = getLevelColors(scan.threatLevel);
  const sslColors = scan.sslValid 
    ? { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' }
    : { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };

  const probability = (parseFloat(scan.phishingProbability || '0') * 100).toFixed(1);
  const probColors = parseFloat(probability) > 75
    ? { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    : parseFloat(probability) > 40
    ? { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' }
    : { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };

  const indicatorsCount = scan.threatIndicators?.length ?? 0;
  const indColors = indicatorsCount > 4
    ? { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    : indicatorsCount > 0
    ? { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' }
    : { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };

  const ageText = scan.domainAgeDays != null ? `${scan.domainAgeDays} Days` : 'Unknown';
  const ageColors = (scan.domainAgeDays != null && scan.domainAgeDays < 90)
    ? { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    : { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };

  const redirectColors = scan.redirectCount > 2
    ? { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    : scan.redirectCount > 0
    ? { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' }
    : { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };

  const scoreColors = scan.riskScore > 75
    ? { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    : scan.riskScore > 50
    ? { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' }
    : scan.riskScore > 25
    ? { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' }
    : { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };

  const overviewData = [
    { label: 'Risk Score', value: `${scan.riskScore}/100`, icon: AlertOctagon, ...scoreColors },
    { label: 'Threat Level', value: levelText(scan.threatLevel), icon: AlertTriangle, ...threatLvlColors },
    { label: 'Domain Rep', value: domainRep, icon: Globe2, ...repColors },
    { label: 'SSL Security', value: scan.sslValid ? 'Valid' : 'Invalid', icon: Lock, ...sslColors },
    { label: 'Phishing Prob', value: `${probability}%`, icon: ActivitySquare, ...probColors },
    { label: 'Indicators', value: `${indicatorsCount} Found`, icon: ShieldX, ...indColors },
    { label: 'Domain Age', value: ageText, icon: Clock, ...ageColors },
    { label: 'Redirects', value: `${scan.redirectCount} Hop${scan.redirectCount === 1 ? '' : 's'}`, icon: ArrowRightLeft, ...redirectColors },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertOctagon className={scan.riskScore > 50 ? "text-red-500 animate-pulse" : "text-emerald-500"} />
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
