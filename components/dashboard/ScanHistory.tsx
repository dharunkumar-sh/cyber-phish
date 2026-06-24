'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, ExternalLink, ShieldAlert, ShieldCheck, ChevronLeft, ChevronRight, Loader2, ArrowUpDown } from 'lucide-react';

export default function ScanHistory() {
  const router = useRouter();
  
  // State
  const [scans, setScans] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [threatLevel, setThreatLevel] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'risk_score'>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch scans from API
  const fetchScans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/scans?page=${page}&limit=${limit}&sort=${sortBy}&order=${order}`;
      if (debouncedSearch) {
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
      if (threatLevel) {
        url += `&threat_level=${threatLevel}`;
      }
      
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch scan history');
      }
      
      setScans(json.data || []);
      if (json.meta?.pagination) {
        setTotal(json.meta.pagination.total);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading scans.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, threatLevel, sortBy, order]);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const totalPages = Math.ceil(total / limit);

  const handleSort = (field: 'created_at' | 'risk_score') => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
    setPage(1);
  };

  const formatVerdict = (level: string) => {
    switch (level) {
      case 'safe': return { label: 'Safe', class: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' };
      case 'suspicious': return { label: 'Suspicious', class: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' };
      case 'high_risk': return { label: 'High Risk', class: 'bg-orange-500/10 text-orange-400 border border-orange-500/30' };
      case 'dangerous': return { label: 'Dangerous', class: 'bg-red-500/10 text-red-400 border border-red-500/30' };
      default: return { label: level, class: 'bg-slate-500/10 text-slate-400 border border-slate-500/30' };
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 mt-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-white">Recent Scans</h3>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Threat Level Filter Dropdown */}
          <div className="relative">
            <select
              value={threatLevel}
              onChange={(e) => { setThreatLevel(e.target.value); setPage(1); }}
              className="appearance-none bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">All Verdicts</option>
              <option value="safe">Safe</option>
              <option value="suspicious">Suspicious</option>
              <option value="high_risk">High Risk</option>
              <option value="dangerous">Dangerous</option>
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Scans Table */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto border border-slate-700/50 rounded-lg relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        )}
        
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-800/80 border-b border-slate-700/50">
            <tr>
              <th className="px-4 py-3">Scan ID</th>
              <th className="px-4 py-3">Target URL</th>
              <th 
                className="px-4 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Date / Time
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3">Verdict</th>
              <th 
                className="px-4 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('risk_score')}
              >
                <div className="flex items-center gap-1">
                  Risk Score
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {scans.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No scans found in database matching criteria.
                </td>
              </tr>
            ) : (
              scans.map((row) => {
                const verdict = formatVerdict(row.threatLevel);
                const isSafe = row.threatLevel === 'safe';
                
                return (
                  <tr key={row.id} className="hover:bg-slate-800/30 transition-colors bg-slate-900/20">
                    <td className="px-4 py-3 font-mono text-cyan-400 text-xs">
                      SCN-{row.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-[240px] truncate" title={row.url}>
                      {row.url}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(row.createdAt).toLocaleString(undefined, {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded text-xs ${verdict.class}`}>
                        {isSafe ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        {verdict.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${row.riskScore > 75 ? 'bg-red-500' : row.riskScore > 50 ? 'bg-orange-500' : row.riskScore > 25 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                            style={{ width: `${row.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-300">{row.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => router.push(`/dashboard/reports?scanId=${row.id}`)}
                        className="text-slate-400 hover:text-cyan-400 transition-colors p-1 rounded hover:bg-slate-800 cursor-pointer" 
                        title="View Report"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80">
          <p className="text-xs text-slate-500">
            Showing <span className="text-slate-300 font-medium">{Math.min(total, (page - 1) * limit + 1)}</span> to{' '}
            <span className="text-slate-300 font-medium">{Math.min(total, page * limit)}</span> of{' '}
            <span className="text-slate-300 font-medium">{total}</span> scans
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-1.5 bg-slate-800 border border-slate-700 rounded-md text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, idx) => {
              const pNum = idx + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  disabled={isLoading}
                  className={`px-3 py-1 text-xs rounded-md font-medium border transition-colors cursor-pointer ${
                    page === pNum
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="p-1.5 bg-slate-800 border border-slate-700 rounded-md text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
