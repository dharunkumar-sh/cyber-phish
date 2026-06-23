'use client';

import Layout from '@/components/Layout';
import ReportPreview from '@/components/dashboard/ReportPreview';

export default function ReportsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="border-b border-cyan-500/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Security Reports Preview</h2>
          <p className="text-slate-400 text-sm">Review, print, or export generated PDF vulnerability reports for target sites.</p>
        </div>
        <ReportPreview />
      </div>
    </Layout>
  );
}
