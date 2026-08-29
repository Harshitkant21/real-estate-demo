import { useState, useEffect } from 'react';
import type { MarketBriefReport } from '../types';
import { marketDataOrchestrator } from '../services/providers/MarketDataOrchestrator';
import { DataStatusBadge } from '../components/shared/DataStatusBadge';
import { FileText, ShieldCheck, AlertTriangle, ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface Props {
  onSelectTab: (tab: string) => void;
}

export const MarketBrief = ({ onSelectTab }: Props) => {
  const [brief, setBrief] = useState<MarketBriefReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    marketDataOrchestrator.generateMarketBrief().then((res) => {
      setBrief(res);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !brief) {
    return (
      <div className="p-16 text-center text-stone-500 space-y-3">
        <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
        <p className="text-sm font-semibold">Generating Market Brief from DLD telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Banner */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 space-y-4 border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <FileText className="w-3.5 h-3.5" />
              <span>Official Executive Intelligence Brief</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
              {brief.title}
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Comprehensive Dubai real estate market assessment compiled from DLD transaction telemetry and verified regulatory wires.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <DataStatusBadge status={brief.dataStatus} sourceName="Dubai Land Department & Open Data" />
            <span className="text-[11px] text-stone-400 font-mono">
              Generated: {brief.generatedAt}
            </span>
          </div>
        </div>

        {/* Executive Summary Quote Box */}
        <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-2">
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">
            Market Position Statement
          </span>
          <p className="text-sm sm:text-base text-stone-200 font-serif-luxury leading-relaxed italic">
            "{brief.marketPosition}"
          </p>
        </div>
      </div>

      {/* Grid: Key Changes & What Data Says */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* What Changed Recently */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif-luxury font-bold text-xl text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <span>Key Market Developments</span>
          </h3>

          <ul className="space-y-3 text-xs text-stone-700">
            {brief.keyChanges.map((change, idx) => (
              <li key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-light">{change}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Evidence Table */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif-luxury font-bold text-xl text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Telemetry Evidence</span>
          </h3>

          <div className="space-y-2">
            {brief.dataEvidence.map((ev, idx) => (
              <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900 block">{ev.metric}</span>
                  <span className="text-[10px] text-stone-500 font-mono">Source: {ev.source}</span>
                </div>
                <span className="font-bold text-amber-800 text-sm">{ev.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Areas to Watch Corridor Grid */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="font-serif-luxury font-bold text-xl text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-700" />
          <span>Prime Investment Corridors to Watch</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brief.areasToWatch.map((area, idx) => (
            <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif-luxury font-bold text-base text-stone-900">{area.area}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px]">
                  Score {area.momentumScore}/100
                </span>
              </div>
              <p className="text-xs text-stone-600 font-light leading-relaxed">{area.thesis}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Investor Takeaways & Risk Considerations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Plain Language Investor Takeaway */}
        <div className="bg-stone-950 text-white rounded-2xl p-6 space-y-4 border border-stone-850">
          <h3 className="font-serif-luxury font-bold text-lg text-amber-400 border-b border-stone-800 pb-3">
            Investor Takeaway & Capital Preservation
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            {brief.investorTakeaway}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectTab('studio')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <span>Model Strategy in Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Risk Considerations */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-serif-luxury font-bold text-lg text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Risk Factors & Disclaimers</span>
          </h3>

          <ul className="space-y-2 text-xs text-stone-600">
            {brief.riskConsiderations.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-800 font-bold">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Source Register Footer */}
      <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-600 space-y-1">
        <span className="font-bold text-stone-900 block">Source Register & Provenance Audit:</span>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-stone-500 pt-1">
          {brief.sourceRegister.map((src, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-white border border-stone-200 rounded">
              {src}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
