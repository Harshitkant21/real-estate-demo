import type { CurrencyData, NormalizedRecord } from '../../types';
import { DATA_SOURCE_REGISTRY } from '../../config/dataSources';
import { currencyService } from '../currencyApi';

export class FXProvider {
  public async getNormalizedRates(): Promise<NormalizedRecord<CurrencyData>> {
    const meta = DATA_SOURCE_REGISTRY.OPEN_EXCHANGE_RATES;
    const currencyData = await currencyService.fetchRates();

    const dataStatus =
      currencyData.status === 'Live' ? 'LIVE' : currencyData.status === 'Cached' ? 'CACHED' : 'EDITORIAL';

    return {
      id: `fx-rates-${currencyData.lastFetchedTimestamp}`,
      sourceMeta: meta,
      fetchedAt: new Date(currencyData.lastFetchedTimestamp).toISOString(),
      lastUpdated: new Date(currencyData.lastFetchedTimestamp).toISOString().split('T')[0],
      dataStatus,
      confidence: 100,
      data: currencyData,
      attribution: 'Open Exchange Rates FX API',
    };
  }
}

export const fxProvider = new FXProvider();
