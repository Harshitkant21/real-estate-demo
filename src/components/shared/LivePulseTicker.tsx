import type { MarketMetrics } from '../../types';

interface Props {
  marketMetrics: MarketMetrics | null;
  onSelectTab?: (tab: string) => void;
}

export const LivePulseTicker = ({ marketMetrics, onSelectTab }: Props) => {
  const transactionVolumeYoY = marketMetrics?.transactionVolumeYoY && marketMetrics.transactionVolumeYoY > 0 
    ? marketMetrics.transactionVolumeYoY 
    : 18.4;

  const tickerItems = [
    {
      title: 'Palm Jumeirah Benchmark',
      metric: 'AED 3,850 / sqft',
      change: '+7.2% Net Yield',
    },
    {
      title: 'DLD Sales Volume Index',
      metric: `+${transactionVolumeYoY}% YoY`,
      change: '24h DLD Telemetry',
    },
    {
      title: 'Palm Jebel Ali Frond Momentum',
      metric: 'AED 2,800 / sqft',
      change: '+18.4% YoY',
    },
    {
      title: 'Dubai Creek Harbour Yield',
      metric: '6.9% Net Yield',
      change: '+12.8% Absorption',
    },
  ];

  return (
    <div className="bg-stone-950 text-white border-b border-stone-850 py-2.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 text-xs">
        
        {/* Left Label */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center justify-center w-2 h-2">
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="font-serif-luxury font-bold text-amber-400 tracking-widest uppercase text-[11px]">
            Live Market Pulse
          </span>
        </div>

        {/* Ticker Items */}
        <div className="hidden md:flex items-center gap-6 overflow-x-auto no-scrollbar font-sans text-[11px]">
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0 border-r border-stone-800 pr-6 last:border-0">
              <span className="text-stone-400 font-semibold">{item.title}:</span>
              <span className="text-white font-bold">{item.metric}</span>
              <span className="text-emerald-400 font-medium text-[10px]">{item.change}</span>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <button
          onClick={() => onSelectTab && onSelectTab('trends')}
          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0 flex items-center gap-1"
        >
          <span>View Market Trends</span>
          <span>→</span>
        </button>

      </div>
    </div>
  );
};
