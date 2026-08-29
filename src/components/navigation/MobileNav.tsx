import { Compass, TrendingUp, FileText, Calculator, UserCheck } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
}

export const MobileNav = ({ activeTab, onSelectTab }: Props) => {
  const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'brief', label: 'Brief', icon: FileText },
    { id: 'studio', label: 'Calculator', icon: Calculator },
    { id: 'advisor', label: 'Advisor', icon: UserCheck },
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-md border-t border-stone-850 text-stone-300 shadow-2xl px-2 py-1.5">
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
            </button>
          );
        })}
      </div>
    </nav>
  );
};
