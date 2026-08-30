import { useState, useMemo } from 'react';
import type { Launch, CurrencyCode, ExchangeRates } from '../types';
import { formatConvertedPrice } from '../utils/currency';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { DataStatusBadge } from '../components/shared/DataStatusBadge';
import { whatsappService } from '../services/whatsappService';
import { Radar, Bookmark, ArrowRight, X, ShieldCheck, Award, Building, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  launches: Launch[];
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  savedLaunchIds: string[];
  onToggleSaveLaunch: (id: string) => void;
}

export const LaunchRadar = ({
  launches,
  selectedCurrency,
  rates,
  savedLaunchIds,
  onToggleSaveLaunch,
}: Props) => {
  const [timeframeFilter, setTimeframeFilter] = useState<string>('ALL');
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);

  const filteredLaunches = useMemo(() => {
    if (timeframeFilter === 'ALL') return launches;
    return launches.filter((l) => l.timeframe === timeframeFilter);
  }, [launches, timeframeFilter]);



  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 space-y-4 border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <Radar className="w-3.5 h-3.5 animate-pulse" />
              <span>Priority Access Pipeline</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
              Upcoming Launch Radar
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Early-stage master developer launches scheduled across Dubai's prime growth corridors.
            </p>
          </div>

          <DataStatusBadge status={launches.length > 0 ? 'LIVE' : 'UNAVAILABLE'} sourceName="Property Finder API" />
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs pt-1">
          {['ALL', 'Next 30 Days', 'Next 90 Days', 'Next Quarter'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframeFilter(tf)}
              className={`px-4 py-2 rounded-xl font-semibold border transition-all ${
                timeframeFilter === tf
                  ? 'bg-amber-600 text-stone-950 border-amber-600 shadow-sm'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-850'
              }`}
            >
              {tf === 'ALL' ? 'All Launch Windows' : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Launch Cards Grid */}
      {filteredLaunches.length === 0 ? (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl space-y-2 shadow-xs">
          <DataStatusBadge status="UNAVAILABLE" />
          <h3 className="font-serif-luxury font-bold text-lg text-stone-900">Launch radar feed currently updating</h3>
          <p className="text-xs text-stone-500">Verified master developer project announcements will render as soon as public feeds refresh.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLaunches.map((launch) => {
            const { formatted } = formatConvertedPrice(launch.startingPrice, selectedCurrency, rates);
            const isSaved = savedLaunchIds.includes(launch.id);
            const isGoldenVisa = launch.startingPrice >= 2000000;

            return (
              <div
                key={launch.id}
                onClick={() => setSelectedLaunch(launch)}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <ImageWithFallback src={launch.image} alt={launch.name} aspectRatio="hero" />
                  
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-stone-950/90 text-amber-400 font-bold rounded-lg text-[10px] uppercase border border-stone-800">
                      {launch.timeframe}
                    </span>

                    {isGoldenVisa && (
                      <span className="px-2.5 py-1 bg-amber-500 text-stone-950 font-bold rounded-lg text-[10px] uppercase flex items-center gap-1 shadow-sm">
                        <Award className="w-3 h-3" />
                        <span>Golden Visa</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveLaunch(launch.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-stone-950/80 backdrop-blur-md text-white hover:text-amber-400 border border-stone-700 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] text-amber-800 uppercase font-bold tracking-widest block">
                      {launch.area} · {launch.developer}
                    </span>
                    <h3 className="font-serif-luxury font-bold text-xl text-stone-900 mt-0.5 group-hover:text-amber-800 transition-colors">
                      {launch.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {launch.highlights.map((h, i) => (
                        <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-medium rounded-md">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Indicative Starting Price</span>
                      <span className="font-bold text-stone-900 text-base">{formatted}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLaunch(launch);
                      }}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Launch Detail Modal */}
      {selectedLaunch && (() => {
        const { formatted } = formatConvertedPrice(selectedLaunch.startingPrice, selectedCurrency, rates);
        const isGoldenVisa = selectedLaunch.startingPrice >= 2000000;
        const launchAdvisorUrl = whatsappService.getPropertyInquiryUrl(selectedLaunch.name, selectedLaunch.startingPrice.toLocaleString() + ' AED');


        return (
          <div className="fixed inset-0 z-[9999] bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0 relative animate-fadeIn my-8">
              
              {/* Image & Header */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <ImageWithFallback src={selectedLaunch.image} alt={selectedLaunch.name} aspectRatio="hero" />
                
                <button
                  onClick={() => setSelectedLaunch(null)}
                  className="absolute top-4 right-4 p-2 bg-stone-950/80 hover:bg-stone-900 text-white rounded-full transition-colors border border-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-stone-950/90 text-amber-400 font-bold rounded-lg text-xs uppercase border border-stone-800">
                    {selectedLaunch.timeframe}
                  </span>

                  {isGoldenVisa && (
                    <span className="px-3 py-1 bg-amber-500 text-stone-950 font-bold rounded-lg text-xs uppercase flex items-center gap-1.5 shadow-md">
                      <Award className="w-4 h-4" />
                      <span>UAE Golden Visa Eligible</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Title & Developer */}
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    {selectedLaunch.area} · Master Developer: {selectedLaunch.developer}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 mt-1">
                    {selectedLaunch.name}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 font-mono">
                    Status: {selectedLaunch.status} · Milestone Handover: {selectedLaunch.handover}
                  </p>
                </div>

                {/* Price & Golden Visa Highlight Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Indicative Starting Price</span>
                    <span className="text-2xl font-bold text-stone-900">{formatted}</span>
                    <p className="text-[11px] text-stone-500">Includes DLD Registration & Escrow Protections</p>
                  </div>

                  {isGoldenVisa ? (
                    <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-1">
                      <span className="text-[10px] text-amber-800 uppercase font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        <span>Golden Visa Qualified</span>
                      </span>
                      <span className="text-sm font-bold text-stone-900 block">10-Year Renewable UAE Residency</span>
                      <p className="text-[11px] text-stone-600">Qualifies automatically under DLD equity laws.</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-1">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block">Yield Projection</span>
                      <span className="text-xl font-bold text-emerald-700">{selectedLaunch.expectedYield}% Projected Net</span>
                      <p className="text-[11px] text-stone-500">Estimated rental absorption in corridor.</p>
                    </div>
                  )}
                </div>

                {/* Key Launch Highlights */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Developer Launch Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{selectedLaunch.paymentPlan}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{selectedLaunch.developer} Priority Allocation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{selectedLaunch.handover}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Official DLD Registered Escrow</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={launchAdvisorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl text-center shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Request Priority Allocation via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setSelectedLaunch(null)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors"
                  >
                    Close Dossier
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
