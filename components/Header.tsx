'use client';

import { Search, ShieldPlus } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 glass-panel border-b border-cyan-500/20 px-6 flex items-center justify-between z-10 shrink-0 sticky top-0">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-400 focus:outline-none focus:bg-slate-900 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 sm:text-sm transition-all duration-300"
            placeholder="Search URLs, domains, or hashes..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium text-sm transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] cursor-pointer">
          <ShieldPlus className="w-4 h-4" />
          <span className="hidden sm:inline">New Scan</span>
        </button>
      </div>
    </header>
  );
}
