import React from 'react';
import { Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HeroBanner({ onBrowseClick, onOpenEnquiry }) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white overflow-hidden py-10 md:py-14 px-4 border-b border-teal-900/40">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Vital Medex • Direct Wholesale & Global Exports</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Vital Medex
            <span className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-teal-300 mt-1">
              Pharmaceutical Supply & Global Distribution
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Leading wholesale exporter of certified tablets, capsules, injections, oncology medications, and specialized pharmaceuticals. Browse our product list below and click <strong>"Enquiry Now"</strong> for instant pricing.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-teal-200">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              sales@vitalmedex.com
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              WHO-GMP & Batch Certified
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
