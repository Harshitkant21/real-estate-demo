import type { CurrencyCode, CurrencyData } from '../../types';
import { CurrencySelector } from '../shared/CurrencySelector';
import { whatsappService } from '../../services/whatsappService';
import { Building2, Bookmark, MessageSquare, Search } from 'lucide-react';

interface Props {
  selectedCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  currencyData: CurrencyData | null;
  savedCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const Header = ({
  selectedCurrency,
  onSelectCurrency,
  currencyData,
  savedCount,
  activeTab,
  onSelectTab,
  onOpenSearch,
}: Props) => {
  const advisorUrl = whatsappService.getGeneralAdvisorUrl();

  const navLinks = [
    { id: 'explore', label: 'Explore' },
    { id: 'market', label: 'Market' },
    { id: 'brief', label: 'Brief' },
    { id: 'news', label: 'News' },
    { id: 'launches', label: 'Launches' },
    { id: 'developers', label: 'Developers' },
    { id: 'studio', label: 'Calculator' },
    { id: 'advisor', label: 'Advisor' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F9F8F4]/95 backdrop-blur-md border-b border-[#E5E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Identity */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-950 flex items-center justify-center text-amber-400 shadow-md group-hover:bg-amber-800 transition-colors">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif-luxury font-bold tracking-tight text-stone-900">
                AM ESTATES
              </span>
              <span className="block text-[10px] uppercase tracking-widest font-semibold text-amber-800">
                Dubai Private Wealth
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider text-stone-700">
            {navLinks.map((nav) => (
              <button
                key={nav.id}
                onClick={() => onSelectTab(nav.id)}
                className={`py-2 border-b-2 transition-colors ${
                  activeTab === nav.id
                    ? 'border-amber-700 text-stone-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                title="Search Properties & Hubs"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Currency Selector */}
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              onSelectCurrency={onSelectCurrency}
              currencyData={currencyData}
            />

            {/* Saved Workspace Trigger */}
            <button
              onClick={() => onSelectTab('saved')}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              title="Saved Workspace"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Talk to an Advisor WhatsApp CTA */}
            <a
              href={advisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-stone-900 text-amber-400 hover:bg-stone-800 text-xs font-semibold rounded-xl shadow-sm transition-all border border-stone-800"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Talk to Advisor</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
