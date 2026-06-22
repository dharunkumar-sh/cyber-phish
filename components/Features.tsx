"use client";

import { motion } from "framer-motion";
import { Search, ShieldAlert, FileText, Lock, Globe, Zap, Cpu, Link } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Phishing Detection",
      description: "Machine learning models analyze page content and structures to identify zero-day phishing attempts that bypass standard blacklists.",
      icon: Cpu,
    },
    {
      title: "URL Risk Analysis",
      description: "Deep inspection of URL structures, identifying homograph attacks, suspicious subdomains, and obfuscated paths.",
      icon: Search,
    },
    {
      title: "Domain Reputation",
      description: "Real-time lookups against global threat intelligence databases to verify domain age, WHOIS records, and historical malicious activity.",
      icon: Globe,
    },
    {
      title: "SSL Certificate Validation",
      description: "Detailed inspection of SSL/TLS certificates to detect fraudulent or newly issued certificates often used by threat actors.",
      icon: Lock,
    },
    {
      title: "Malicious Redirect Detection",
      description: "Automatic tracing of URL shorteners and HTTP redirects to uncover the true destination hidden behind innocuous links.",
      icon: Link,
    },
    {
      title: "PDF Security Reports",
      description: "Generate comprehensive, shareable PDF reports detailing the threat analysis, indicators of compromise, and actionable recommendations.",
      icon: FileText,
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Advanced <span className="text-gradient">Capabilities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Built with cutting-edge technology to provide comprehensive protection against modern cyber threats.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-2xl group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-[var(--color-cyber-cyan)]/50"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-cyber-blue)] to-[var(--color-cyber-purple)] p-[1px] mb-6">
                <div className="w-full h-full bg-[#020617] rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[var(--color-cyber-cyan)]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
