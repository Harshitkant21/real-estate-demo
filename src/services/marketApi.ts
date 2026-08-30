import type { MarketMetrics } from '../types';
import { fetchLiveMarketMetrics } from './liveDataServices';

export interface MarketDataProvider {
  getMarketMetrics(): Promise<MarketMetrics | null>;
}

export class LiveMarketDataProvider implements MarketDataProvider {
  public async getMarketMetrics(): Promise<MarketMetrics | null> {
    const res = await fetchLiveMarketMetrics();
    return res.data;
  }
}

export const marketService: MarketDataProvider = new LiveMarketDataProvider();
