import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { IntelligenceNotification } from '../../types';
import { DataStatusBadge } from '../shared/DataStatusBadge';
import { Bell, X, CheckCheck, TrendingUp, Landmark, ShieldCheck, RefreshCw, ChevronRight } from 'lucide-react';

interface Props {
  notifications: IntelligenceNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notification: IntelligenceNotification) => void;
}

export const NotificationDrawer = ({
  notifications,
  onMarkAllRead,
  onSelectNotification,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
        title="Market Intelligence Activity & Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Render Slide-Over Modal directly onto document.body using React Portal */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-Over Drawer Content */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-stone-200 flex flex-col justify-between z-10 overflow-y-auto animate-slideLeft">
              
              {/* Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center border border-amber-500/20 font-bold">
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury font-bold text-lg text-stone-900 leading-tight">
                      Market Intelligence Center
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Real-time Dubai telemetry & regulatory updates
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-[11px] text-amber-800 hover:underline font-bold flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Feed List */}
              <div className="p-4 space-y-3 flex-1">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-xs text-stone-500 space-y-2">
                    <Bell className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="font-semibold text-stone-700">No new notifications</p>
                    <p className="text-[11px] text-stone-400">All market alerts and regulatory updates have been reviewed.</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectNotification(item);
                        setIsOpen(false);
                      }}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                        item.read
                          ? 'bg-stone-50/70 border-stone-200 text-stone-600 opacity-80'
                          : 'bg-white border-amber-300 text-stone-900 shadow-xs hover:border-amber-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2 mb-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          {item.type === 'MARKET_MOVEMENT' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                          {item.type === 'REGULATORY_ANNOUNCEMENT' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                          {item.type === 'DLD_UPDATE' && <Landmark className="w-3.5 h-3.5 text-stone-700" />}
                          {item.type === 'FX_REFRESH' && <RefreshCw className="w-3.5 h-3.5 text-blue-600" />}
                          <span className="text-stone-900">{item.title}</span>
                        </div>

                        <DataStatusBadge status={item.dataStatus} sourceName={item.source} />
                      </div>

                      <p className="text-stone-600 leading-relaxed font-light text-[11px]">
                        {item.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <span>{item.timestamp}</span>
                        <span className="text-amber-800 font-bold flex items-center gap-0.5">
                          View Intelligence <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-stone-100 bg-stone-50 text-[11px] text-stone-500 text-center font-medium">
                Verified DLD Provenance · Source attribution attached to all events
              </div>

            </div>
          </div>,
          document.body
        )}
    </>
  );
};
