"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Link as LinkIcon, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export default function InputSection() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsAnalyzing(true);
    router.push(`/dashboard/analysis?url=${encodeURIComponent(url)}`);
  };

  const sampleUrls = [
    { label: "Suspicious Banking", url: "http://secure-login-chase-update.com" },
    { label: "Shortened Link", url: "https://bit.ly/3x8Z9q" },
    { label: "Safe Domain", url: "https://github.com" }
  ];

  return (
    <section id="analyze" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[var(--color-cyber-cyan)] text-sm font-semibold mb-4 tracking-wide uppercase"
          >
            Stage 1: Input
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Threat Analysis <span className="text-gradient">Engine</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Paste any suspicious URL, email link, or shortened domain. Our AI engine will instantly scan and dissect the target.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-panel p-8 md:p-12 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-cyber-cyan)] via-[var(--color-cyber-blue)] to-[var(--color-cyber-purple)]"></div>
            
            <form onSubmit={handleAnalyze} className="relative mb-8">
              <div className="relative flex items-center">
                <div className="absolute left-6 text-slate-400">
                  <LinkIcon className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/login"
                  className="w-full bg-[#020617] border border-slate-700 focus:border-[var(--color-cyber-cyan)] text-white text-lg rounded-xl py-6 pl-16 pr-40 outline-none transition-all focus:glow-box"
                  required
                />
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="absolute right-3 top-3 bottom-3 bg-[var(--color-cyber-blue)] hover:bg-[var(--color-cyber-cyan)] text-white font-bold px-8 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="w-5 h-5 animate-pulse text-yellow-300" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="border-t border-slate-800 pt-6">
              <h4 className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Try sample URLs:
              </h4>
              <div className="flex flex-wrap gap-3">
                {sampleUrls.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUrl(sample.url)}
                    className="flex items-center gap-2 text-sm bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[var(--color-cyber-cyan)]" />
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
