import { useState, useEffect } from 'react';
import type { MarketBriefReport } from '../types';
import { marketDataOrchestrator } from '../services/providers/MarketDataOrchestrator';
import { DataStatusBadge } from '../components/shared/DataStatusBadge';
import { SourceRegister } from '../components/shared/SourceRegister';
import { whatsappService } from '../services/whatsappService';
import { FileText, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

interface Props {
  onSelectTab?: (tab: string) => void;
}

export const MarketBrief = ({ onSelectTab: _onSelectTab }: Props) => {
  const [brief, setBrief] = useState<MarketBriefReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBrief() {
      try {
        const report = await marketDataOrchestrator.generateMarketBrief();
        setBrief(report);
      } catch (err) {
        console.error('Market Brief generation error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBrief();
  }, []);

  const advisorUrl = whatsappService.getGeneralAdvisorUrl();

  if (isLoading || !brief) {
    return <div className="p-12 text-center text-stone-500">Generating Mittalco Market Brief...</div>;
  }

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      
      {/* Editorial Header */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 space-y-4 border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <FileText className="w-3.5 h-3.5" />
              <span>Private Wealth Research Note</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
              {brief.title}
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Executive research brief combining DLD open telemetry, news signals, and AI interpretation.
            </p>
          </div>

          <DataStatusBadge status={brief.dataStatus} sourceName="MITTALCO Research Desk" lastUpdated={brief.generatedAt} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <span className="text-stone-300 font-mono">Report Date: {brief.generatedAt}</span>
          <a
            href={advisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Discuss Research with Advisor</span>
          </a>
        </div>
      </div>

      {/* Market Position & Stance */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="font-serif-luxury font-bold text-xl text-stone-900 border-b border-stone-100 pb-2">
          1. Current Market Position
        </h2>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
          {brief.marketPosition}
        </p>
      </div>

      {/* Verified Key Developments */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="font-serif-luxury font-bold text-xl text-stone-900 border-b border-stone-100 pb-2">
          2. What Changed Recently
        </h2>
        <div className="space-y-2">
          {brief.keyChanges.map((change, i) => (
            <div key={i} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 flex items-start gap-2">
              <span className="text-amber-800 font-bold">•</span>
              <span>{change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Evidence Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="font-serif-luxury font-bold text-xl text-stone-900 border-b border-stone-100 pb-2">
          3. What the Telemetry Data Says
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-stone-200 text-[10px] uppercase font-bold text-stone-400">
                <th className="py-2">Metric Indicator</th>
                <th className="py-2">Value</th>
                <th className="py-2">Official Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {brief.dataEvidence.map((ev, i) => (
                <tr key={i} className="text-stone-700">
                  <td className="py-2.5 font-semibold text-stone-900">{ev.metric}</td>
                  <td className="py-2.5 font-bold text-amber-800">{ev.value}</td>
                  <td className="py-2.5 text-stone-500 font-mono text-[11px]">{ev.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prime Corridors to Watch */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="font-serif-luxury font-bold text-xl text-stone-900 border-b border-stone-100 pb-2">
          4. Areas to Watch & Momentum
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {brief.areasToWatch.map((item, i) => (
            <div key={i} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-stone-900">
                <span>{item.area}</span>
                <span className="text-emerald-700">Score {item.momentumScore}/100</span>
              </div>
              <p className="text-stone-600 text-[11px] font-light">{item.thesis}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Investor Takeaway & Risks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div className="p-6 bg-stone-950 text-white rounded-2xl border border-stone-850 space-y-3">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
            <ShieldCheck className="w-4 h-4" /> Investor Takeaway
          </span>
          <p className="text-stone-300 leading-relaxed font-light text-[11px]">
            {brief.investorTakeaway}
          </p>
        </div>

        <div className="p-6 bg-stone-950 text-white rounded-2xl border border-stone-850 space-y-3">
          <span className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
            <AlertCircle className="w-4 h-4" /> Risk Considerations
          </span>
          <ul className="space-y-1.5 text-stone-300 text-[11px]">
            {brief.riskConsiderations.map((risk, i) => (
              <li key={i}>• {risk}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Source Register Table */}
      <SourceRegister />

    </div>
  );
};
