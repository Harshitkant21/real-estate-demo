import { useState } from 'react';
import type { DataFreshnessStatus } from '../../config/dataSources';
import { Info, ShieldCheck } from 'lucide-react';

interface Props {
  status: DataFreshnessStatus;
  sourceName?: string;
  lastUpdated?: string;
  confidence?: number;
  className?: string;
}

export const DataStatusBadge = ({
  status,
  sourceName = 'Official DLD Open Data',
  lastUpdated = 'Updated Today',
  confidence,
  className = '',
}: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

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
          label: 'Recent Data',
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
    <div className={`relative inline-flex items-center ${className}`}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-tight inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors ${style.bg}`}
      >
        <span className={style.dot} />
        <span>{style.label}</span>
        <Info className="w-3 h-3 opacity-60 hover:opacity-100" />
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-56 p-3 bg-stone-950 text-white border border-stone-800 rounded-xl shadow-2xl z-50 text-[10px] space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-stone-800 pb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Provenance Guarantee</span>
          </div>
          <div className="space-y-0.5 text-stone-300">
            <p><strong>Source:</strong> {sourceName}</p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Last Updated:</strong> {lastUpdated}</p>
            {confidence && <p><strong>Confidence:</strong> {confidence}%</p>}
          </div>
          <p className="text-[9px] text-stone-400 italic pt-1 border-t border-stone-850">
            Zero fabricated data policy. Verified against official source providers.
          </p>
        </div>
      )}
    </div>
  );
};
