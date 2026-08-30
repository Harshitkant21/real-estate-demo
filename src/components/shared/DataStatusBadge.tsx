import type { DataFreshnessStatus } from '../../config/dataSources';

interface Props {
  status: DataFreshnessStatus;
  sourceName?: string;
  lastUpdated?: string;
  confidence?: number;
  className?: string;
}

export const DataStatusBadge = ({
  status,
  className = '',
}: Props) => {
  const getStyle = () => {
    switch (status) {
      case 'LIVE':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping',
          label: 'Live',
        };
      case 'RECENT':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'w-1.5 h-1.5 rounded-full bg-emerald-700',
          label: 'Verified Feed',
        };
      case 'CACHED':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'w-1.5 h-1.5 rounded-full bg-blue-700',
          label: 'Cached 12h',
        };
      case 'DERIVED':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'w-1.5 h-1.5 rounded-full bg-amber-700',
          label: 'Derived Metric',
        };
      case 'AI ANALYSIS':
        return {
          bg: 'bg-purple-900/60 text-purple-200 border-purple-700',
          dot: 'w-1.5 h-1.5 rounded-full bg-purple-400',
          label: 'AI Reasoning',
        };
      case 'EDITORIAL':
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-300',
          dot: 'w-1.5 h-1.5 rounded-full bg-stone-500',
          label: 'AM Editorial',
        };
      default:
        return {
          bg: 'bg-stone-200 text-stone-600 border-stone-300',
          dot: 'w-1.5 h-1.5 rounded-full bg-stone-400',
          label: 'Unavailable',
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        className={`px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-tight inline-flex items-center gap-1.5 shadow-2xs ${style.bg}`}
      >
        <span className={style.dot} />
        <span>{style.label}</span>
      </div>
    </div>
  );
};
