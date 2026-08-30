import type { Property, Launch, CurrencyCode, ExchangeRates } from '../types';
import { PropertyCard } from '../components/property/PropertyCard';
import { Bookmark, Trash2 } from 'lucide-react';

interface Props {
  properties: Property[];
  launches: Launch[];
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  savedPropertyIds: string[];
  savedLaunchIds: string[];
  onToggleSaveProperty: (id: string) => void;
  onToggleSaveLaunch: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onClearSaved: () => void;
}

export const SavedWorkspace = ({
  properties,
  selectedCurrency,
  rates,
  savedPropertyIds,
  onToggleSaveProperty,
  onSelectProperty,
  onClearSaved,
}: Props) => {
  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
                Saved Investor Workspace
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm">
                Your shortlisted property dossiers stored strictly on your device. Zero sensitive data saved externally.
              </p>
            </div>
          </div>

          {savedProperties.length > 0 && (
            <button
              onClick={onClearSaved}
              className="px-3 py-1.5 bg-stone-900 text-stone-400 hover:text-red-400 border border-stone-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Saved</span>
            </button>
          )}
        </div>
      </div>

      {savedProperties.length === 0 ? (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl space-y-3">
          <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif-luxury font-bold text-xl text-stone-900">Your workspace is currently empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click the bookmark icon on any property dossier to save it for review or discussion with an advisor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              selectedCurrency={selectedCurrency}
              rates={rates}
              isSaved={true}
              onToggleSave={onToggleSaveProperty}
              onSelectProperty={onSelectProperty}
            />
          ))}
        </div>
      )}

    </div>
  );
};
