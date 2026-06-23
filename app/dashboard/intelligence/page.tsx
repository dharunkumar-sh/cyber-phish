'use client';

import Layout from '@/components/Layout';
import ThreatIntelligence from '@/components/dashboard/ThreatIntelligence';

export default function ThreatIntelligencePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="border-b border-cyan-500/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Threat Intelligence</h2>
          <p className="text-slate-400 text-sm">Global campaign correlation stats, signatures, and malicious indicators telemetry feed.</p>
        </div>
        <ThreatIntelligence />
      </div>
    </Layout>
  );
}
