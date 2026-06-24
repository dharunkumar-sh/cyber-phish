"use client";

import { motion } from "framer-motion";
import { UserX, CreditCard, Link as LinkIcon, Smartphone } from "lucide-react";
import Link from "next/link";

export default function WhySection() {
  const attacks = [
    {
      title: "Credential Harvesting",
      description: "Fake login pages designed to steal your usernames, passwords, and 2FA tokens.",
      icon: UserX,
      color: "text-red-400"
    },
    {
      title: "Financial Fraud",
      description: "Impersonated banking sites attempting to steal credit card details and bank accounts.",
      icon: CreditCard,
      color: "text-orange-400"
    },
    {
      title: "Malicious Redirects",
      description: "Legitimate-looking links that invisibly route you to malware-hosting domains.",
      icon: LinkIcon,
      color: "text-yellow-400"
    },
    {
      title: "Smishing & Social Engineering",
      description: "Deceptive SMS messages and emails creating false urgency to click dangerous links.",
      icon: Smartphone,
      color: "text-purple-400"
    }
  ];

  return (
    <section id="why-us" className="py-24 relative bg-[#060b19] border-y border-slate-800">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Why You Need <span className="text-gradient">CyberPhish</span>??
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg mb-8 leading-relaxed"
            >
              Cybercriminals are deploying increasingly sophisticated attacks that bypass traditional email filters and antivirus software. A single wrong click can lead to catastrophic data breaches, financial loss, and identity theft.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/dashboard/analysis"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-all duration-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg"
              >
                Start Analyzing URLs Free
              </Link>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {attacks.map((attack, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-cyber-darker p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors"
              >
                <attack.icon className={`w-8 h-8 ${attack.color} mb-4`} />
                <h3 className="text-lg font-bold text-white mb-2">{attack.title}</h3>
                <p className="text-sm text-slate-400">{attack.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
