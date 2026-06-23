"use client";

import { useState, useEffect } from "react";
import { Shield, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Process", href: "#process" },
    { name: "Why Us", href: "#why-us" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-panel py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-cyber-blue to-cyber-purple p-px group-hover:glow-box transition-all">
            <div className="absolute inset-0 bg-cyber-darker rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyber-cyan" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-leading text-white">
            Cyber<span className="text-cyber-cyan">Phish</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-cyan transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <a
            href="/dashboard/analysis"
            className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-cyber-darker transition-all duration-300 bg-linear-to-r from-cyber-cyan to-cyber-blue rounded-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            <Search className="w-4 h-4" />
            Analyze URL
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-[rgba(34,211,238,0.1)] absolute top-full left-0 right-0"
          >
            <div className="flex flex-col space-y-4 px-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-300 hover:text-[var(--color-cyber-cyan)] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-800">
                <a
                  href="/dashboard/analysis"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-center px-6 py-3 text-sm font-semibold text-cyber-darker transition-all duration-300 bg-linear-to-r from-cyber-cyan to-cyber-blue rounded-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                >
                  <Search className="w-4 h-4" />
                  Analyze URL
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
