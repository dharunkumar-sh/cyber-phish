'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, Loader2, CheckCircle2, AlertTriangle, Link as LinkIcon } from 'lucide-react';

interface Props {
  isScanning: boolean;
  scanComplete: boolean;
  onScanInitiate: (url: string) => void;
  initialUrl?: string;
}

export default function ThreatAnalysisConsole({ isScanning, scanComplete, onScanInitiate, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl || '');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      setIsValid(true);
      onScanInitiate(url);
    } catch {
      setIsValid(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 mb-8 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">Threat Analysis Console</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Enter a suspicious URL, domain, or IP address to initiate an AI-powered deep scan for phishing threats, malware, and malicious infrastructure.
          </p>
        </div>

        <form onSubmit={handleScan} className="max-w-4xl mx-auto mb-6">
          <div className="relative group">
            <div className={`absolute -inset-0.5 rounded-xl blur opacity-75 transition duration-1000 group-hover:duration-200 ${isScanning ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500/50 to-blue-500/50 group-hover:opacity-100'}`}></div>
            <div className="relative flex items-center bg-slate-900 rounded-xl p-2">
              <LinkIcon className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
                placeholder="https://example.com/login"
                className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none focus:ring-0 placeholder-slate-500 text-lg disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isScanning || !url}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
                  isScanning 
                    ? 'bg-slate-700 cursor-not-allowed' 
                    : 'bg-cyan-600 hover:bg-cyan-500 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]'
                }`}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
          {!isValid && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-2 ml-4 flex items-center gap-1"
            >
              <AlertTriangle className="w-4 h-4" /> Please enter a valid URL.
            </motion.p>
          )}
        </form>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
          <span>Example targets:</span>
          {['paypal-secure-update.com', 'login.microsoftonline.verify.net', '192.168.1.105/auth'].map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => { setUrl(ex); setIsValid(true); }}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
