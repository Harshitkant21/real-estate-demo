import { Home, Compass, TrendingUp, Calculator, Bookmark } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
}

export const MobileNav = ({ activeTab, onSelectTab, savedCount }: Props) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Properties', icon: Compass },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'studio', label: 'Calculator', icon: Calculator },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-md border-t border-stone-850 text-stone-300 shadow-2xl px-2 py-1.5">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-amber-400 scale-110' : 'text-stone-400'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-2 w-3.5 h-3.5 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
