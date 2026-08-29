import { useState } from 'react';
import type { Launch, CurrencyCode, ExchangeRates } from '../types';
import { formatConvertedPrice } from '../utils/currency';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { whatsappService } from '../services/whatsappService';
import { Radar, Building, MessageSquare, CheckCircle2, Bookmark } from 'lucide-react';

interface Props {
  launches: Launch[];
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  savedLaunchIds: string[];
  onToggleSaveLaunch: (id: string) => void;
}

export const LaunchRadar: React.FC<Props> = ({
  launches,
  selectedCurrency,
  rates,
  savedLaunchIds,
  onToggleSaveLaunch,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('All');

  const filteredLaunches = launches.filter((l) => {
    if (selectedTimeframe === 'All') return true;
    return l.timeframe === selectedTimeframe;
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 border border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Radar className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
              Upcoming Launch Radar
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Priority allocation and VIP registration for unreleased Dubai master plans.
            </p>
          </div>
        </div>

        {/* Timeframe Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-800 text-xs">
          {['All', 'Next 30 Days', 'Next 90 Days', 'Next Quarter'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Launch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLaunches.map((launch) => {
          const { formatted } = formatConvertedPrice(launch.startingPrice, selectedCurrency, rates);
          const whatsappUrl = whatsappService.getLaunchVipUrl(launch, formatted);
          const isSaved = savedLaunchIds.includes(launch.id);

          return (
            <div key={launch.id} className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="relative">
                <ImageWithFallback
                  src={launch.image}
                  alt={launch.name}
                  aspectRatio="card"
                  className="group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-amber-400 backdrop-blur-sm shadow pointer-events-auto">
                    {launch.timeframe}
                  </span>

                  <button
                    onClick={() => onToggleSaveLaunch(launch.id)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all shadow pointer-events-auto ${
                      isSaved ? 'bg-amber-600 text-white' : 'bg-stone-900/60 text-stone-200 hover:bg-stone-900'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span>{launch.area}</span>
                    <span className="flex items-center gap-1 font-semibold text-stone-700">
                      <Building className="w-3 h-3 text-stone-400" /> {launch.developer}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif-luxury font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {launch.name}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1">
                    {launch.propertyType} · Plan: {launch.paymentPlan} · Completion: {launch.handover}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-stone-900">From {formatted}</span>
                    {launch.expectedYield && (
                      <span className="text-xs font-bold text-amber-800">({launch.expectedYield}% Est. Yield)</span>
                    )}
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 pt-3 border-t border-stone-100 text-xs">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">Launch Highlights</span>
                  {launch.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="pt-2 border-t border-stone-100">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Get VIP Launch Pack on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
