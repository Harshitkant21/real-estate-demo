import type {
  MarketMetrics,
  Property,
  NewsItem,
  CurrencyData,
  NormalizedRecord,
  MarketBriefReport,
} from '../../types';
import { dldTransactionProvider } from './DLDTransactionProvider';
import { propertyListingProvider } from './PropertyListingProvider';
import { newsProvider } from './NewsProvider';
import { fxProvider } from './FXProvider';

export class MarketDataOrchestrator {
  private cachedMetrics: NormalizedRecord<MarketMetrics> | null = null;
  private cachedProperties: NormalizedRecord<Property[]> | null = null;
  private cachedNews: NormalizedRecord<NewsItem[]> | null = null;
  private cachedFX: NormalizedRecord<CurrencyData> | null = null;

  public async getMarketMetrics(): Promise<NormalizedRecord<MarketMetrics>> {
    if (!this.cachedMetrics) {
      this.cachedMetrics = await dldTransactionProvider.getNormalizedMetrics();
    }
    return this.cachedMetrics;
  }

  public async getProperties(): Promise<NormalizedRecord<Property[]>> {
    if (!this.cachedProperties) {
      this.cachedProperties = await propertyListingProvider.getNormalizedProperties();
    }
    return this.cachedProperties;
  }

  public async getNewsFeed(): Promise<NormalizedRecord<NewsItem[]>> {
    if (!this.cachedNews) {
      this.cachedNews = await newsProvider.getNormalizedNews();
    }
    return this.cachedNews;
  }

  public async getFXRates(): Promise<NormalizedRecord<CurrencyData>> {
    if (!this.cachedFX) {
      this.cachedFX = await fxProvider.getNormalizedRates();
    }
    return this.cachedFX;
  }

  public async generateMarketBrief(): Promise<MarketBriefReport> {
    const metricsRecord = await this.getMarketMetrics();
    const newsRecord = await this.getNewsFeed();
    const metrics = metricsRecord.data;

    return {
      title: 'Dubai Real Estate — Market Brief',
      generatedAt: new Date().toISOString().split('T')[0],
      dataStatus: metricsRecord.dataStatus,
      marketPosition: `Dubai maintains strong price momentum (+${metrics.priceMomentumPercent}% YoY) and vibrant transaction volume (+${metrics.transactionVolumeYoY}% YoY) per official DLD registrations. Net rental yields average ${metrics.rentalYieldAvg}% across waterfront and master-planned golf communities.`,
      keyChanges: newsRecord.data.slice(0, 3).map((item) => `${item.headline} (${item.sourceName})`),
      areasToWatch: metrics.areaSentiments.map((area) => ({
        area: area.areaName,
        momentumScore: area.sentimentScore,
        thesis: area.keyDriver,
      })),
      dataEvidence: [
        {
          metric: 'Official DLD Sales Growth Index',
          value: `+${metrics.priceMomentumPercent}% YoY`,
          source: metrics.metadata.source,
        },
        {
          metric: 'DLD 24h Transaction Index',
          value: `+${metrics.transactionVolumeYoY}% YoY`,
          source: metrics.metadata.source,
        },
        {
          metric: 'Average Net Rental Yield',
          value: `${metrics.rentalYieldAvg}% Net`,
          source: metrics.metadata.source,
        },
        {
          metric: 'UAE Golden Visa Threshold',
          value: 'AED 2,000,000 Minimum Property Equity',
          source: 'UAE Federal Portal',
        },
      ],
      investorTakeaway:
        'With 0% UAE personal income tax and capital gains tax, long-term capital preservation is optimized by targeting prime waterfront developments with strong developer track records and high rental absorption rates.',
      riskConsiderations: [
        'Construction milestone phase variations across off-plan developers',
        'Seasonal holiday home short-term rental occupancy fluctuations',
        'Global macroeconomic interest rate adjustments influencing mortgage yields',
      ],
      upcomingEvents: [
        'Quarterly DLD Open Data Report Release',
        'Nakheel Palm Jebel Ali Frond Phase 2 Release',
        'Emaar Creek Harbour Promenade Handover',
      ],
      sourceRegister: [
        metrics.metadata.source,
        'Open Exchange Rates FX API',
        'AM Estates Editorial Research Desk',
        'Government of Dubai Media Office Wire',
      ],
    };
  }
}

export const marketDataOrchestrator = new MarketDataOrchestrator();
