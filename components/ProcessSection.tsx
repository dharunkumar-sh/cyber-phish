"use client";

import { motion } from "framer-motion";
import { Globe, Shield, Cpu, Brain, Activity, FileText } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      id: "01",
      title: "URL Submission",
      description: "User submits a suspicious URL via the dashboard, API, or browser extension.",
      icon: Globe,
      color: "text-blue-400"
    },
    {
      id: "02",
      title: "Intelligence Collection",
      description: "Gathering domain info, SSL details, WHOIS records, and checking blacklists.",
      icon: Shield,
      color: "text-cyan-400"
    },
    {
      id: "03",
      title: "Threat Analysis Engine",
      description: "Algorithms analyze keywords, impersonation attempts, and structural anomalies.",
      icon: Cpu,
      color: "text-purple-400"
    },
    {
      id: "04",
      title: "AI Security Assessment",
      description: "Large Language Models evaluate context and generate human-readable explanations.",
      icon: Brain,
      color: "text-pink-400"
    },
    {
      id: "05",
      title: "Risk Classification",
      description: "Calculating a definitive threat score: Safe, Suspicious, or Dangerous.",
      icon: Activity,
      color: "text-red-400"
    },
    {
      id: "06",
      title: "Report Generation",
      description: "A comprehensive PDF report is generated with actionable mitigation steps.",
      icon: FileText,
      color: "text-green-400"
    }
  ];

  return (
    <section id="process" className="py-24 relative bg-[#060b19]">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[var(--color-cyber-cyan)] text-sm font-semibold mb-4 tracking-wide uppercase"
          >
            Stage 2: Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            How CyberPhish <span className="text-gradient">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            A multi-layered cybersecurity pipeline that inspects, analyzes, and neutralizes threats in milliseconds.
          </motion.p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                <div className="glass-panel p-6 rounded-xl border-t-2 border-t-slate-700 hover:border-t-[var(--color-cyber-cyan)] transition-all h-full flex flex-col items-center text-center group hover:-translate-y-2 duration-300">
                  <div className={`w-16 h-16 rounded-full bg-[#020617] border border-slate-700 flex items-center justify-center mb-4 group-hover:glow-box transition-all relative`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-slate-600">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-white font-bold mb-2 text-sm">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
