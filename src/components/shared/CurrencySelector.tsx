import { useState, useMemo } from 'react';
import type { CurrencyCode, CurrencyData } from '../../types';
import { CURRENCY_SYMBOLS } from '../../utils/currency';
import { APP_CONFIG } from '../../config/appConfig';
import { RefreshCw, Check, Globe } from 'lucide-react';

interface Props {
  selectedCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  currencyData: CurrencyData | null;
  onRefreshRates?: () => void;
  isRefreshing?: boolean;
}

const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  AED: 'United Arab Emirates Dirham',
  USD: 'United States Dollar',
  EUR: 'Euro',
  GBP: 'British Pound Sterling',
  INR: 'Indian Rupee',
  SAR: 'Saudi Riyal',
};

export const CurrencySelector = ({
  selectedCurrency,
  onSelectCurrency,
  currencyData,
  onRefreshRates,
  isRefreshing = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusBadge = useMemo(() => {
    if (!currencyData) return { label: 'Fallback', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    switch (currencyData.status) {
      case 'Live':
        return { label: 'Live FX', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'Cached':
        return { label: 'Cached 12h', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      default:
        return { label: 'Fallback Rates', color: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  }, [currencyData]);

  const activeSymbol = CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 border border-stone-200 text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
      >
        <Globe className="w-3.5 h-3.5 text-amber-700" />
        <span>{selectedCurrency} ({activeSymbol})</span>
        <span className={`px-1.5 py-0.5 text-[10px] font-medium border rounded ${statusBadge.color}`}>
          {statusBadge.label}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-stone-100 text-[11px] font-semibold text-stone-500">
              <span>Select Investor Currency</span>
              {onRefreshRates && (
                <button
                  onClick={onRefreshRates}
                  disabled={isRefreshing}
                  className="p-1 hover:bg-stone-100 rounded transition-colors text-stone-600"
                  title="Refresh rates"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            <div className="py-1">
              {APP_CONFIG.supportedCurrencies.map((code) => {
                const currencyCode = code as CurrencyCode;
                const symbol = CURRENCY_SYMBOLS[currencyCode];
                const name = CURRENCY_NAMES[currencyCode];
                const isSelected = selectedCurrency === currencyCode;

                return (
                  <button
                    key={code}
                    onClick={() => {
                      onSelectCurrency(currencyCode);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{code}</span>
                        <span className="text-stone-500 font-normal">({symbol})</span>
                        {code === 'AED' && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-semibold">Base</span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 font-normal">{name}</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-amber-700" />}
                  </button>
                );
              })}
            </div>

            {currencyData && (
              <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-600 px-2 space-y-0.5">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-mono">Open Exchange Rates FX API</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate Status:</span>
                  <span className="font-semibold text-stone-700">{currencyData.status}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
