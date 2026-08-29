import type { MarketMetrics } from '../types';
import demoMarketDataRaw from '../data/demoMarketData.json';

export interface MarketDataProvider {
  getMarketMetrics(): Promise<MarketMetrics>;
}

export class DemoMarketDataProvider implements MarketDataProvider {
  public async getMarketMetrics(): Promise<MarketMetrics> {
    // Simulate lightweight async fetch
    return demoMarketDataRaw as MarketMetrics;
  }
}

export const marketService: MarketDataProvider = new DemoMarketDataProvider();
