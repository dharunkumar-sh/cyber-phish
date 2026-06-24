'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
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
  const [scanData, setScanData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScanInitiate = useCallback(async (url: string) => {
    setIsScanning(true);
    setScanComplete(false);
    setError(null);
    setScanData(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error?.message || resData.error || 'Failed to analyze URL');
      }
      
      setScanData(resData.data);
      setScanComplete(true);
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.4, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during scan.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    if (initialUrl) {
      const timer = setTimeout(() => {
        handleScanInitiate(initialUrl);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      setScanComplete(false);
      setScanData(null);
      setError(null);
      setIsScanning(false);
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

        {error && (
          <div className="glass-panel p-5 rounded-xl border border-red-500/30 bg-red-500/5 text-slate-300 flex items-start gap-4 animate-shake">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h4 className="text-red-400 font-bold mb-1">Scan Target Error</h4>
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {scanComplete && scanData && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <ThreatOverview 
                scan={scanData.scan} 
                intelligence={scanData.intelligence} 
              />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  <AnalysisResults 
                    scan={scanData.scan} 
                    intelligence={scanData.intelligence} 
                  />
                  <ThreatIntelligence 
                    scan={scanData.scan} 
                    intelligence={scanData.intelligence} 
                  />
                </div>
                <div className="space-y-8">
                  <AIAssistant 
                    scan={scanData.scan} 
                  />
                  <SecurityRecommendations 
                    scan={scanData.scan} 
                  />
                </div>
              </div>
              
              <ReportPreview 
                scan={scanData.scan} 
                report={scanData.report} 
              />
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
