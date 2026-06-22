"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight, Activity } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-cyber-blue)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-cyber-purple)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-[var(--color-cyber-cyan)]/30"
        >
          <Activity className="w-4 h-4 text-[var(--color-cyber-cyan)]" />
          <span className="text-sm font-medium text-[var(--color-cyber-cyan)]">Advanced AI Threat Detection</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-5xl mx-auto"
        >
          Detect Phishing Threats Before They <span className="text-gradient">Steal Your Data</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto"
        >
          CyberPhish Guardian uses military-grade AI and real-time threat intelligence to analyze suspicious URLs, expose hidden redirects, and generate actionable security assessments instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#analyze"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--color-cyber-blue)] to-[var(--color-cyber-purple)] rounded-lg text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-5 h-5" />
            Analyze Suspicious URL
          </a>
          <a
            href="#process"
            className="w-full sm:w-auto px-8 py-4 glass-panel rounded-lg text-white font-semibold text-lg hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 group"
          >
            See How It Works
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[var(--color-cyber-cyan)]" />
          </a>
        </motion.div>

        {/* Floating elements representing scanning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cyber-darker)] to-transparent z-10"></div>
          <div className="glass-panel p-4 rounded-xl border border-[var(--color-cyber-cyan)]/20 transform perspective-1000 rotateX-12 shadow-2xl glow-box relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--color-cyber-cyan)] shadow-[0_0_10px_#22d3ee] animate-[scan_3s_ease-in-out_infinite]"></div>
            <div className="flex items-center gap-2 border-b border-slate-700/50 pb-3 mb-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-md border border-slate-700 w-1/2">
                <span className="text-slate-400 text-xs">https://</span>
                <span className="text-slate-200 text-xs truncate">secure-login-banking-update.com/auth/verify</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-2 opacity-50">
              <div className="h-20 bg-slate-800/50 rounded border border-slate-700/50"></div>
              <div className="h-20 bg-slate-800/50 rounded border border-slate-700/50 col-span-2"></div>
              <div className="h-32 bg-slate-800/50 rounded border border-slate-700/50 col-span-3"></div>
            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </section>
  );
}
