import type { CurrencyCode, CurrencyData, IntelligenceNotification } from '../../types';
import { CurrencySelector } from '../shared/CurrencySelector';
import { NotificationDrawer } from './NotificationDrawer';
import { whatsappService } from '../../services/whatsappService';
import { Bookmark, MessageSquare, Search } from 'lucide-react';


interface Props {
  selectedCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  currencyData: CurrencyData | null;
  savedCount: number;
  notifications: IntelligenceNotification[];
  onMarkAllNotificationsRead: () => void;
  onSelectNotification: (notification: IntelligenceNotification) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const Header = ({
  selectedCurrency,
  onSelectCurrency,
  currencyData,
  savedCount,
  notifications,
  onMarkAllNotificationsRead,
  onSelectNotification,
  activeTab,
  onSelectTab,
  onOpenSearch,
}: Props) => {
  const advisorUrl = whatsappService.getGeneralAdvisorUrl();

  const navLinks = [
    { id: 'explore', label: 'Properties' },
    { id: 'trends', label: 'Trends' },
    { id: 'market', label: 'Intelligence' },
    { id: 'launches', label: 'Launches' },
    { id: 'developers', label: 'Developers' },
    { id: 'studio', label: 'Studio' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F9F8F4]/95 backdrop-blur-md border-b border-[#E8E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 lg:h-28 gap-6">
          
          {/* MITTALCO Brand Identity */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center cursor-pointer group shrink-0 py-2"
          >
            <img
              src="/assets/logo.png"
              alt="MITTAL & CO. STRATEGIC ADVISOR"
              className="h-14 sm:h-18 lg:h-22 w-auto object-contain mix-blend-multiply transition-transform group-hover:scale-105"
            />
          </div>



          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-stone-700">
            {navLinks.map((nav) => (
              <button
                key={nav.id}
                onClick={() => onSelectTab(nav.id)}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap ${
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
          <div className="flex items-center gap-3 shrink-0">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                title="Search Properties"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Notification Drawer Trigger */}
            <NotificationDrawer
              notifications={notifications}
              onMarkAllRead={onMarkAllNotificationsRead}
              onSelectNotification={onSelectNotification}
            />

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

            {/* Advisor Desk Link */}
            <button
              onClick={() => onSelectTab('advisor')}
              className={`hidden md:inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                activeTab === 'advisor'
                  ? 'bg-amber-600 text-stone-950 border-amber-600 font-bold'
                  : 'bg-stone-100/80 text-stone-800 border-stone-200 hover:bg-stone-200'
              }`}
            >
              Advisor Desk
            </button>

            {/* WhatsApp Advisor CTA */}
            <a
              href={advisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-950 text-amber-400 hover:bg-stone-850 text-xs font-semibold rounded-xl shadow-xs transition-all border border-stone-800 shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Talk to Advisor</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};

