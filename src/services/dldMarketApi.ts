import type { MarketMetrics } from '../types';
import { fetchLiveMarketMetrics } from './liveDataServices';

export class DLDMarketDataProvider {
  public async getMarketMetrics(): Promise<MarketMetrics | null> {
    const record = await fetchLiveMarketMetrics();
    return record.data;
  }
}

export const dldMarketService = new DLDMarketDataProvider();
