'use client';

import Layout from '@/components/Layout';
import ScanHistory from '@/components/dashboard/ScanHistory';

export default function HistoryPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="border-b border-cyan-500/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Scan History Archive</h2>
          <p className="text-slate-400 text-sm">Full records of previous threat lookups, risk scores, and generated analysis targets.</p>
        </div>
        <ScanHistory />
      </div>
    </Layout>
  );
}
