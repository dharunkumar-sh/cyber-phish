"use client";

import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle, AlertOctagon, Info, Download, Server, Lock, AlertTriangle } from "lucide-react";

export default function OutputDashboard() {
  return (
    <section id="output" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[var(--color-cyber-purple)] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[var(--color-cyber-cyan)] text-sm font-semibold mb-4 tracking-wide uppercase"
          >
            Stage 3: Output
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Comprehensive Security <span className="text-gradient">Report</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Receive a detailed breakdown of the threat level, AI-generated explanations, and actionable recommendations.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto glass-panel rounded-2xl border border-red-500/30 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)]"
        >
          {/* Dashboard Header */}
          <div className="bg-[#0f172a] p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-6 h-6 text-red-500" />
                Analysis Results
              </h3>
              <p className="text-sm text-slate-400 mt-1">Target: secure-login-banking-update.com/auth/verify</p>
            </div>
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-slate-600">
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Score */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="283" strokeDashoffset="28" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black text-red-500">92%</span>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Risk Score</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="inline-block px-4 py-1.5 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full font-bold uppercase text-sm tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  Critical Threat
                </span>
                <p className="text-sm text-slate-400 mt-3">High probability of phishing.</p>
              </div>
            </div>

            {/* Middle Column: Indicators */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold text-slate-200">Domain Age</span>
                  </div>
                  <p className="text-xl font-bold text-white">2 Days</p>
                  <p className="text-xs text-red-400 mt-1">Extremely suspicious</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-200">SSL Cert</span>
                  </div>
                  <p className="text-xl font-bold text-white">Let's Encrypt</p>
                  <p className="text-xs text-yellow-400 mt-1">Free DV Certificate</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Server className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold text-slate-200">Blacklist Status</span>
                  </div>
                  <p className="text-xl font-bold text-white">Flagged (3/70)</p>
                  <p className="text-xs text-red-400 mt-1">Detected by VT</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold text-slate-200">Impersonation</span>
                  </div>
                  <p className="text-xl font-bold text-white">Detected</p>
                  <p className="text-xs text-red-400 mt-1">Target: Chase Bank</p>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="p-5 bg-blue-900/20 rounded-xl border border-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4" />
                  AI Security Assessment
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  The URL exhibits multiple characteristics of a credential-harvesting phishing attack. The domain <code className="bg-slate-900 px-1 py-0.5 rounded text-red-400">secure-login-banking-update.com</code> was registered less than 48 hours ago and attempts to impersonate a financial institution. The page structure matches known login templates used in active phishing campaigns.
                </p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Recommendations</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Do not enter any credentials or personal information on this page.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Block this domain at the network level using your firewall or DNS sinkhole.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    If you already entered information, reset your banking passwords immediately from the official app.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
