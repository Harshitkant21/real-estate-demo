import type { DerivedMarketScore, MarketMetrics, MarketSentiment } from '../types';
import { DerivedMarketScoreSchema } from '../schemas/marketSchema';

export class MarketMetricsEngine {
  public calculateDerivedScore(metricsInput?: MarketMetrics | null): DerivedMarketScore {
    const priceMomentum = metricsInput?.priceMomentumPercent || 0;
    const volumeGrowth = metricsInput?.transactionVolumeYoY || 0;
    const yieldAvg = metricsInput?.rentalYieldAvg || 0;

    if (!metricsInput || metricsInput.overallScore === 0) {
      return DerivedMarketScoreSchema.parse({
        overallScore: 0,
        outlook: 'Cautious',
        priceMomentumPercent: 0,
        transactionVolumeYoY: 0,
        rentalYieldAvg: 0,
        supplyPressureScore: 0,
        contributingWeights: {
          transactionWeight: 0.35,
          priceWeight: 0.35,
          yieldWeight: 0.30,
        },
        dataSources: ['MITTALCO Intelligence Engine'],
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    }

    const scoreVal = Math.min(
      98,
      Math.round(35 + volumeGrowth * 1.5 + priceMomentum * 1.4 + yieldAvg * 2.2)
    );

    const outlook: 'Positive' | 'Neutral' | 'Cautious' =
      scoreVal >= 75 ? 'Positive' : scoreVal >= 60 ? 'Neutral' : 'Cautious';

    return DerivedMarketScoreSchema.parse({
      overallScore: scoreVal,
      outlook,
      priceMomentumPercent: priceMomentum,
      transactionVolumeYoY: volumeGrowth,
      rentalYieldAvg: yieldAvg,
      supplyPressureScore: 38,
      contributingWeights: {
        transactionWeight: 0.35,
        priceWeight: 0.35,
        yieldWeight: 0.30,
      },
      dataSources: [
        'Dubai Land Department (DLD) Telemetry Feed',
        'MITTALCO Intelligence Scoring Engine',
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  }

  public getMarketSentiment(metricsInput?: MarketMetrics | null): MarketSentiment {
    const derived = this.calculateDerivedScore(metricsInput);
    return {
      score: derived.overallScore,
      label: derived.overallScore === 0 ? 'Cautious' : derived.outlook === 'Positive' ? 'Bullish' : 'Constructive',

      dataStatus: metricsInput ? metricsInput.metadata.dataStatus : 'UNAVAILABLE',
      whyDrivers: metricsInput?.sentimentDrivers || ['Market metrics feed currently updating.'],
      keyRisks: [
        'Off-plan developer construction milestone delivery variances',
        'Global macroeconomic interest rate variations',
        'Seasonal short-term rental occupancy fluctuations',
      ],
    };
  }
}

export const marketMetricsEngine = new MarketMetricsEngine();

