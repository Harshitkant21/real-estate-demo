import type { MarketMetrics, NewsItem, CurrencyCode, ExchangeRates } from '../types';
import { DataStatusBadge } from '../components/shared/DataStatusBadge';
import { SourceRegister } from '../components/shared/SourceRegister';
import { marketMetricsEngine } from '../services/marketMetricsEngine';
import { formatConvertedPrice } from '../utils/currency';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface Props {
  marketMetrics: MarketMetrics | null;
  newsItems: NewsItem[];
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  onSelectTab: (tab: string) => void;
}

export const MarketIntelligence = ({
  marketMetrics,
  selectedCurrency,
  rates,
  onSelectTab,
}: Props) => {
  if (!marketMetrics) {
    return <div className="p-12 text-center text-stone-500">Loading Dubai Land Department market data...</div>;
  }

  const { metadata, areaSentiments, historicalYieldsByArea } = marketMetrics;
  const sentiment = marketMetricsEngine.getMarketSentiment();

  const yieldChartData = historicalYieldsByArea.map((item) => {
    const { formatted } = formatConvertedPrice(item.priceSqft, selectedCurrency, rates);
    return {
      area: item.area,
      yieldPercent: item.yieldPercent,
      priceSqftFormatted: formatted,
    };
  });

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Banner */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 space-y-4 border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Official Dubai Market Telemetry & Sentiment Engine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
              Dubai Real Estate Intelligence Hub
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Understand what is changing in Dubai real estate before you decide where to invest.
            </p>
          </div>

          <DataStatusBadge
            status={metadata.dataStatus}
            sourceName={metadata.source}
            lastUpdated={metadata.lastUpdated}
          />
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
            <span>Overall DLD Market Index:</span>
            <span className="font-bold text-amber-400 text-base">{marketMetrics.overallScore} / 100</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold text-[10px]">
              {marketMetrics.marketOutlook}
            </span>
          </div>

          <button
            onClick={() => onSelectTab('brief')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
          >
            <span>Read MITTAL & CO. Market Brief</span>

            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Market Sentiment Engine Section */}
      <section className="bg-stone-950 text-white rounded-2xl p-5 sm:p-8 space-y-6 border border-stone-850 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-850 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
              Market Sentiment Engine
            </span>
            <h2 className="font-serif-luxury font-bold text-xl sm:text-2xl text-white">
              Current Dubai Stance: {sentiment.score} / 100 ({sentiment.label})
            </h2>
          </div>

          <DataStatusBadge status={sentiment.dataStatus} sourceName="MITTAL & CO. Derived Scoring Engine" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 bg-stone-900 rounded-xl border border-stone-800 space-y-3">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4" /> Bullish Drivers Behind Sentiment
            </span>
            <ul className="space-y-2 text-stone-300">
              {sentiment.whyDrivers.map((driver, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-stone-900 rounded-xl border border-stone-800 space-y-3">
            <span className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
              <FileText className="w-4 h-4" /> Market Considerations & Watchpoints
            </span>
            <ul className="space-y-2 text-stone-300">
              {sentiment.keyRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Community Momentum Breakdown */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
              Area Momentum & Investment Signals
            </h2>
            <p className="text-xs text-stone-500">Official DLD sales price/sqft indices and community absorption rates</p>
          </div>
          <DataStatusBadge status="RECENT" sourceName="DLD Open Data" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {areaSentiments.map((area, idx) => {
            const { formatted } = formatConvertedPrice(area.avgPriceSqftAED, selectedCurrency, rates);
            return (
              <div key={idx} className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                  <span className="font-serif-luxury font-bold text-lg text-stone-900">{area.areaName}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Score {area.sentimentScore}/100
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Average Price / sqft:</span>
                    <span className="font-bold text-stone-900">{formatted}</span>
                  </div>
                  <p className="text-stone-500 font-light text-[11px] leading-relaxed pt-1">
                    {area.keyDriver}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Net Rental Yields Chart */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
              Net Rental Yields by Community
            </h2>
            <p className="text-xs text-stone-500">Average net rental return per annum adjusted for service fees</p>
          </div>
          <DataStatusBadge status="RECENT" sourceName="Official Rental Index" />
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yieldChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="area" tick={{ fontSize: 11 }} />
              <YAxis domain={[5, 9]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [`${val}% Net Yield`, 'Rental Yield']}
                contentStyle={{ backgroundColor: '#111419', borderColor: '#C5A059', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="yieldPercent" fill="#C5A059" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transparent Source Register Table */}
      <SourceRegister />

    </div>
  );
};
