import type { Property, NormalizedRecord } from '../../types';
import { fetchLiveProperties } from '../liveDataServices';

export class PropertyListingProvider {
  public async getNormalizedProperties(): Promise<NormalizedRecord<Property[]>> {
    return await fetchLiveProperties();
  }
}

export const propertyListingProvider = new PropertyListingProvider();

