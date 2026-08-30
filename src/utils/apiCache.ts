/**
 * MITTAL & CO. Universal Smart API Cache & Rate-Limit Protection System
 *
 * Provides:
 * 1. Dual-tier caching (In-Memory Heap + LocalStorage Persistence)
 * 2. In-flight Request Collapsing (Deduplicates simultaneous fetch calls)
 * 3. Stale-While-Revalidate Fallback Policy (Guarantees zero broken pages on API 429/quota limits)
 * 4. Configurable TTL (Default 30 minutes for real estate feeds)
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

class SmartApiCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private inFlightRequests: Map<string, Promise<any>> = new Map();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mc_cache_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const entry: CacheEntry<any> = JSON.parse(raw);
            const cacheKey = key.replace('mc_cache_', '');
            this.memoryCache.set(cacheKey, entry);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load cache from localStorage:', e);
    }
  }

  public get<T>(key: string): { data: T; isStale: boolean; timestamp: number } | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const isStale = age > entry.ttlMs;

    return { data: entry.data as T, isStale, timestamp: entry.timestamp };
  }

  public set<T>(key: string, data: T, ttlMs: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttlMs,
    };
    this.memoryCache.set(key, entry);

    try {
      localStorage.setItem(`mc_cache_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('Failed to persist cache to localStorage:', e);
    }
  }

  public async fetchWithCache<T>(
    key: string,
    ttlMs: number,
    fetcherFn: () => Promise<T>
  ): Promise<T> {
    // 1. Check existing fresh cache
    const cached = this.get<T>(key);
    if (cached && !cached.isStale) {
      return cached.data;
    }

    // 2. Collapse concurrent identical requests into a single promise
    if (this.inFlightRequests.has(key)) {
      return this.inFlightRequests.get(key)!;
    }

    // 3. Execute network fetch
    const fetchPromise = (async () => {
      try {
        const freshData = await fetcherFn();
        
        // Validate fresh data is valid before caching
        if (freshData !== null && freshData !== undefined) {
          // If the freshData is a NormalizedRecord with empty data, but we have cached data, don't overwrite!
          const record = freshData as any;
          if (record && Array.isArray(record.data) && record.data.length === 0 && cached && cached.data) {
            console.warn(`Network returned empty data for ${key}. Retaining cached version.`);
            return cached.data;
          }

          this.set(key, freshData, ttlMs);
          return freshData;
        }
      } catch (err) {
        console.warn(`Fetch failed for ${key}, falling back to cached telemetry:`, err);
      } finally {
        this.inFlightRequests.delete(key);
      }

      // 4. Return cached data if network/API fails (Stale Fallback Protection)
      if (cached && cached.data) {
        return cached.data;
      }

      throw new Error(`Failed to fetch data for key ${key} and no cache available.`);
    })();

    this.inFlightRequests.set(key, fetchPromise);
    return fetchPromise;
  }

  public clear(): void {
    this.memoryCache.clear();
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('mc_cache_')) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Failed to clear localStorage cache:', e);
    }
  }
}

export const apiCache = new SmartApiCache();
export const DEFAULT_CACHE_TTL_MS = 1000 * 60 * 30; // 30 Minutes
