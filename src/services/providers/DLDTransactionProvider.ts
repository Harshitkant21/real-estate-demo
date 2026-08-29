import type { NormalizedRecord, MarketMetrics } from '../../types';
import { DATA_SOURCE_REGISTRY } from '../../config/dataSources';
import dldData from '../../data/dldBenchmarkData.json';

export class DLDTransactionProvider {
  public async getNormalizedMetrics(): Promise<NormalizedRecord<MarketMetrics>> {
    const meta = DATA_SOURCE_REGISTRY.DLD_PULSE;

    const metrics: MarketMetrics = {
      metadata: {
        source: meta.sourceName,
        lastUpdated: dldData.provenance.lastUpdated,
        dataStatus: meta.defaultStatus,
        confidenceScore: 95,
        attributionLink: 'https://www.dubailand.gov.ae',
      },
      overallScore: 84,
      marketOutlook: 'Positive',
      priceMomentumPercent: dldData.benchmarkIndices.yoyPriceGrowthPercent,
      transactionVolumeYoY: dldData.benchmarkIndices.yoyVolumeGrowthPercent,
      rentalYieldAvg: dldData.benchmarkIndices.avgNetRentalYieldPercent,
      supplyPressureScore: 38,
      areaSentiments: dldData.areaBenchmarks.map((item) => ({
        areaName: item.area,
        sentimentScore: Math.min(98, Math.round(item.avgYieldPercent * 11 + item.transactionVolumeYoY * 0.4)),
        status: item.transactionVolumeYoY > 20 ? 'Positive' : 'Neutral',
        keyDriver: `DLD transfers: ${item.dldRegistrationCount} registrations. ${item.transactionVolumeYoY}% YoY volume momentum`,
        avgPriceSqftAED: item.avgPriceSqftAED,
      })),
      sentimentDrivers: [
        'DLD 24h transactions recorded AED 1.28 Billion across Dubai residential corridors',
        'Official Residential Sales Index up +14.8% YoY per DLD transaction registry',
        'Golden Visa 10-year residency threshold driving AED 2M+ long-term acquisitions',
        'Zero UAE capital gains & zero personal income tax regime supporting HNW inflows',
        'RERA mandatory escrow accounts protecting off-plan milestone capital',
      ],
      historicalYieldsByArea: dldData.areaBenchmarks.map((item) => ({
        area: item.area,
        yieldPercent: item.avgYieldPercent,
        priceSqft: item.avgPriceSqftAED,
      })),
    };

    return {
      id: `dld-${dldData.provenance.lastUpdated}`,
      sourceMeta: meta,
      fetchedAt: new Date().toISOString(),
      lastUpdated: dldData.provenance.lastUpdated,
      dataStatus: meta.defaultStatus,
      confidence: 95,
      data: metrics,
      attribution: dldData.provenance.agency,
    };
  }
}

export const dldTransactionProvider = new DLDTransactionProvider();
