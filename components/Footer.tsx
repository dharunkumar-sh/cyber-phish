import { Shield, Mail } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] py-12 border-t border-slate-800 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[var(--color-cyber-blue)] filter blur-[150px] opacity-5 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-8 border-b border-slate-800/60">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-[var(--color-cyber-blue)] to-[var(--color-cyber-purple)] p-[1px]">
              <div className="absolute inset-0 bg-[#020617] rounded flex items-center justify-center">
                <Shield className="w-4 h-4 text-[var(--color-cyber-cyan)]" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              CyberPhish<span className="text-[var(--color-cyber-cyan)]">Guardian</span>
            </span>
          </a>

          {/* Simple Navigation */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <a href="#features" className="text-slate-400 hover:text-[var(--color-cyber-cyan)] transition-colors">Features</a>
            <a href="#process" className="text-slate-400 hover:text-[var(--color-cyber-cyan)] transition-colors">Process</a>
            <a href="#technology" className="text-slate-400 hover:text-[var(--color-cyber-cyan)] transition-colors">Technology</a>
            <a href="#faq" className="text-slate-400 hover:text-[var(--color-cyber-cyan)] transition-colors">FAQ</a>
            <a href="#analyze" className="text-slate-400 hover:text-[var(--color-cyber-cyan)] transition-colors">Analyze URL</a>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-[var(--color-cyber-cyan)] transition-colors" aria-label="Twitter"><TwitterIcon className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-[var(--color-cyber-cyan)] transition-colors" aria-label="GitHub"><GithubIcon className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-[var(--color-cyber-cyan)] transition-colors" aria-label="LinkedIn"><LinkedinIcon className="w-5 h-5" /></a>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} CyberPhish Guardian. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
