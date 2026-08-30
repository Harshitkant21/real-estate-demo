import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { Property, Launch, Developer } from '../../types';
import { Search, X, Building2, Radar, Building, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  launches: Launch[];
  developers: Developer[];
  onSelectProperty: (property: Property) => void;
  onSelectTab: (tab: string) => void;
}

export const SearchModal = ({
  isOpen,
  onClose,
  properties,
  launches,
  developers,
  onSelectProperty,
  onSelectTab,
}: Props) => {
  const [query, setQuery] = useState('');
  const [selectedDeveloperFilter, setSelectedDeveloperFilter] = useState<string>('ALL');

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.developer.toLowerCase().includes(query.toLowerCase()) ||
        p.area.toLowerCase().includes(query.toLowerCase());
      const matchesDev = selectedDeveloperFilter === 'ALL' || p.developer.toLowerCase().includes(selectedDeveloperFilter.toLowerCase());
      return matchesQuery && matchesDev;
    });
  }, [properties, query, selectedDeveloperFilter]);

  const filteredLaunches = useMemo(() => {
    return launches.filter((l) => {
      const matchesQuery =
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.developer.toLowerCase().includes(query.toLowerCase()) ||
        l.area.toLowerCase().includes(query.toLowerCase());
      const matchesDev = selectedDeveloperFilter === 'ALL' || l.developer.toLowerCase().includes(selectedDeveloperFilter.toLowerCase());
      return matchesQuery && matchesDev;
    });
  }, [launches, query, selectedDeveloperFilter]);

  const filteredDevelopers = useMemo(() => {
    return developers.filter((d) => {
      const matchesQuery =
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        (d.flagshipProject || '').toLowerCase().includes(query.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(query.toLowerCase());
      const matchesDev = selectedDeveloperFilter === 'ALL' || d.name.toLowerCase().includes(selectedDeveloperFilter.toLowerCase());
      return matchesQuery && matchesDev;
    });

  }, [developers, query, selectedDeveloperFilter]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-stone-950 text-white rounded-3xl shadow-2xl border border-stone-800 z-10 flex flex-col max-h-[80vh] overflow-hidden animate-fadeIn">
        
        {/* Search Header */}
        <div className="p-6 border-b border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury font-bold text-xl text-amber-400">
              Dubai Real Estate Global Search
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-xl bg-stone-900 border border-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Input Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-amber-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by developer (Emaar, Nakheel, Sobha), area, or project..."
              autoFocus
              className="w-full pl-12 pr-4 py-3 bg-stone-900 border border-stone-800 text-white text-sm rounded-2xl focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Quick Developer Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest self-center mr-1">
              Filter by Developer:
            </span>
            {['ALL', 'Emaar Properties', 'Nakheel', 'Sobha Realty', 'DAMAC Properties', 'Meraas', 'Select Group'].map((devName) => (
              <button
                key={devName}
                onClick={() => setSelectedDeveloperFilter(devName)}
                className={`px-3 py-1 rounded-lg border transition-all text-[11px] font-semibold ${
                  selectedDeveloperFilter === devName
                    ? 'bg-amber-600 text-stone-950 border-amber-600 font-bold'
                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-850'
                }`}
              >
                {devName === 'ALL' ? 'All Developers' : devName}
              </button>
            ))}
          </div>
        </div>

        {/* Results Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* 1. Property Dossier Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building className="w-4 h-4 text-amber-400" />
                Verified Property Dossiers ({filteredProperties.length})
              </span>
            </div>

            {filteredProperties.length === 0 ? (
              <p className="text-stone-500 italic">No matching property dossiers.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => {
                      onSelectProperty(prop);
                      onClose();
                    }}
                    className="p-3 bg-stone-900/90 hover:bg-stone-850 border border-stone-800 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-serif-luxury font-bold text-sm text-white">{prop.name}</h4>
                      <p className="text-stone-400 text-[11px]">
                        {prop.area} · <span className="text-amber-400 font-semibold">{prop.developer}</span>
                      </p>
                      <p className="text-stone-300 font-bold text-[11px] mt-0.5">
                        AED {(prop.startingPrice / 1000000).toFixed(2)}M ({prop.rentalYield}% Net)
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Launch Radar Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Radar className="w-4 h-4 text-amber-400" />
                Upcoming Launch Radar ({filteredLaunches.length})
              </span>
            </div>

            {filteredLaunches.length === 0 ? (
              <p className="text-stone-500 italic">No matching launch radar releases.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredLaunches.map((launch) => (
                  <div
                    key={launch.id}
                    onClick={() => {
                      onSelectTab('launches');
                      onClose();
                    }}
                    className="p-3 bg-stone-900/90 hover:bg-stone-850 border border-stone-800 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-serif-luxury font-bold text-sm text-white">{launch.name}</h4>
                      <p className="text-stone-400 text-[11px]">
                        {launch.area} · <span className="text-amber-400 font-semibold">{launch.developer}</span>
                      </p>
                      <p className="text-amber-400 font-bold text-[11px] mt-0.5">
                        {launch.timeframe} · From AED {(launch.startingPrice / 1000000).toFixed(2)}M
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Developer Track Record Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                Master Developers ({filteredDevelopers.length})
              </span>
            </div>

            {filteredDevelopers.length === 0 ? (
              <p className="text-stone-500 italic">No matching master developers.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredDevelopers.map((dev) => (
                  <div
                    key={dev.id}
                    onClick={() => {
                      onSelectTab('developers');
                      onClose();
                    }}
                    className="p-3 bg-stone-900/90 hover:bg-stone-850 border border-stone-800 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-serif-luxury font-bold text-sm text-white">{dev.name}</h4>
                      <p className="text-stone-400 text-[11px]">{dev.deliveredProjects}+ Delivered · Flagship: {dev.flagshipProject}</p>
                      <p className="text-emerald-400 font-bold text-[11px] mt-0.5">
                        Delivery Score {dev.deliveryScore}/100
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 text-stone-400 text-[10px] text-center font-mono">
          MITTAL & CO. Verified Data Search · Dubai Land Department Open Telemetry Connected

        </div>

      </div>
    </div>,
    document.body
  );
};
