import type { Property, Launch, CurrencyCode, ExchangeRates, MarketMetrics } from '../types';
import { formatConvertedPrice } from '../utils/currency';
import { PropertyCard } from '../components/property/PropertyCard';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { AskAMAdvisor } from '../components/ai/AskAMAdvisor';
import { whatsappService } from '../services/whatsappService';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  Calculator,
  Compass,
  Radar,
} from 'lucide-react';

interface Props {
  properties: Property[];
  launches: Launch[];
  marketMetrics: MarketMetrics | null;
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onSelectTab: (tab: string) => void;
}

export const Home = ({
  properties,
  launches,
  marketMetrics,
  selectedCurrency,
  rates,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onSelectTab,
}: Props) => {
  const featuredProperties = properties.filter((p) => p.status === 'Featured' || p.status === 'Off-Plan').slice(0, 3);
  const advisorUrl = whatsappService.getGeneralAdvisorUrl();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Cinematic Luxury Hero Section */}
      <section className="relative bg-stone-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-850">
        <div className="absolute inset-0 z-0 opacity-45">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85"
            alt="Dubai Luxury Waterfront Architecture"
            aspectRatio="hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dubai Real Estate, Intelligently Invested</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-luxury font-bold tracking-tight text-stone-100 leading-tight">
            Curated Waterfront & Off-Plan Investment Dossiers
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            AM Estates delivers private wealth advisory, developer track record intelligence, and ROI-modeled property opportunities across Dubai's prime corridors.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onSelectTab('explore')}
              className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Opportunities</span>
            </button>

            <a
              href={advisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-stone-900/90 hover:bg-stone-850 text-stone-200 border border-stone-700 font-semibold text-xs rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <span>Speak to an Advisor</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Dubai Market Today (Official DLD Open Data) */}
      {marketMetrics && (
        <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-700" />
              <div>
                <h2 className="font-serif-luxury font-bold text-xl text-stone-900">
                  Dubai Market Today
                </h2>
                <p className="text-xs text-stone-500">Official Dubai Land Department (DLD) open data telemetry</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold">
                {marketMetrics.marketOutlook} · Score {marketMetrics.overallScore}/100
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-stone-500 text-[11px]">
                Updated: {marketMetrics.metadata.lastUpdated}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">DLD Price Index Growth</span>
              <span className="text-xl font-bold text-emerald-700">+{marketMetrics.priceMomentumPercent}% YoY</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">DLD 24h Transaction Index</span>
              <span className="text-xl font-bold text-stone-900">+{marketMetrics.transactionVolumeYoY}% YoY</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Avg Net Rental Yield</span>
              <span className="text-xl font-bold text-amber-800">{marketMetrics.rentalYieldAvg}% Net</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Golden Visa Rule</span>
              <span className="text-xl font-bold text-stone-900">AED 2M+ Threshold</span>
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Opportunities */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
              Featured Dubai Dossiers
            </h2>
            <p className="text-xs text-stone-500">
              Curated off-plan and waterfront developments with verified investment metrics.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('explore')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900"
          >
            <span>View All ({properties.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              selectedCurrency={selectedCurrency}
              rates={rates}
              isSaved={savedPropertyIds.includes(prop.id)}
              onToggleSave={onToggleSave}
              onSelectProperty={onSelectProperty}
              onOpenStudio={() => onSelectTab('studio')}
            />
          ))}
        </div>
      </section>

      {/* 4. Upcoming Launch Radar */}
      <section className="bg-stone-950 text-stone-100 rounded-3xl p-6 sm:p-10 space-y-6 border border-stone-850 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Radar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
                Upcoming Launch Radar
              </h2>
              <p className="text-xs text-stone-400">
                Priority access projects launching in the next 30 to 90 days.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('launches')}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Full Radar →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {launches.slice(0, 2).map((launch) => {
            const { formatted } = formatConvertedPrice(launch.startingPrice, selectedCurrency, rates);
            return (
              <div key={launch.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <ImageWithFallback src={launch.image} alt={launch.name} aspectRatio="square" />
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <span className="px-2 py-0.5 bg-amber-900/60 text-amber-300 rounded text-[10px] font-semibold uppercase">
                    {launch.timeframe}
                  </span>
                  <h4 className="font-serif-luxury font-bold text-base text-white line-clamp-1">
                    {launch.name}
                  </h4>
                  <p className="text-stone-400">{launch.area} · {launch.developer}</p>
                  <p className="font-bold text-amber-400 pt-1">From {formatted}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Investment Calculator CTA */}
      <section className="dark-panel rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Calculator className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-stone-100">
            Model Your Return in the Investment Calculator
          </h2>

          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            Simulate custom scenarios covering upfront initial investments, milestone payment plans, estimated rental income, and projected 5-year capital appreciation.
          </p>

          <button
            onClick={() => onSelectTab('studio')}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors inline-flex items-center gap-2"
          >
            <span>Launch Investment Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Ask AM AI Intelligence Advisor */}
      <section>
        <AskAMAdvisor
          selectedCurrency={selectedCurrency}
          rates={rates}
          onSelectPropertyByName={(name) => {
            const found = properties.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
            if (found) onSelectProperty(found);
          }}
        />
      </section>

    </div>
  );
};
