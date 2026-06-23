'use client';

import { Download, FileText, Printer } from 'lucide-react';

export default function ReportPreview() {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-slate-700/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="text-slate-400" />
          Security Report Preview
        </h3>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 transition-colors cursor-pointer">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium text-white shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all cursor-pointer">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white text-slate-900 p-8 rounded-lg shadow-inner max-w-4xl mx-auto border border-slate-300 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <div className="text-6xl font-black rotate-12">CONFIDENTIAL</div>
        </div>
        
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Threat Analysis Report</h1>
            <p className="text-slate-600">CyberPhish Guardian Automated Intelligence</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Analyst:</strong> Automated System</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Target Information</h2>
            <p className="text-sm"><strong>URL:</strong> [Redacted for preview]</p>
            <p className="text-sm"><strong>IP Address:</strong> 192.168.1.105 (Masked)</p>
            <p className="text-sm"><strong>ASN:</strong> Suspicious Network</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h2 className="text-lg font-bold text-red-700 mb-2">Verdict</h2>
            <p className="text-sm"><strong>Classification:</strong> Critical Phishing Threat</p>
            <p className="text-sm"><strong>Risk Score:</strong> 94 / 100</p>
            <p className="text-sm"><strong>Action Required:</strong> Immediate Block</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 border-b border-slate-300 pb-1">Executive Summary</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            The analyzed URL presents a severe risk to organizational security. Automated systems detected a high-fidelity replica of a standard corporate login page designed to harvest user credentials. Key indicators include a recently registered domain, an invalid SSL certificate masking as legitimate, and malicious form actions pointing to an external drop-zone server.
          </p>
        </div>
      </div>
    </div>
  );
}
