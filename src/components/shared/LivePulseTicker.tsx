import type { MarketMetrics } from '../../types';
import { DataStatusBadge } from './DataStatusBadge';

interface Props {
  marketMetrics: MarketMetrics | null;
  onSelectTab?: (tab: string) => void;
}

export const LivePulseTicker = ({ marketMetrics, onSelectTab }: Props) => {
  if (!marketMetrics) return null;

  const tickerItems = [
    {
      title: 'Palm Jemeirah Benchmark',
      metric: 'AED 3,600 / sqft',
      change: '+7.2% Net Yield',
      status: marketMetrics.metadata.dataStatus,
      source: marketMetrics.metadata.source,
    },
    {
      title: 'DLD Sales Volume Index',
      metric: `+${marketMetrics.transactionVolumeYoY}% YoY`,
      change: '24h Registration Volume',
      status: marketMetrics.metadata.dataStatus,
      source: marketMetrics.metadata.source,
    },
    {
      title: 'Palm Jebel Ali Frond Momentum',
      metric: '+44.5% YoY',
      change: 'AED 2,800 / sqft',
      status: marketMetrics.metadata.dataStatus,
      source: marketMetrics.metadata.source,
    },
    {
      title: 'Dubai Creek Harbour Absorption',
      metric: '+28.0% Volume',
      change: '7.4% Net Yield',
      status: marketMetrics.metadata.dataStatus,
      source: marketMetrics.metadata.source,
    },
  ];

  return (
    <div className="bg-stone-950 text-white border-y border-stone-850 py-2.5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
        
        {/* Left Label */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-serif-luxury font-bold text-amber-400 tracking-wider uppercase text-[11px]">
            Market Pulse
          </span>
          <DataStatusBadge status={marketMetrics.metadata.dataStatus} sourceName={marketMetrics.metadata.source} />
        </div>

        {/* Ticker Items (Horizontal Scrolling / Grid) */}
        <div className="hidden sm:flex items-center gap-6 overflow-x-auto no-scrollbar font-mono text-[11px] text-stone-300">
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0 border-r border-stone-800 pr-6 last:border-0">
              <span className="text-stone-400 font-sans font-semibold">{item.title}:</span>
              <span className="text-white font-bold">{item.metric}</span>
              <span className="text-amber-400 text-[10px]">{item.change}</span>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <button
          onClick={() => onSelectTab && onSelectTab('trends')}
          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline shrink-0"
        >
          View Trends →
        </button>

      </div>
    </div>
  );
};
