import type { NormalizedRecord, MarketMetrics } from '../../types';
import { fetchLiveMarketMetrics } from '../liveDataServices';

export class DLDTransactionProvider {
  public async getNormalizedMetrics(): Promise<NormalizedRecord<MarketMetrics | null>> {
    return await fetchLiveMarketMetrics();
  }
}

export const dldTransactionProvider = new DLDTransactionProvider();
