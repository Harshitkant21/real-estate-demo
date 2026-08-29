import { useState, useEffect } from 'react';
import { PropertyListSchema, DeveloperListSchema, LaunchListSchema, AreaListSchema } from './schemas/propertySchema';
import rawProperties from './data/properties.json';
import rawDevelopers from './data/developers.json';
import rawLaunches from './data/launches.json';
import rawAreas from './data/areas.json';

import type { Property, Developer, Launch, Area, CurrencyCode, CurrencyData, MarketMetrics } from './types';
import { currencyService } from './services/currencyApi';
import { dldMarketService } from './services/dldMarketApi';
import { Header } from './components/navigation/Header';
import { MobileNav } from './components/navigation/MobileNav';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

import { Home } from './pages/Home';
import { PropertyDiscovery } from './pages/PropertyDiscovery';
import { PropertyDetail } from './pages/PropertyDetail';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { LaunchRadar } from './pages/LaunchRadar';
import { DeveloperIntelligence } from './pages/DeveloperIntelligence';
import { InvestmentStudio } from './pages/InvestmentStudio';
import { SavedWorkspace } from './pages/SavedWorkspace';

import { ShieldCheck, AlertCircle } from 'lucide-react';
import { whatsappService } from './services/whatsappService';

export function App() {
  // 1. Zod Runtime Data Validation & Storage
  const [properties, setProperties] = useState<Property[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [_areas, setAreas] = useState<Area[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 2. Application State
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('AED');
  const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics | null>(null);

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // 3. LocalStorage Preferences (Non-sensitive saved IDs)
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('amestates_saved_properties');
      return raw ? JSON.parse(raw) : ['ame-001'];
    } catch {
      return ['ame-001'];
    }
  });

  const [savedLaunchIds, setSavedLaunchIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('amestates_saved_launches');
      return raw ? JSON.parse(raw) : ['launch-101'];
    } catch {
      return ['launch-101'];
    }
  });

  // Validate JSON data at app startup
  useEffect(() => {
    try {
      const validatedProps = PropertyListSchema.parse(rawProperties);
      const validatedDevs = DeveloperListSchema.parse(rawDevelopers);
      const validatedLaunches = LaunchListSchema.parse(rawLaunches);
      const validatedAreas = AreaListSchema.parse(rawAreas);

      setProperties(validatedProps as Property[]);
      setDevelopers(validatedDevs as Developer[]);
      setLaunches(validatedLaunches as Launch[]);
      setAreas(validatedAreas as Area[]);
    } catch (err: any) {
      console.error('Zod JSON Schema Validation Failure:', err);
      setValidationError(err.message || 'JSON Schema Validation Error');
    }
  }, []);

  // Fetch Exchange Rates & DLD Authoritative Market Data
  useEffect(() => {
    currencyService.fetchRates().then(setCurrencyData);
    dldMarketService.getMarketMetrics().then(setMarketMetrics);
  }, []);

  // Sync Saved Property IDs to LocalStorage
  const handleToggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('amestates_saved_properties', JSON.stringify(next));
      return next;
    });
  };

  // Sync Saved Launch IDs to LocalStorage
  const handleToggleSaveLaunch = (id: string) => {
    setSavedLaunchIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('amestates_saved_launches', JSON.stringify(next));
      return next;
    });
  };

  const handleClearSaved = () => {
    setSavedPropertyIds([]);
    setSavedLaunchIds([]);
    localStorage.removeItem('amestates_saved_properties');
    localStorage.removeItem('amestates_saved_launches');
  };

  // Schema Validation Error Fallback
  if (validationError) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md bg-stone-950 p-6 rounded-2xl border border-red-800 space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-center">Zod JSON Data Schema Error</h2>
          <p className="text-xs text-stone-400 font-mono break-all">{validationError}</p>
          <p className="text-xs text-stone-500 text-center">
            Check <code className="text-amber-400">src/data/</code> files to ensure all mandatory properties comply with schemas.
          </p>
        </div>
      </div>
    );
  }

  const rates = currencyData?.rates || { AED: 1 };
  const generalAdvisorUrl = whatsappService.getGeneralAdvisorUrl();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F4] text-[#111419]">
      
      {/* Top Header */}
      <Header
        selectedCurrency={selectedCurrency}
        onSelectCurrency={setSelectedCurrency}
        currencyData={currencyData}
        savedCount={savedPropertyIds.length + savedLaunchIds.length}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedProperty(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <ErrorBoundary>
          {selectedProperty ? (
            <PropertyDetail
              property={selectedProperty}
              selectedCurrency={selectedCurrency}
              rates={rates}
              isSaved={savedPropertyIds.includes(selectedProperty.id)}
              onToggleSave={handleToggleSaveProperty}
              onBack={() => setSelectedProperty(null)}
              onOpenStudio={() => {
                setSelectedProperty(null);
                setActiveTab('studio');
              }}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <Home
                  properties={properties}
                  launches={launches}
                  marketMetrics={marketMetrics}
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                  savedPropertyIds={savedPropertyIds}
                  onToggleSave={handleToggleSaveProperty}
                  onSelectProperty={setSelectedProperty}
                  onSelectTab={setActiveTab}
                />
              )}

              {activeTab === 'explore' && (
                <PropertyDiscovery
                  properties={properties}
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                  savedPropertyIds={savedPropertyIds}
                  onToggleSave={handleToggleSaveProperty}
                  onSelectProperty={setSelectedProperty}
                  onOpenStudio={() => setActiveTab('studio')}
                />
              )}

              {(activeTab === 'intelligence' || activeTab === 'trends') && (
                <MarketIntelligence
                  marketMetrics={marketMetrics}
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                />
              )}

              {activeTab === 'launches' && (
                <LaunchRadar
                  launches={launches}
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                  savedLaunchIds={savedLaunchIds}
                  onToggleSaveLaunch={handleToggleSaveLaunch}
                />
              )}

              {activeTab === 'developers' && (
                <DeveloperIntelligence developers={developers} />
              )}

              {activeTab === 'studio' && (
                <InvestmentStudio
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                />
              )}

              {activeTab === 'saved' && (
                <SavedWorkspace
                  properties={properties}
                  launches={launches}
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                  savedPropertyIds={savedPropertyIds}
                  savedLaunchIds={savedLaunchIds}
                  onToggleSaveProperty={handleToggleSaveProperty}
                  onToggleSaveLaunch={handleToggleSaveLaunch}
                  onSelectProperty={setSelectedProperty}
                  onClearSaved={handleClearSaved}
                />
              )}
            </>
          )}
        </ErrorBoundary>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedProperty(null);
          setActiveTab(tab);
        }}
        savedCount={savedPropertyIds.length + savedLaunchIds.length}
      />

      {/* Editorial Luxury Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20 pb-20 md:pb-12 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  AM
                </div>
                <span className="font-serif-luxury text-xl font-bold text-white tracking-wide">
                  AM ESTATES
                </span>
              </div>
              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                Dubai real estate, intelligently invested. AM Estates provides official Dubai Land Department market intelligence, developer dossiers, and ROI modeling for international investors.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Platform Navigation
              </span>
              <ul className="space-y-1 text-stone-400">
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('explore'); }} className="hover:text-white">Properties</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('trends'); }} className="hover:text-white">Market Trends</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('launches'); }} className="hover:text-white">Launch Radar</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('studio'); }} className="hover:text-white">Investment Calculator</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Regulatory Advisory
              </span>
              <div className="space-y-1 text-stone-400 text-[11px]">
                <p className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RERA Registered Brokerage</p>
                <p>Dubai Land Department (DLD) Feeds</p>
                <p>Escrow Account Guarantees</p>
              </div>
            </div>
          </div>

          {/* Compliance & Regulatory Disclaimer */}
          <div className="text-[10px] text-stone-400 space-y-2 leading-normal">
            <p className="font-semibold text-stone-400 font-serif-luxury text-xs">Trust & Legal Compliance Notice:</p>
            <p>
              Property information, yields, handover dates, and ROI projections are provided for general informational purposes and modeling only. All claims regarding 0% property tax, UAE Golden Visa 10-year residency, RERA escrow protections, and capital appreciation are subject to applicable UAE government regulations, DLD eligibility requirements, individual financial circumstances, and final legal approval. Projections are estimates and do not constitute guaranteed returns.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-stone-850 text-stone-400">
              <span>© 2026 AM Estates. All rights reserved.</span>
              <a href={generalAdvisorUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                Talk to an AM Estates Senior Advisor on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
