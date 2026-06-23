'use client';

import { Search, Filter, ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';

const historyData = [
  { id: 'SCN-8924', url: 'paypal-secure-update.com', date: '2026-06-23 09:14', threat: 'Critical', score: 94, status: 'Phishing' },
  { id: 'SCN-8923', url: 'google.com', date: '2026-06-23 08:30', threat: 'Low', score: 12, status: 'Safe' },
  { id: 'SCN-8922', url: 'office365-verify-login.net', date: '2026-06-22 18:45', threat: 'Critical', score: 98, status: 'Phishing' },
  { id: 'SCN-8921', url: 'github.com/login', date: '2026-06-22 14:20', threat: 'Low', score: 5, status: 'Safe' },
  { id: 'SCN-8920', url: 'update-flash-player.net', date: '2026-06-21 11:10', threat: 'High', score: 85, status: 'Malware' },
];

export default function ScanHistory() {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-white">Recent Scans</h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search history..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-700/50 rounded-lg">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-800/80 border-b border-slate-700/50">
            <tr>
              <th className="px-4 py-3">Scan ID</th>
              <th className="px-4 py-3">Target URL</th>
              <th className="px-4 py-3">Date / Time</th>
              <th className="px-4 py-3">Verdict</th>
              <th className="px-4 py-3">Risk Score</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {historyData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition-colors bg-slate-900/20">
                <td className="px-4 py-3 font-mono text-cyan-400 text-xs">{row.id}</td>
                <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate" title={row.url}>{row.url}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{row.date}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded text-xs ${
                    row.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 
                    'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {row.status === 'Safe' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${row.score > 80 ? 'bg-red-500' : row.score > 40 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                        style={{ width: `${row.score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-300">{row.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-slate-400 hover:text-cyan-400 transition-colors p-1 rounded hover:bg-slate-800 cursor-pointer" title="View Report">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
