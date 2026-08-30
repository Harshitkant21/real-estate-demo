import { useState, useEffect } from 'react';
import type {
  Property,
  Developer,
  Launch,
  CurrencyCode,
  CurrencyData,
  MarketMetrics,
  NewsItem,
  IntelligenceNotification,
} from './types';

import { marketDataOrchestrator } from './services/providers/MarketDataOrchestrator';

import { Header } from './components/navigation/Header';
import { SearchModal } from './components/navigation/SearchModal';
import { MobileNav } from './components/navigation/MobileNav';
import { FloatingAIOrb } from './components/ai/FloatingAIOrb';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LivePulseTicker } from './components/shared/LivePulseTicker';





import { Home } from './pages/Home';
import { PropertyDiscovery } from './pages/PropertyDiscovery';
import { PropertyDetail } from './pages/PropertyDetail';
import { MarketTrends } from './pages/MarketTrends';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { MarketBrief } from './pages/MarketBrief';
import { AdvisorDesk } from './pages/AdvisorDesk';
import { LaunchRadar } from './pages/LaunchRadar';
import { DeveloperIntelligence } from './pages/DeveloperIntelligence';
import { InvestmentStudio } from './pages/InvestmentStudio';
import { SavedWorkspace } from './pages/SavedWorkspace';
import { MarketNewsFeed } from './components/news/MarketNewsFeed';
import { AlertCircle, ShieldCheck } from 'lucide-react';

import { whatsappService } from './services/whatsappService';

export function App() {
  // Data Orchestrator State
  const [properties, setProperties] = useState<Property[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics | null>(null);
  const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // App Navigation & UI State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('AED');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<IntelligenceNotification[]>([]);

  // LocalStorage Preferences
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('amestates_saved_properties');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [savedLaunchIds, setSavedLaunchIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('amestates_saved_launches');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });


  // Central Orchestrated Data Fetching
  useEffect(() => {
    async function loadOrchestratedData() {
      try {
        const [propsRec, newsRec, fxRec, metricsRec, devsRec, launchesRec] = await Promise.all([
          marketDataOrchestrator.getProperties(),
          marketDataOrchestrator.getNewsFeed(),
          marketDataOrchestrator.getFXRates(),
          marketDataOrchestrator.getMarketMetrics(),
          marketDataOrchestrator.getDevelopers(),
          marketDataOrchestrator.getLaunches(),
        ]);

        setProperties(propsRec.data);
        setNewsItems(newsRec.data);
        setCurrencyData(fxRec.data);
        setMarketMetrics(metricsRec.data);
        setDevelopers(devsRec.data);
        setLaunches(launchesRec.data);
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

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      const readIds = next.map((n) => n.id);
      localStorage.setItem('amestates_read_notification_ids', JSON.stringify(readIds));
      return next;
    });
  };

  const handleSelectNotification = (notification: IntelligenceNotification) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n));
      const readIds = next.filter((n) => n.read).map((n) => n.id);
      localStorage.setItem('amestates_read_notification_ids', JSON.stringify(readIds));
      return next;
    });
    if (notification.linkTab) {
      setSelectedProperty(null);
      setActiveTab(notification.linkTab);
    }
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
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedProperty(null);
          setActiveTab(tab);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Live Market Pulse Ticker (Attached directly beneath sticky header) */}
      <LivePulseTicker
        marketMetrics={marketMetrics}
        onSelectTab={(tab) => {
          setSelectedProperty(null);
          setActiveTab(tab);
        }}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">

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

              {activeTab === 'trends' && (
                <MarketTrends
                  marketMetrics={marketMetrics}
                  selectedCurrency={selectedCurrency}
                  rates={rates}
                  onSelectTab={setActiveTab}
                />
              )}

              {(activeTab === 'market' || activeTab === 'intelligence') && (
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
                <DeveloperIntelligence
                  developers={developers}
                  properties={properties}
                  launches={launches}
                  onSelectProperty={setSelectedProperty}
                  onSelectTab={setActiveTab}
                />
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

      {/* Global Developer & Project Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        properties={properties}
        launches={launches}
        developers={developers}
        onSelectProperty={(prop) => {
          setSelectedProperty(prop);
          setIsSearchOpen(false);
        }}
        onSelectTab={(tab) => {
          setSelectedProperty(null);
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
      />

      {/* Floating AI Intelligence Analyst Orb */}
      <FloatingAIOrb
        properties={properties}
        onSelectProperty={setSelectedProperty}
      />


      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedProperty(null);
          setActiveTab(tab);
        }}
        savedCount={savedPropertyIds.length + savedLaunchIds.length}
      />

      {/* MITTALCO Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20 pb-20 md:pb-12 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/logo.png"
                  alt="MITTAL & CO. STRATEGIC ADVISOR"
                  className="h-16 sm:h-20 w-auto object-contain bg-white/95 p-2 rounded-xl shadow-md"
                />
              </div>


              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                Dubai real estate, intelligently invested. MITTAL & CO. provides official Dubai Land Department market intelligence, developer dossiers, and ROI modeling for international private wealth investors.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Platform Navigation
              </span>
              <ul className="space-y-1 text-stone-400">
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('explore'); }} className="hover:text-white">Explore Properties</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('trends'); }} className="hover:text-white">Dubai Market Trends</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('market'); }} className="hover:text-white">Market Intelligence</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('brief'); }} className="hover:text-white">MITTAL & CO. Market Brief</button></li>
                <li><button onClick={() => { setSelectedProperty(null); setActiveTab('advisor'); }} className="hover:text-white">Senior Advisor Desk</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Regulatory Advisory
              </span>
              <div className="space-y-1 text-stone-400 text-[11px]">
                <p className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> LICENSED BROKERAGE PARTNER NETWORK</p>
                <p>Dubai Land Department (DLD) Telemetry</p>
                <p>Zero Fake Live Data Provenance Guarantee</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-stone-400 space-y-2 leading-normal">
            <p className="font-semibold text-stone-400 font-serif-luxury text-xs">Data Provenance & Compliance Notice:</p>
            <p>
              Property information, yields, handover dates, and ROI projections are provided for general informational purposes and modeling only. All claims regarding 0% property tax, UAE Golden Visa 10-year residency, registered DLD escrow protections, and capital appreciation are subject to applicable UAE government regulations, DLD eligibility requirements, individual financial circumstances, and final legal approval. Projections are estimates and do not constitute guaranteed returns.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-stone-850 text-stone-400">
              <span>© 2026 MITTAL & CO. All rights reserved.</span>
              <a href={generalAdvisorUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                Talk to a MITTAL & CO. Senior Advisor on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
