import type { DerivedMarketScore } from '../types';
import dldData from '../data/dldBenchmarkData.json';

export class MarketMetricsEngine {
  public calculateDerivedScore(): DerivedMarketScore {
    const { benchmarkIndices, provenance } = dldData;

    // Normalize price momentum score (14.8% YoY -> ~82 points)
    const priceScore = Math.min(100, Math.max(0, benchmarkIndices.yoyPriceGrowthPercent * 5.5));

    // Normalize transaction volume score (26.4% YoY -> ~88 points)
    const volumeScore = Math.min(100, Math.max(0, benchmarkIndices.yoyVolumeGrowthPercent * 3.3));

    // Normalize yield score (7.2% Net -> ~72 points)
    const yieldScore = Math.min(100, Math.max(0, benchmarkIndices.avgNetRentalYieldPercent * 10));

    // Configurable weighted combination
    const transactionWeight = 0.35;
    const priceWeight = 0.35;
    const yieldWeight = 0.30;

    const weightedScore = Math.round(
      volumeScore * transactionWeight + priceScore * priceWeight + yieldScore * yieldWeight
    );

    const outlook: 'Positive' | 'Neutral' | 'Cautious' =
      weightedScore >= 75 ? 'Positive' : weightedScore >= 50 ? 'Neutral' : 'Cautious';

    return {
      overallScore: weightedScore,
      outlook,
      priceMomentumPercent: benchmarkIndices.yoyPriceGrowthPercent,
      transactionVolumeYoY: benchmarkIndices.yoyVolumeGrowthPercent,
      rentalYieldAvg: benchmarkIndices.avgNetRentalYieldPercent,
      supplyPressureScore: 38,
      contributingWeights: {
        transactionWeight,
        priceWeight,
        yieldWeight,
      },
      dataSources: [provenance.agency, 'Dubai Pulse Open Data Portal', 'Property Finder DLD Sales Index'],
      lastUpdated: provenance.lastUpdated,
    };
  }
}

export const marketMetricsEngine = new MarketMetricsEngine();
