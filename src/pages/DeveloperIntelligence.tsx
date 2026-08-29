import type { Developer } from '../types';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { Award, CheckCircle2 } from 'lucide-react';

interface Props {
  developers: Developer[];
}

export const DeveloperIntelligence: React.FC<Props> = ({ developers }) => {
  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-2 border border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Developer Track Records</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
          Dubai Developer Intelligence
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm max-w-xl">
          Evaluate historical delivery timelines, construction quality scores, and portfolio yields across Dubai's top master developers.
        </p>
      </div>

      {/* Developer Cards */}
      <div className="space-y-6">
        {developers.map((dev) => (
          <div key={dev.id} className="luxury-card rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 p-1 shrink-0">
                  <ImageWithFallback src={dev.logo} alt={dev.name} aspectRatio="square" />
                </div>
                <div>
                  <h3 className="text-xl font-serif-luxury font-bold text-stone-900">{dev.name}</h3>
                  <span className="text-xs text-amber-800 font-semibold">Flagship: {dev.flagshipProject}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-center">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Delivery Score</span>
                  <span className="font-bold text-stone-900 text-sm">{dev.deliveryScore} / 10</span>
                </div>
                <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <span className="text-[10px] text-amber-900 uppercase font-bold block">Portfolio Yield</span>
                  <span className="font-bold text-amber-900 text-sm">{dev.portfolioYield}% p.a.</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{dev.overview}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Handover Record</span>
                <span className="font-bold text-stone-900">{dev.deliveredProjects} Delivered Towers</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Active Pipeline</span>
                <span className="font-bold text-stone-900">{dev.upcomingLaunches} Projects Underway</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 col-span-2 sm:col-span-1">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Institutional Rating</span>
                <span className="font-bold text-emerald-700">AAA Prime Tier</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 text-xs">
              <span className="text-[10px] font-bold uppercase text-stone-400 block">Developer Insights</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {dev.insights.map((ins, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-stone-700 bg-stone-50 p-2 rounded border border-stone-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px]">{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
