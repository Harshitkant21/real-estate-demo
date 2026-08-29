import type { CurrencyData, ExchangeRates } from '../types';
import { APP_CONFIG } from '../config/appConfig';

const STORAGE_KEY = 'amestates_currency_rates_v1';

// Static fallback rates (AED canonical base)
const STATIC_FALLBACK_RATES: ExchangeRates = {
  AED: 1.0,
  USD: 0.27229, // 1 USD ~ 3.6725 AED
  EUR: 0.24875, // 1 EUR ~ 4.02 AED
  GBP: 0.21052, // 1 GBP ~ 4.75 AED
  INR: 22.7272, // 1 AED ~ 22.73 INR
  SAR: 1.02041, // 1 SAR ~ 0.98 AED
};

export interface CurrencyRateProvider {
  fetchRates(): Promise<CurrencyData>;
}

export class ExchangeRateApiProvider implements CurrencyRateProvider {
  private apiUrl: string;
  private cacheDurationMs: number;

  constructor(apiUrl = APP_CONFIG.exchangeRateApiUrl, cacheDurationMs = APP_CONFIG.rateCacheDurationMs) {
    this.apiUrl = apiUrl;
    this.cacheDurationMs = cacheDurationMs;
  }

  public getCachedRates(): CurrencyData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed: CurrencyData = JSON.parse(raw);
      if (Date.now() < parsed.expiresTimestamp) {
        return {
          ...parsed,
          status: 'Cached',
        };
      }
    } catch {
      // Ignore localStorage parse errors
    }
    return null;
  }

  public async fetchRates(): Promise<CurrencyData> {
    // 1. Check valid cache first
    const cached = this.getCachedRates();
    if (cached) {
      return cached;
    }

    // 2. Attempt network fetch with 5-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(this.apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data && data.rates) {
        const now = Date.now();
        const fetchedData: CurrencyData = {
          baseCurrency: 'AED',
          rates: {
            AED: 1.0,
            USD: data.rates.USD || STATIC_FALLBACK_RATES.USD,
            EUR: data.rates.EUR || STATIC_FALLBACK_RATES.EUR,
            GBP: data.rates.GBP || STATIC_FALLBACK_RATES.GBP,
            INR: data.rates.INR || STATIC_FALLBACK_RATES.INR,
            SAR: data.rates.SAR || STATIC_FALLBACK_RATES.SAR,
          },
          lastFetchedTimestamp: now,
          expiresTimestamp: now + this.cacheDurationMs,
          status: 'Live',
        };

        // Cache rates locally
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedData));
        return fetchedData;
      }
    } catch {
      clearTimeout(timeoutId);
    }

    // 3. Network failed / timed out -> return fallback rates
    const now = Date.now();
    return {
      baseCurrency: 'AED',
      rates: STATIC_FALLBACK_RATES,
      lastFetchedTimestamp: now,
      expiresTimestamp: now + this.cacheDurationMs,
      status: 'Fallback',
    };
  }
}

export const currencyService = new ExchangeRateApiProvider();
