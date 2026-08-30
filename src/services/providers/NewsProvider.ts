import type { NewsItem, NormalizedRecord } from '../../types';
import { fetchLiveNewsFeed } from '../liveDataServices';

export class NewsProvider {
  public async getNormalizedNews(): Promise<NormalizedRecord<NewsItem[]>> {
    return await fetchLiveNewsFeed();
  }
}

export const newsProvider = new NewsProvider();

