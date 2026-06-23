"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "How accurate is the phishing detection AI?",
      answer: "Our machine learning models are trained on millions of confirmed phishing and benign URLs, achieving a 99.2% detection rate with near-zero false positives. The models are updated daily to catch zero-day threats."
    },
    {
      question: "Does CyberPhish store my personal data?",
      answer: "No. We only analyze the submitted URL and its public-facing metadata. We do not track users, store personal information, or intercept any traffic other than the URL structure and domain intel you submit for scanning."
    },
    {
      question: "How long does a URL analysis take?",
      answer: "A standard scan takes approximately 450-800 milliseconds. Deep structural scans involving headless browser rendering and AI language model assessment may take up to 3 seconds."
    },
    {
      question: "Can I integrate this into my company's infrastructure?",
      answer: "Yes, we offer enterprise API access and browser extensions that can be deployed organization-wide to automatically block malicious domains at the network level."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel border border-slate-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-[var(--color-cyber-cyan)] transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
