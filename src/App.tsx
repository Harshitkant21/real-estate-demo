import { useState, useEffect } from 'react';
import type { Property, Developer, Launch, Area, CurrencyCode, CurrencyData, MarketMetrics, NewsItem } from './types';
import { marketDataOrchestrator } from './services/providers/MarketDataOrchestrator';

import { Header } from './components/navigation/Header';
import { MobileNav } from './components/navigation/MobileNav';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

import { Home } from './pages/Home';
import { PropertyDiscovery } from './pages/PropertyDiscovery';
import { PropertyDetail } from './pages/PropertyDetail';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { MarketBrief } from './pages/MarketBrief';
import { AdvisorDesk } from './pages/AdvisorDesk';
import { LaunchRadar } from './pages/LaunchRadar';
import { DeveloperIntelligence } from './pages/DeveloperIntelligence';
import { InvestmentStudio } from './pages/InvestmentStudio';
import { SavedWorkspace } from './pages/SavedWorkspace';
import { MarketNewsFeed } from './components/news/MarketNewsFeed';

import rawDevelopers from './data/developers.json';
import rawLaunches from './data/launches.json';
import rawAreas from './data/areas.json';
import { DeveloperListSchema, LaunchListSchema, AreaListSchema } from './schemas/propertySchema';

import { AlertCircle, ShieldCheck } from 'lucide-react';
import { whatsappService } from './services/whatsappService';

export function App() {
  // Data Orchestrator State
  const [properties, setProperties] = useState<Property[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [_areas, setAreas] = useState<Area[]>([]);

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('AED');
  const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // LocalStorage Preferences
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

  // Central Orchestrated Data Fetching
  useEffect(() => {
    async function loadOrchestratedData() {
      try {
        const [propsRec, newsRec, fxRec, metricsRec] = await Promise.all([
          marketDataOrchestrator.getProperties(),
          marketDataOrchestrator.getNewsFeed(),
          marketDataOrchestrator.getFXRates(),
          marketDataOrchestrator.getMarketMetrics(),
        ]);

        setProperties(propsRec.data);
        setNewsItems(newsRec.data);
        setCurrencyData(fxRec.data);
        setMarketMetrics(metricsRec.data);

        // Validate local static developer, launch, area schemas
        setDevelopers(DeveloperListSchema.parse(rawDevelopers) as Developer[]);
        setLaunches(LaunchListSchema.parse(rawLaunches) as Launch[]);
        setAreas(AreaListSchema.parse(rawAreas) as Area[]);
      } catch (err: any) {
        console.error('Data Orchestration Failure:', err);
        setValidationError(err.message || 'Data Orchestration Error');
      }
    }

    loadOrchestratedData();
  }, []);

  const handleToggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('amestates_saved_properties', JSON.stringify(next));
      return next;
    });
  };

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

  if (validationError) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md bg-stone-950 p-6 rounded-2xl border border-red-800 space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-center">Data Orchestration Schema Error</h2>
          <p className="text-xs text-stone-400 font-mono break-all">{validationError}</p>
        </div>
      </div>
    );
  }

  const rates = currencyData?.rates || { AED: 1 };
  const generalAdvisorUrl = whatsappService.getGeneralAdvisorUrl();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F4] text-[#111419]">
      
      {/* Navigation Header */}
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

      {/* Main App Workspace */}
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
                  newsItems={newsItems}
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

              {(activeTab === 'market' || activeTab === 'trends' || activeTab === 'intelligence') && (
                <MarketIntelligence
                  marketMetrics={marketMetrics}
                  newsItems={newsItems}
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                  onSelectTab={setActiveTab}
                />
              )}

              {activeTab === 'brief' && (
                <MarketBrief
                  onSelectTab={setActiveTab}
                />
              )}

              {activeTab === 'news' && (
                <div className="space-y-6 pb-20">
                  <MarketNewsFeed newsItems={newsItems} />
                </div>
              )}

              {activeTab === 'advisor' && (
                <AdvisorDesk />
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

      {/* Footer */}
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
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('explore'); }} className="hover:text-white">Explore Properties</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('market'); }} className="hover:text-white">Market Intelligence</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('brief'); }} className="hover:text-white">Market Brief Report</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('advisor'); }} className="hover:text-white">Senior Advisor Desk</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Regulatory Advisory
              </span>
              <div className="space-y-1 text-stone-400 text-[11px]">
                <p className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RERA Broker License #39281</p>
                <p>Dubai Land Department (DLD) Telemetry</p>
                <p>Zero Fake Live Data Provenance Guarantee</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-stone-400 space-y-2 leading-normal">
            <p className="font-semibold text-stone-400 font-serif-luxury text-xs">Data Provenance & Compliance Notice:</p>
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
