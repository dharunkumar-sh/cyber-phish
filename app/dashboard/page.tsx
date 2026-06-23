'use client';

import Layout from '@/components/Layout';
import TopStats from '@/components/dashboard/TopStats';
import ScanHistory from '@/components/dashboard/ScanHistory';

export default function DashboardOverview() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="border-b border-cyan-500/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Security Control Center</h2>
          <p className="text-slate-400 text-sm">Real-time monitoring and overview of system wide threat analysis.</p>
        </div>
        <TopStats />
        <ScanHistory />
      </div>
    </Layout>
  );
}
