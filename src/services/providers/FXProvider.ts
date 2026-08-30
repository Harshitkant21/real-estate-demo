import type { CurrencyData, NormalizedRecord } from '../../types';
import { fetchLiveFXRates } from '../liveDataServices';

export class FXProvider {
  public async getNormalizedRates(): Promise<NormalizedRecord<CurrencyData | null>> {
    return await fetchLiveFXRates();
  }
}

export const fxProvider = new FXProvider();
