'use client';

import { 
  LayoutDashboard, 
  ShieldAlert, 
  History, 
  FileText, 
  Activity, 
  Settings, 
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'URL Analysis', icon: ShieldAlert, path: '/dashboard/analysis' },
  { name: 'Scan History', icon: History, path: '/dashboard/history' },
  { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
  { name: 'Threat Intelligence', icon: Activity, path: '/dashboard/intelligence' },
];

const bottomNavItems = [
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-full glass-panel border-r border-cyan-500/20 flex flex-col relative z-20 shrink-0">
      <div className="h-20 flex items-center justify-center border-b border-cyan-500/20">
        <Link href="/" className="flex items-center gap-3 px-4 w-full cursor-pointer group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 glow-box shrink-0 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-6 h-6" />
          </div>
          <div className="font-bold text-lg whitespace-nowrap">
            <span className="text-white">Cyber</span>
            <span className="text-cyan-400">Phish</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          return (
            <Link key={item.name} href={item.path}>
              <div
                className={`flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] text-cyan-400' : 'group-hover:text-cyan-400'}`} />
                <span className="ml-3 font-medium truncate">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-cyan-500/20 flex flex-col gap-2">
        {bottomNavItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <div className="flex items-center px-3 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 cursor-pointer transition-all duration-200 group">
              <item.icon className="w-5 h-5 shrink-0 group-hover:text-purple-400" />
              <span className="ml-3 font-medium truncate">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
