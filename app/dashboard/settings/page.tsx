'use client';

import Layout from '@/components/Layout';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="border-b border-cyan-500/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-slate-400 text-sm">Configure scan sensitivity, engine options, API hooks, and notification rules.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl max-w-2xl border border-slate-700/50">
          <h3 className="text-lg font-bold text-white mb-6">Threat Engine Tuning</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <p className="text-sm font-semibold text-slate-200">Aggressive Domain Age Warning</p>
                <p className="text-xs text-slate-500">Flag domains registered within the last 14 days as high risk.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <p className="text-sm font-semibold text-slate-200">Deep Heuristic DOM Scanning</p>
                <p className="text-xs text-slate-500">Trace hidden inputs, scripts, and forms inside third-party frameworks.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center pb-1">
              <div>
                <p className="text-sm font-semibold text-slate-200">Export Auto-Generated AI Executive Report</p>
                <p className="text-xs text-slate-500">Automatically attach conversational explanations to downloadable PDFs.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
