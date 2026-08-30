import { useState } from 'react';
import type { Developer, Property, Launch } from '../types';
import { DataStatusBadge } from '../components/shared/DataStatusBadge';
import { Building2, Search, ArrowRight, Building, Radar } from 'lucide-react';

interface Props {
  developers: Developer[];
  properties?: Property[];
  launches?: Launch[];
  onSelectProperty?: (property: Property) => void;
  onSelectTab?: (tab: string) => void;
}

export const DeveloperIntelligence = ({
  developers,
  properties = [],
  launches = [],
  onSelectProperty,
  onSelectTab,
}: Props) => {
  const [selectedDeveloperFilter, setSelectedDeveloperFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDevelopers = developers.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedDeveloperFilter === 'ALL' || dev.name === selectedDeveloperFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 space-y-4 border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Master Developer Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
              Developer Intelligence & Projects
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Live master developer feed powered directly by Property Finder API.
            </p>
          </div>

          <DataStatusBadge
            status={developers.length > 0 ? 'LIVE' : 'UNAVAILABLE'}
            sourceName="Property Finder RapidAPI"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search master developer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 text-white rounded-xl focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Developer Quick Select */}
          <select
            value={selectedDeveloperFilter}
            onChange={(e) => setSelectedDeveloperFilter(e.target.value)}
            className="px-4 py-2.5 bg-stone-900 border border-stone-800 text-white rounded-xl focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">All Master Developers ({developers.length})</option>
            {developers.map((dev) => (
              <option key={dev.id} value={dev.name}>
                {dev.name} ({dev.projectCount || dev.deliveredProjects || 0} Projects)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Developer Profiles Grid */}
      {filteredDevelopers.length === 0 ? (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl space-y-2 shadow-xs">
          <Building2 className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="font-serif-luxury font-bold text-lg text-stone-900">
            {developers.length === 0 ? 'Developer intelligence is currently updating' : 'No matching developers found'}
          </h3>
          <p className="text-xs text-stone-500">
            {developers.length === 0
              ? 'Verified developer records will appear here once the feed responds.'
              : 'Try adjusting your search query or developer filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDevelopers.map((dev) => {
            const devProperties = properties.filter((p) => p.developer.toLowerCase().includes(dev.name.toLowerCase()));
            const devLaunches = launches.filter((l) => l.developer.toLowerCase().includes(dev.name.toLowerCase()));

            return (
              <div key={dev.id} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5 shadow-xs hover:shadow-md transition-shadow">
                
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 gap-4">
                  <div className="flex items-center gap-4">
                    {dev.logo && (
                      <div className="w-14 h-14 rounded-xl bg-stone-50 p-2 border border-stone-200 flex items-center justify-center shrink-0">
                        <img
                          src={dev.logo}
                          alt={dev.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif-luxury font-bold text-2xl text-stone-900">{dev.name}</h3>
                      <p className="text-xs text-stone-500 font-mono">
                        Established: {dev.establishedSince || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-xl text-center font-bold text-xs border border-stone-200 shrink-0">
                    <span className="text-[9px] uppercase block text-stone-400 font-semibold">Delivery Score</span>
                    <span>{dev.deliveryScore > 0 ? `${dev.deliveryScore}/100` : '—'}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                  {dev.description || dev.overview || 'Registered Dubai Master Developer operating across major freehold communities.'}
                </p>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Online Projects</span>
                    <span className="font-bold text-stone-900 text-sm">{dev.projectCount || dev.deliveredProjects || 0}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Pipeline Launches</span>
                    <span className="font-bold text-amber-800 text-sm">{dev.pipelineLaunches || dev.upcomingLaunches || 0}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Portfolio Yield</span>
                    <span className="font-bold text-emerald-700 text-sm">{dev.portfolioYield > 0 ? `${dev.portfolioYield}% Net` : '—'}</span>
                  </div>
                </div>

                {/* Associated Projects Section */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Projects & Launches by {dev.name} ({devProperties.length + devLaunches.length})
                  </span>

                  <div className="space-y-1.5 text-xs">
                    {devProperties.map((prop) => (
                      <div
                        key={prop.id}
                        onClick={() => onSelectProperty && onSelectProperty(prop)}
                        className="p-2.5 bg-stone-50 hover:bg-amber-50/60 rounded-xl border border-stone-200/80 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-amber-800" />
                          <span className="font-semibold text-stone-900">{prop.name}</span>
                          <span className="text-[10px] text-stone-500 font-mono">({prop.area})</span>
                        </div>
                        <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                          AED {(prop.startingPrice / 1000000).toFixed(2)}M <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}

                    {devLaunches.map((launch) => (
                      <div
                        key={launch.id}
                        onClick={() => onSelectTab && onSelectTab('launches')}
                        className="p-2.5 bg-amber-50/40 hover:bg-amber-100/60 rounded-xl border border-amber-200/80 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Radar className="w-3.5 h-3.5 text-amber-700" />
                          <span className="font-semibold text-stone-900">{launch.name}</span>
                          <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold uppercase">Launch</span>
                        </div>
                        <span className="text-amber-900 font-bold text-[11px]">
                          {launch.timeframe}
                        </span>
                      </div>
                    ))}

                    {devProperties.length === 0 && devLaunches.length === 0 && (
                      <p className="text-[11px] text-stone-400 italic py-1">
                        Active dossiers for {dev.name} will appear here as verified listings are connected.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
