import type {
  MarketMetrics,
  Property,
  Developer,
  Launch,
  NewsItem,
  CurrencyData,
  NormalizedRecord,
  MarketBriefReport,
} from '../../types';
import { dldTransactionProvider } from './DLDTransactionProvider';
import { propertyListingProvider } from './PropertyListingProvider';
import { newsProvider } from './NewsProvider';
import { fxProvider } from './FXProvider';
import { fetchLiveDevelopers, fetchLiveLaunches } from '../liveDataServices';

export class MarketDataOrchestrator {
  private cachedMetrics: NormalizedRecord<MarketMetrics | null> | null = null;
  private cachedProperties: NormalizedRecord<Property[]> | null = null;
  private cachedDevelopers: NormalizedRecord<Developer[]> | null = null;
  private cachedLaunches: NormalizedRecord<Launch[]> | null = null;
  private cachedNews: NormalizedRecord<NewsItem[]> | null = null;
  private cachedFX: NormalizedRecord<CurrencyData | null> | null = null;

  public async getMarketMetrics(): Promise<NormalizedRecord<MarketMetrics | null>> {
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

  public async getDevelopers(): Promise<NormalizedRecord<Developer[]>> {
    if (!this.cachedDevelopers) {
      this.cachedDevelopers = await fetchLiveDevelopers();
    }
    return this.cachedDevelopers;
  }

  public async getLaunches(): Promise<NormalizedRecord<Launch[]>> {
    if (!this.cachedLaunches) {
      this.cachedLaunches = await fetchLiveLaunches();
    }
    return this.cachedLaunches;
  }

  public async getNewsFeed(): Promise<NormalizedRecord<NewsItem[]>> {
    if (!this.cachedNews) {
      this.cachedNews = await newsProvider.getNormalizedNews();
    }
    return this.cachedNews;
  }

  public async getFXRates(): Promise<NormalizedRecord<CurrencyData | null>> {
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
      title: 'Dubai Real Estate — Mittalco Market Brief',
      generatedAt: new Date().toISOString().split('T')[0],
      dataStatus: metricsRecord.dataStatus,
      marketPosition: metrics
        ? `Dubai maintains constructive market momentum (+${metrics.priceMomentumPercent}% YoY) and vibrant buying activity (+${metrics.transactionVolumeYoY}% YoY) per official DLD registrations.`
        : 'Official DLD market telemetry is currently updating.',
      keyChanges: newsRecord.data.slice(0, 3).map((item) => `${item.headline} (${item.sourceName})`),
      areasToWatch: metrics
        ? metrics.areaSentiments.map((area) => ({
            area: area.areaName,
            momentumScore: area.sentimentScore,
            thesis: area.keyDriver,
          }))
        : [],
      dataEvidence: metrics
        ? [
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
          ]
        : [
            {
              metric: 'UAE Golden Visa Threshold',
              value: 'AED 2,000,000 Minimum Property Equity',
              source: 'UAE Federal Portal',
            },
          ],
      investorTakeaway:
        'With 0% UAE personal income tax and capital gains tax, long-term capital preservation is optimized by targeting prime waterfront developments with strong developer track records.',
      riskConsiderations: [
        'Construction milestone phase variations across off-plan developers',
        'Seasonal holiday home short-term rental occupancy fluctuations',
        'Global macroeconomic interest rate adjustments influencing mortgage yields',
      ],
      upcomingEvents: [
        'Quarterly DLD Open Data Report Release',
        'Developer Master Project Handover Releases',
      ],
      sourceRegister: [
        'Property Finder API via RapidAPI',
        'Open Exchange Rates FX API',
        'MITTALCO Editorial Research Desk',
      ],
    };
  }
}

export const marketDataOrchestrator = new MarketDataOrchestrator();
