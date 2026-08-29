import type { MarketMetrics, CurrencyCode, ExchangeRates } from '../types';
import { formatConvertedPrice } from '../utils/currency';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { Info, Sparkles, Activity } from 'lucide-react';

interface Props {
  marketMetrics: MarketMetrics | null;
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
}

export const MarketIntelligence = ({ marketMetrics, selectedCurrency, rates }: Props) => {
  if (!marketMetrics) {
    return <div className="p-12 text-center text-stone-500">Loading Dubai Land Department telemetry...</div>;
  }

  const { metadata, overallScore, marketOutlook, areaSentiments, sentimentDrivers, historicalYieldsByArea } =
    marketMetrics;

  const chartData = historicalYieldsByArea.map((item) => {
    const { formatted } = formatConvertedPrice(item.priceSqft, selectedCurrency, rates);
    return {
      area: item.area,
      yieldPercent: item.yieldPercent,
      priceSqftFormatted: formatted,
      priceSqftRaw: item.priceSqft,
    };
  });

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Panel */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 space-y-6 border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official DLD Open Data Portal Feed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white">
              Dubai Real Estate Market Trends
            </h1>
          </div>

          {/* Telemetry Status Badge */}
          <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-semibold text-stone-200">{metadata.dataStatus}</span>
            </div>
            <p className="text-[10px] text-stone-400">
              Source: {metadata.source} · Updated: {metadata.lastUpdated}
            </p>
          </div>
        </div>

        {/* Core KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-stone-400">Deterministic Market Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-400">{overallScore}</span>
              <span className="text-xs text-emerald-400 font-semibold">/ 100 ({marketOutlook})</span>
            </div>
          </div>

          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-stone-400">DLD Price Index YoY</span>
            <span className="block text-2xl font-bold text-emerald-400 mt-1">
              +{marketMetrics.priceMomentumPercent}% YoY
            </span>
          </div>

          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-stone-400">Transaction Volume Index</span>
            <span className="block text-2xl font-bold text-white mt-1">
              +{marketMetrics.transactionVolumeYoY}% YoY
            </span>
          </div>

          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-stone-400">Avg Net Rental Yield</span>
            <span className="block text-2xl font-bold text-amber-400 mt-1">
              {marketMetrics.rentalYieldAvg}% Net
            </span>
          </div>
        </div>
      </div>

      {/* Yield & Price/sqft Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Yield by Area Chart */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-stone-900">
                Average Net Rental Yield by Area
              </h3>
              <p className="text-xs text-stone-500">Official DLD rental index averages across prime Dubai hubs</p>
            </div>
            <span className="text-xs font-bold text-amber-800">DLD Telemetry</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="area" tick={{ fontSize: 10 }} interval={0} />
                <YAxis domain={[5, 9]} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}% Net Yield`, 'Est. Yield']}
                  contentStyle={{ backgroundColor: '#111419', borderColor: '#C5A059', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="yieldPercent" fill="#C5A059" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price/sqft Comparison */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-stone-900">
                Average Price / Sqft Benchmark
              </h3>
              <p className="text-xs text-stone-500">Converted in selected currency ({selectedCurrency})</p>
            </div>
            <span className="text-xs font-bold text-stone-700">{selectedCurrency} Values</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="area" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(_val: any, _name: any, item: any) => [item.payload.priceSqftFormatted, 'Price / sqft']}
                  contentStyle={{ backgroundColor: '#111419', borderColor: '#C5A059', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="priceSqftRaw" stroke="#111419" strokeWidth={2} dot={{ fill: '#C5A059' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Area Mood & Absorption Grid */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif-luxury font-bold text-lg text-stone-900">
              Dubai Hub Demand & Market Mood
            </h3>
            <p className="text-xs text-stone-500">DLD registration volume and area-level absorption indicators</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-xs font-semibold">
            {metadata.dataStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areaSentiments.map((area, idx) => (
            <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif-luxury font-bold text-base text-stone-900">{area.areaName}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    area.status === 'Positive' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {area.status} ({area.sentimentScore}/100)
                </span>
              </div>
              <p className="text-xs text-stone-600 font-light">{area.keyDriver}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official DLD Drivers */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 space-y-4 border border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Info className="w-4 h-4" />
          <span>Official DLD Telemetry Drivers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sentimentDrivers.map((driver, idx) => (
            <div key={idx} className="p-3 bg-stone-800/80 rounded-lg text-xs text-stone-300 border border-stone-700 flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>{driver}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
