import type { NewsItem, NormalizedRecord } from '../../types';
import { DATA_SOURCE_REGISTRY } from '../../config/dataSources';
import { NewsListSchema } from '../../schemas/newsSchema';
import rawNews from '../../data/newsData.json';

export class NewsProvider {
  public async getNormalizedNews(): Promise<NormalizedRecord<NewsItem[]>> {
    const meta = DATA_SOURCE_REGISTRY.DUBAI_REAL_ESTATE_NEWS;
    const validated = NewsListSchema.parse(rawNews) as NewsItem[];

    return {
      id: 'news-feed-v1',
      sourceMeta: meta,
      fetchedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString().split('T')[0],
      dataStatus: meta.defaultStatus,
      confidence: 98,
      data: validated,
      attribution: meta.providerAgency,
    };
  }
}

export const newsProvider = new NewsProvider();
