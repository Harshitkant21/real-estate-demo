import { useState, useMemo } from 'react';
import type { Property, CurrencyCode, ExchangeRates } from '../types';
import { PropertyCard } from '../components/property/PropertyCard';
import { DataStatusBadge } from '../components/shared/DataStatusBadge';
import { Search, Compass, SlidersHorizontal, Check } from 'lucide-react';

interface Props {
  properties: Property[];
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenStudio: () => void;
}

export const PropertyDiscovery = ({
  properties,
  selectedCurrency,
  rates,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onOpenStudio,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [goldenVisaOnly, setGoldenVisaOnly] = useState(false);

  const areas = useMemo(() => {
    const unique = Array.from(new Set(properties.map((p) => p.area)));
    return ['ALL', ...unique];
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.developer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = selectedArea === 'ALL' || p.area === selectedArea;
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchesGoldenVisa = !goldenVisaOnly || p.goldenVisaEligible;

      return matchesSearch && matchesArea && matchesStatus && matchesGoldenVisa;
    });
  }, [properties, searchQuery, selectedArea, selectedStatus, goldenVisaOnly]);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 space-y-4 border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>MITTAL & CO. Curated Dubai Inventory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white">
              Verified Dubai Property Dossiers
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Explore off-plan developments and ready waterfront investments with verified ROI projections.
            </p>
          </div>

          <DataStatusBadge status="EDITORIAL" sourceName="MITTAL & CO. Research Desk" />
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search property, area, developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-800 text-white rounded-xl focus:border-amber-500"
            />
          </div>

          {/* Area Select */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="p-2.5 bg-stone-900 border border-stone-800 text-white rounded-xl focus:border-amber-500"
          >
            {areas.map((area) => (
              <option key={area} value={area}>
                {area === 'ALL' ? 'All Dubai Hubs' : area}
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2.5 bg-stone-900 border border-stone-800 text-white rounded-xl focus:border-amber-500"
          >
            <option value="ALL">All Availability Statuses</option>
            <option value="Off-Plan">Off-Plan Milestone</option>
            <option value="Featured">Featured Private Placement</option>
            <option value="Ready">Ready Move-In</option>
          </select>

          {/* Golden Visa Checkbox */}
          <button
            onClick={() => setGoldenVisaOnly(!goldenVisaOnly)}
            className={`flex items-center justify-center gap-2 p-2.5 border rounded-xl font-bold transition-all ${
              goldenVisaOnly
                ? 'bg-amber-600 text-stone-950 border-amber-600'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-850'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border ${goldenVisaOnly ? 'bg-stone-950 text-amber-400' : 'border-stone-600'}`}>
              {goldenVisaOnly && <Check className="w-3 h-3" />}
            </div>
            <span>Golden Visa (AED 2M+) Only</span>
          </button>
        </div>
      </div>

      {/* Property Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl space-y-2">
          <SlidersHorizontal className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="font-serif-luxury font-bold text-lg text-stone-900">No matching dossiers found</h3>
          <p className="text-xs text-stone-500">Try adjusting your area filter or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              selectedCurrency={selectedCurrency}
              rates={rates}
              isSaved={savedPropertyIds.includes(prop.id)}
              onToggleSave={onToggleSave}
              onSelectProperty={onSelectProperty}
              onOpenStudio={onOpenStudio}
            />
          ))}
        </div>
      )}

    </div>
  );
};
