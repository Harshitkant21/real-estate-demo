import type { Property, NormalizedRecord } from '../../types';
import { DATA_SOURCE_REGISTRY } from '../../config/dataSources';
import { PropertyListSchema } from '../../schemas/propertySchema';
import rawProperties from '../../data/properties.json';

export class PropertyListingProvider {
  public async getNormalizedProperties(): Promise<NormalizedRecord<Property[]>> {
    const meta = DATA_SOURCE_REGISTRY.AM_EDITORIAL_DOSSIERS;
    const validated = PropertyListSchema.parse(rawProperties) as Property[];

    return {
      id: 'properties-catalog-v1',
      sourceMeta: meta,
      fetchedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString().split('T')[0],
      dataStatus: meta.defaultStatus,
      confidence: 100,
      data: validated,
      attribution: 'AM Estates Editorial Research Desk',
    };
  }
}

export const propertyListingProvider = new PropertyListingProvider();
