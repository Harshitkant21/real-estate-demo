import type { CurrencyCode, ExchangeRates } from '../types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  AED: 'AED',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  SAR: 'SAR',
};

export function convertFromAED(aedPrice: number, targetCurrency: CurrencyCode, rates: ExchangeRates): number {
  const rate = rates[targetCurrency] || 1;
  return aedPrice * rate;
}

export function formatCurrencyValue(amount: number, currency: CurrencyCode): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  if (currency === 'INR') {
    // Special formatting for Indian Rupees (Lakhs & Crores)
    if (amount >= 10000000) {
      const crore = amount / 10000000;
      return `${symbol}${crore.toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      const lakh = amount / 100000;
      return `${symbol}${lakh.toFixed(2)} L`;
    }
  } else if (currency === 'USD' || currency === 'EUR' || currency === 'GBP') {
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `${symbol}${Math.round(amount / 1000)}K`;
    }
  }

  // Standard comma formatting
  return `${symbol} ${Math.round(amount).toLocaleString()}`;
}

export function formatConvertedPrice(
  aedPrice: number,
  targetCurrency: CurrencyCode,
  rates: ExchangeRates
): { formatted: string; amount: number; symbol: string } {
  const amount = convertFromAED(aedPrice, targetCurrency, rates);
  const formatted = formatCurrencyValue(amount, targetCurrency);
  return {
    formatted,
    amount,
    symbol: CURRENCY_SYMBOLS[targetCurrency] || targetCurrency,
  };
}
