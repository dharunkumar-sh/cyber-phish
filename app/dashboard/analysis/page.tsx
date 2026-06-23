'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import ThreatAnalysisConsole from '@/components/dashboard/ThreatAnalysisConsole';
import ThreatOverview from '@/components/dashboard/ThreatOverview';
import AnalysisResults from '@/components/dashboard/AnalysisResults';
import ThreatIntelligence from '@/components/dashboard/ThreatIntelligence';
import SecurityRecommendations from '@/components/dashboard/SecurityRecommendations';
import AIAssistant from '@/components/dashboard/AIAssistant';
import ScanTimeline from '@/components/dashboard/ScanTimeline';
import ReportPreview from '@/components/dashboard/ReportPreview';

function AnalysisContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScanInitiate = useCallback((url: string) => {
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate scan duration
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.4, behavior: 'smooth' });
      }, 100);
    }, 5500);
  }, []);

  useEffect(() => {
    if (initialUrl) {
      const timer = setTimeout(() => {
        handleScanInitiate(initialUrl);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialUrl, handleScanInitiate]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="border-b border-cyan-500/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Threat Analysis Console</h2>
          <p className="text-slate-400 text-sm font-medium">Inspect suspicious hosts, domains, SSL structures, and credential harvesting kits.</p>
        </div>

        <ThreatAnalysisConsole 
          isScanning={isScanning} 
          scanComplete={scanComplete}
          onScanInitiate={handleScanInitiate} 
          initialUrl={initialUrl}
        />
        
        <ScanTimeline isScanning={isScanning} scanComplete={scanComplete} />

        <AnimatePresence>
          {scanComplete && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <ThreatOverview />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  <AnalysisResults />
                  <ThreatIntelligence />
                </div>
                <div className="space-y-8">
                  <AIAssistant />
                  <SecurityRecommendations />
                </div>
              </div>
              
              <ReportPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default function ThreatAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cyber-darker text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-sm text-cyan-400">Loading Threat Console...</p>
      </div>
    }>
      <AnalysisContent />
    </Suspense>
  );
}
