import { useState, useMemo } from 'react';
import type { Property, CurrencyCode, ExchangeRates } from '../types';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyFilterBar, type FilterState } from '../components/property/PropertyFilterBar';
import { Sparkles, Building2 } from 'lucide-react';

interface Props {
  properties: Property[];
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenStudio?: (property: Property) => void;
}

export const PropertyDiscovery: React.FC<Props> = ({
  properties,
  selectedCurrency,
  rates,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onOpenStudio,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    area: '',
    developer: '',
    propertyType: '',
    minYield: 0,
    maxPriceAED: 30000000,
    waterfrontOnly: false,
    goldenVisaOnly: false,
    searchQuery: '',
  });

  const areasList = useMemo(() => Array.from(new Set(properties.map((p) => p.area))), [properties]);
  const developersList = useMemo(() => Array.from(new Set(properties.map((p) => p.developer))), [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (filters.area && p.area !== filters.area) return false;
      if (filters.developer && p.developer !== filters.developer) return false;
      if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
      if (filters.minYield > 0 && p.rentalYield < filters.minYield) return false;
      if (p.startingPrice > filters.maxPriceAED) return false;
      if (filters.waterfrontOnly && !p.waterfront) return false;
      if (filters.goldenVisaOnly && !p.goldenVisaEligible) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchArea = p.area.toLowerCase().includes(q);
        const matchDev = p.developer.toLowerCase().includes(q);
        if (!matchName && !matchArea && !matchDev) return false;
      }
      return true;
    });
  }, [properties, filters]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-2 border border-stone-800">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Curated Dubai Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
          Explore Investment Opportunities
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm max-w-xl">
          Filter Dubai waterfront apartments, villas, and off-plan residences by expected rental yield, payment schedules, and Golden Visa eligibility.
        </p>
      </div>

      {/* Filter Component */}
      <PropertyFilterBar
        filters={filters}
        onChangeFilters={setFilters}
        areasList={areasList}
        developersList={developersList}
        totalResults={filteredProperties.length}
      />

      {/* Property Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop: Property) => (
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
      ) : (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-xl space-y-3">
          <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">No properties match your filters</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try adjusting your search criteria or resetting filters to view all Dubai dossiers.
          </p>
          <button
            onClick={() =>
              setFilters({
                area: '',
                developer: '',
                propertyType: '',
                minYield: 0,
                maxPriceAED: 30000000,
                waterfrontOnly: false,
                goldenVisaOnly: false,
                searchQuery: '',
              })
            }
            className="px-4 py-2 bg-stone-900 text-amber-400 text-xs font-semibold rounded-lg hover:bg-stone-800"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
