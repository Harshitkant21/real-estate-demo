import type { Property, Launch, CurrencyCode, ExchangeRates } from '../types';
import { PropertyCard } from '../components/property/PropertyCard';
import { Bookmark, Building2, Radar, Trash2 } from 'lucide-react';

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

export const SavedWorkspace: React.FC<Props> = ({
  properties,
  launches,
  selectedCurrency,
  rates,
  savedPropertyIds,
  savedLaunchIds,
  onToggleSaveProperty,
  onToggleSaveLaunch,
  onSelectProperty,
  onClearSaved,
}) => {
  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));
  const savedLaunchesList = launches.filter((l) => savedLaunchIds.includes(l.id));

  const totalSaved = savedProperties.length + savedLaunchesList.length;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-3 border border-stone-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Bookmark className="w-4 h-4 fill-current" />
            <span>Investor Saved Workspace</span>
          </div>

          {totalSaved > 0 && (
            <button
              onClick={onClearSaved}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg flex items-center gap-1 border border-stone-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Workspace</span>
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
          Saved Properties & Launch Radar ({totalSaved})
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm max-w-xl">
          Bookmarked Dubai dossiers and upcoming project launches stored safely in your browser session.
        </p>
      </div>

      {/* Saved Properties */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif-luxury font-bold text-stone-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-800" />
          <span>Saved Property Dossiers ({savedProperties.length})</span>
        </h2>

        {savedProperties.length > 0 ? (
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
        ) : (
          <div className="p-8 text-center bg-white border border-stone-200 rounded-xl text-stone-500 text-xs">
            No properties currently bookmarked. Click the bookmark icon on any property card to save it.
          </div>
        )}
      </div>

      {/* Saved Launches */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-serif-luxury font-bold text-stone-900 flex items-center gap-2">
          <Radar className="w-5 h-5 text-amber-800" />
          <span>Saved Launch Radar ({savedLaunchesList.length})</span>
        </h2>

        {savedLaunchesList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedLaunchesList.map((launch) => (
              <div key={launch.id} className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-serif-luxury font-bold text-stone-900 text-sm">{launch.name}</h4>
                  <p className="text-stone-500">{launch.area} · {launch.developer}</p>
                </div>
                <button
                  onClick={() => onToggleSaveLaunch(launch.id)}
                  className="p-2 text-stone-400 hover:text-amber-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-stone-200 rounded-xl text-stone-500 text-xs">
            No launch radar projects bookmarked.
          </div>
        )}
      </div>
    </div>
  );
};
