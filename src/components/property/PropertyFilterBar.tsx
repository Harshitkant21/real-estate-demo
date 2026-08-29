import React from 'react';
import { Filter, X, Waves, ShieldCheck, Sparkles } from 'lucide-react';

export interface FilterState {
  area: string;
  developer: string;
  propertyType: string;
  minYield: number;
  maxPriceAED: number;
  waterfrontOnly: boolean;
  goldenVisaOnly: boolean;
  searchQuery: string;
}

interface Props {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  areasList: string[];
  developersList: string[];
  totalResults: number;
}

export const PropertyFilterBar: React.FC<Props> = ({
  filters,
  onChangeFilters,
  areasList,
  developersList,
  totalResults,
}) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.area) count++;
    if (filters.developer) count++;
    if (filters.propertyType) count++;
    if (filters.minYield > 0) count++;
    if (filters.maxPriceAED < 30000000) count++;
    if (filters.waterfrontOnly) count++;
    if (filters.goldenVisaOnly) count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters]);

  const handleReset = () => {
    onChangeFilters({
      area: '',
      developer: '',
      propertyType: '',
      minYield: 0,
      maxPriceAED: 30000000,
      waterfrontOnly: false,
      goldenVisaOnly: false,
      searchQuery: '',
    });
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm space-y-4">
      {/* Search Input & Quick Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by property name, developer or keyword..."
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-3 pr-8 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-stone-50/50 text-stone-900"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Toggle buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Toggles */}
          <button
            onClick={() => onChangeFilters({ ...filters, waterfrontOnly: !filters.waterfrontOnly })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              filters.waterfrontOnly
                ? 'bg-blue-50 text-blue-800 border-blue-300'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-blue-700" />
            <span>Waterfront</span>
          </button>

          <button
            onClick={() => onChangeFilters({ ...filters, goldenVisaOnly: !filters.goldenVisaOnly })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              filters.goldenVisaOnly
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Golden Visa</span>
          </button>

          {/* Mobile Filter Sheet Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="sm:hidden px-3 py-1.5 bg-stone-900 text-stone-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Filter Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${isMobileOpen ? 'block' : 'hidden sm:grid'}`}>
        {/* Area Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Area / Hub
          </label>
          <select
            value={filters.area}
            onChange={(e) => onChangeFilters({ ...filters, area: e.target.value })}
            className="w-full p-2 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700"
          >
            <option value="">All Areas</option>
            {areasList.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Developer Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Developer
          </label>
          <select
            value={filters.developer}
            onChange={(e) => onChangeFilters({ ...filters, developer: e.target.value })}
            className="w-full p-2 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700"
          >
            <option value="">All Developers</option>
            {developersList.map((dev) => (
              <option key={dev} value={dev}>
                {dev}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => onChangeFilters({ ...filters, propertyType: e.target.value })}
            className="w-full p-2 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700"
          >
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>

        {/* Min Yield Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Min Yield p.a.
          </label>
          <select
            value={filters.minYield}
            onChange={(e) => onChangeFilters({ ...filters, minYield: Number(e.target.value) })}
            className="w-full p-2 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700"
          >
            <option value={0}>Any Yield</option>
            <option value={6}>6%+ Net</option>
            <option value={7}>7%+ Net</option>
            <option value={7.5}>7.5%+ Net</option>
          </select>
        </div>
      </div>

      {/* Filter Status Summary & Clear */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
        <span className="font-semibold text-stone-700">
          Showing <span className="text-amber-800 font-bold">{totalResults}</span> Opportunities
        </span>

        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="text-stone-500 hover:text-amber-800 font-semibold underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-700" /> Clear Filters ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );
};
