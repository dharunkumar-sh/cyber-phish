"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link as LinkIcon, Search, ShieldCheck, Zap, Globe, Shield, Cpu,
  Brain, Activity, CheckCircle, Info, Download, Lock, Server, AlertTriangle
} from "lucide-react";

export default function WorkflowSection() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const sampleUrls = [
    { label: "Chase Login Phish", url: "http://secure-login-chase-update.com" },
    { label: "Bit.ly Redirect", url: "https://bit.ly/3x8Z9q" },
    { label: "Safe (GitHub)", url: "https://github.com" }
  ];

  const pipelineSteps = [
    { name: "URL Submitted", icon: Globe, status: "pending" },
    { name: "Domain & SSL Checked", icon: Shield, status: "pending" },
    { name: "Threat Analysis Running", icon: Cpu, status: "pending" },
    { name: "AI Assessment Generating", icon: Brain, status: "pending" },
    { name: "Threat Scoring Complete", icon: Activity, status: "pending" },
  ];

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsAnalyzing(true);
    setShowResult(false);
    setCurrentStep(1);

    // Simulate scanning pipeline
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setShowResult(true);
          return 5;
        }
        return prev + 1;
      });
    }, 500);
  };

  return (
    <section id="analyze" className="py-24 relative overflow-hidden bg-[#060b19]">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[var(--color-cyber-cyan)] text-sm font-semibold mb-4 tracking-wide uppercase"
          >
            Threat Analysis Pipeline
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Unified <span className="text-gradient">Security Control</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Witness the entire cybersecurity workflow: input your link, watch our inspection engine run in real-time, and get the risk reports instantly.
          </p>
        </div>

        {/* 3-Column Horizontal Flow Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Column 1: INPUT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl border border-[var(--color-cyber-border)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-cyber-blue)]/20 text-[var(--color-cyber-cyan)] text-sm font-bold border border-[var(--color-cyber-cyan)]/30">
                  01
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Input Scanner</h3>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Submit any target link to analyze redirection, domain age, security certificates, and attack vectors.
              </p>

              <form onSubmit={handleAnalyze} className="space-y-4 mb-6">
                <div className="relative flex items-center">
                  <LinkIcon className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste suspicious URL..."
                    className="w-full bg-[#020617] border border-slate-700 focus:border-[var(--color-cyber-cyan)] text-white text-sm rounded-lg py-4 pl-12 pr-4 outline-none transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-[var(--color-cyber-blue)] to-[var(--color-cyber-purple)] text-white font-bold py-4 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 text-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="w-4 h-4 animate-pulse text-yellow-300" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Analyze Target
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="border-t border-slate-800/80 pt-4">
              <h4 className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                Select a Quick Sample URL:
              </h4>
              <div className="flex flex-col gap-2">
                {sampleUrls.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUrl(sample.url)}
                    className="text-left text-xs bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded px-3 py-2 text-slate-300 transition-colors truncate"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 2: PROCESS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl border border-[var(--color-cyber-border)] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-cyber-blue)]/20 text-[var(--color-cyber-cyan)] text-sm font-bold border border-[var(--color-cyber-cyan)]/30">
                02
              </span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Analysis Engine</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Our backend pipelines execute reputation queries and content checking algorithms.
            </p>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {pipelineSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = isAnalyzing && currentStep >= idx + 1;
                const isCompleted = showResult || (isAnalyzing && currentStep > idx + 1);

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-green-500/10 border-green-500/30"
                        : isActive
                        ? "bg-[var(--color-cyber-blue)]/10 border-[var(--color-cyber-cyan)]/50 glow-box"
                        : "bg-slate-900/30 border-slate-800"
                    }`}
                  >
                    <div className={`p-2 rounded bg-slate-950 border ${
                      isCompleted ? "border-green-500/50" : isActive ? "border-[var(--color-cyber-cyan)]/50" : "border-slate-800"
                    }`}>
                      <StepIcon className={`w-4 h-4 ${
                        isCompleted ? "text-green-400" : isActive ? "text-[var(--color-cyber-cyan)] animate-spin" : "text-slate-500"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${isCompleted ? "text-green-400" : isActive ? "text-[var(--color-cyber-cyan)]" : "text-slate-400"}`}>
                        {step.name}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {isCompleted ? (
                        <span className="text-green-400">DONE</span>
                      ) : isActive ? (
                        <span className="text-[var(--color-cyber-cyan)]">RUNNING</span>
                      ) : (
                        <span className="text-slate-600">WAITING</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Column 3: OUTPUT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl border border-[var(--color-cyber-border)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-cyber-blue)]/20 text-[var(--color-cyber-cyan)] text-sm font-bold border border-[var(--color-cyber-cyan)]/30">
                  03
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Security Report</h3>
              </div>

              {!showResult && !isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-slate-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-400 mb-1">Awaiting Analysis</h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Input a URL on the left and run analysis to populate live threat details.
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-[var(--color-cyber-cyan)]/30 flex items-center justify-center mb-4 glow-box">
                    <Zap className="w-8 h-8 text-[var(--color-cyber-cyan)] animate-bounce" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-cyber-cyan)] mb-1">Extracting Vectors</h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Please stand by while intelligence algorithms classify components.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="text-center">
                      <span className="block text-2xl font-black text-red-500 leading-none">92%</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Risk Score</span>
                    </div>
                    <div className="border-l border-slate-800 pl-4">
                      <span className="inline-block px-2.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full uppercase tracking-wider mb-1 border border-red-500/30">
                        Critical Threat
                      </span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Suspicious domain impersonation detected. Matches Chase Bank template.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                    <h4 className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5 mb-1">
                      <Info className="w-3.5 h-3.5" />
                      AI Security Summary
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Domain age is less than 48 hours. Lacks validated domain-associated SSL configurations. High risk of malicious payload.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Indicators:</h5>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800 text-slate-300">
                        WHOIS Age: <strong className="text-red-400">2 Days</strong>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800 text-slate-300">
                        Redirects: <strong className="text-yellow-400">Found</strong>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-slate-850 space-y-2"
              >
                <button className="w-full flex items-center justify-center gap-2 bg-slate-850 hover:bg-slate-800 text-white py-3 rounded-lg text-xs transition-colors border border-slate-700">
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </button>
                <a
                  href={`/dashboard/analysis?url=${encodeURIComponent(url)}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-cyber-blue)] to-[var(--color-cyber-purple)] text-white py-3 rounded-lg text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  <Search className="w-4 h-4" />
                  Open in SOC Dashboard
                </a>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
