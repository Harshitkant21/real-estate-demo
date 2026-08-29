import { useState } from 'react';
import type { NewsItem, NewsCategory } from '../../types';
import { DataStatusBadge } from '../shared/DataStatusBadge';
import { Newspaper, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  newsItems: NewsItem[];
}

export const MarketNewsFeed = ({ newsItems }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>('ALL');

  const categories: (NewsCategory | 'ALL')[] = [
    'ALL',
    'DLD Regulation',
    'Market Momentum',
    'Infrastructure & Connectivity',
    'Major Project Launch',
    'Macro Economic & Visa',
  ];

  const filteredNews =
    selectedCategory === 'ALL' ? newsItems : newsItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center border border-amber-500/20">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-luxury font-bold text-xl text-stone-900">
              Dubai Real Estate News Wire
            </h3>
            <p className="text-xs text-stone-500">
              Verified news from official DLD feeds, government communications, and developer announcements.
            </p>
          </div>
        </div>

        <DataStatusBadge status="RECENT" sourceName="Government Media Office & DLD" />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              selectedCategory === cat
                ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-3 hover:border-amber-400 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-[10px]">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded uppercase">
                  {item.category}
                </span>
                <span className="text-stone-400 font-mono">{item.publishedAt}</span>
              </div>

              <h4 className="font-serif-luxury font-bold text-base text-stone-900 leading-snug">
                {item.headline}
              </h4>

              <p className="text-xs text-stone-600 font-light leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                {item.sourceName}
              </span>

              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 font-bold hover:underline flex items-center gap-1"
              >
                <span>Read Wire</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
