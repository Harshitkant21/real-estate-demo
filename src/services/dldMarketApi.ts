import type { MarketMetrics } from '../types';
import { marketMetricsEngine } from './marketMetricsEngine';
import dldData from '../data/dldBenchmarkData.json';

export class DLDMarketDataProvider {
  public async getMarketMetrics(): Promise<MarketMetrics> {
    const derived = marketMetricsEngine.calculateDerivedScore();

    return {
      metadata: {
        source: dldData.provenance.agency,
        lastUpdated: dldData.provenance.lastUpdated,
        dataStatus: dldData.provenance.freshnessStatus,
        confidenceScore: 94,
      },
      overallScore: derived.overallScore,
      marketOutlook: derived.outlook,
      priceMomentumPercent: derived.priceMomentumPercent,
      transactionVolumeYoY: derived.transactionVolumeYoY,
      rentalYieldAvg: derived.rentalYieldAvg,
      supplyPressureScore: derived.supplyPressureScore,
      areaSentiments: [
        {
          areaName: 'Palm Jebel Ali',
          sentimentScore: 94,
          status: 'Positive',
          keyDriver: 'DLD registrations show 44.5% YoY volume growth in luxury frond cove villas',
        },
        {
          areaName: 'Dubai Creek Harbour',
          sentimentScore: 88,
          status: 'Positive',
          keyDriver: 'High absorption rate across 600m natural beach corridor towers',
        },
        {
          areaName: 'Palm Jumeirah',
          sentimentScore: 86,
          status: 'Positive',
          keyDriver: 'DLD benchmark price/sqft AED 3,600 with zero vacant land supply',
        },
        {
          areaName: 'Dubai Hills Estate',
          sentimentScore: 81,
          status: 'Positive',
          keyDriver: 'Family expat villa transfers up 22.8% YoY',
        },
        {
          areaName: 'Downtown Dubai',
          sentimentScore: 75,
          status: 'Positive',
          keyDriver: 'Burj Khalifa corridor holiday home short-term yields averaging 6.8% Net',
        },
        {
          areaName: 'Business Bay',
          sentimentScore: 71,
          status: 'Neutral',
          keyDriver: 'Water canal residential transfers showing steady professional tenant absorption',
        },
      ],
      sentimentDrivers: [
        'DLD registered 24h sales volume exceeding AED 1.28 Billion',
        'Official Residential Sales Index up +14.8% YoY according to DLD data',
        'UAE Golden Visa 10-year residency threshold driving AED 2M+ long-term acquisitions',
        'Zero UAE capital gains & zero personal income tax regime supporting HNW inflows',
        'RERA mandatory escrow accounts protecting off-plan milestone capital',
      ],
      historicalYieldsByArea: dldData.areaBenchmarks.map((item) => ({
        area: item.area,
        yieldPercent: item.avgYieldPercent,
        priceSqft: item.avgPriceSqftAED,
      })),
    };
  }
}

export const dldMarketService = new DLDMarketDataProvider();
