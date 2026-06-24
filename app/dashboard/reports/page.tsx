'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ReportPreview from '@/components/dashboard/ReportPreview';
import { FileText, ChevronRight, Loader2, ArrowRight } from 'lucide-react';

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scanIdParam = searchParams.get('scanId');

  const [reportsList, setReportsList] = useState<any[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [activeScan, setActiveScan] = useState<any>(null);
  const [activeReport, setActiveReport] = useState<any>(null);
  
  const [isListLoading, setIsListLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch report list
  useEffect(() => {
    async function fetchReports() {
      setIsListLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/reports?limit=20');
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to load reports');
        }
        
        const list = json.data || [];
        setReportsList(list);

        // If list is not empty, decide which scan to select
        if (list.length > 0) {
          const matchParam = list.find((r: any) => r.scanId === scanIdParam);
          const initialScanId = matchParam ? matchParam.scanId : list[0].scanId;
          setSelectedScanId(initialScanId);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error fetching reports list');
      } finally {
        setIsListLoading(false);
      }
    }
    fetchReports();
  }, [scanIdParam]);

  // Fetch details for selected scan/report
  useEffect(() => {
    if (!selectedScanId) return;

    async function fetchDetail() {
      setIsDetailLoading(true);
      try {
        const res = await fetch(`/api/scans/${selectedScanId}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to fetch report details');
        }
        
        setActiveScan(json.data.scan);
        setActiveReport(json.data.report);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDetailLoading(false);
      }
    }
    fetchDetail();
  }, [selectedScanId]);

  const getBadgeClass = (level: string) => {
    switch (level) {
      case 'dangerous': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'high_risk': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'suspicious': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  const getVerdictLabel = (level: string) => {
    switch (level) {
      case 'dangerous': return 'Dangerous';
      case 'high_risk': return 'High Risk';
      case 'suspicious': return 'Suspicious';
      default: return 'Safe';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="border-b border-cyan-500/10 pb-4 print:hidden">
          <h2 className="text-2xl font-bold text-white">Vulnerability Reports</h2>
          <p className="text-slate-400 text-sm">Review, print, or export generated PDF vulnerability reports for target sites.</p>
        </div>

        {isListLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 print:hidden">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="text-slate-400 text-sm font-mono">Loading reports vault...</p>
          </div>
        ) : error ? (
          <div className="p-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl print:hidden">
            {error}
          </div>
        ) : reportsList.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center max-w-2xl mx-auto mt-12 print:hidden">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Reports Generated Yet</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Before you can view security assessments, you must scan a suspicious host or URL. Our automated intelligence engine will write details here.
            </p>
            <button
              onClick={() => router.push('/dashboard/analysis')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
            >
              Analyze Your First URL <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar List (hidden on print) */}
            <div className="lg:col-span-4 space-y-4 print:hidden">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Scans ({reportsList.length})</h3>
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin">
                {reportsList.map((r: any) => {
                  const isSelected = r.scanId === selectedScanId;
                  const isSafe = r.threatLevel === 'safe';

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedScanId(r.scanId)}
                      className={`glass-panel p-4 rounded-xl cursor-pointer transition-all border group flex items-center justify-between ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                          : 'border-slate-800 hover:border-slate-700 hover:bg-white/5'
                      }`}
                    >
                      <div className="space-y-2 max-w-[85%]">
                        <h4 className="font-bold text-slate-200 truncate group-hover:text-white transition-colors" title={r.domain}>
                          {r.domain}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getBadgeClass(r.threatLevel)}`}>
                            {getVerdictLabel(r.threatLevel)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Score: <strong className={isSafe ? 'text-emerald-400' : 'text-red-400'}>{r.riskScore}</strong>
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Report Preview */}
            <div className="lg:col-span-8 relative">
              {isDetailLoading && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl min-h-[400px]">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              )}
              {activeScan && activeReport ? (
                <ReportPreview scan={activeScan} report={activeReport} />
              ) : (
                <div className="glass-panel p-12 rounded-2xl text-center min-h-[400px] flex flex-col justify-center items-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
                  <p className="text-slate-400 text-sm">Fetching report details...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cyber-darker text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-sm text-cyan-400">Loading Reports Vault...</p>
      </div>
    }>
      <ReportsContent />
    </Suspense>
  );
}
