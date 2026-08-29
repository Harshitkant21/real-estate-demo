import { z } from 'zod';

export const DLDTransactionRecordSchema = z.object({
  transactionId: z.string(),
  areaName: z.string(),
  propertyType: z.string(),
  priceAED: z.number().positive(),
  sizeSqft: z.number().positive(),
  pricePerSqftAED: z.number().positive(),
  registrationDate: z.string(),
});

export const ContributingWeightsSchema = z.object({
  transactionWeight: z.number(),
  priceWeight: z.number(),
  yieldWeight: z.number(),
});

export const DerivedMarketScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  outlook: z.enum(['Positive', 'Neutral', 'Cautious']),
  priceMomentumPercent: z.number(),
  transactionVolumeYoY: z.number(),
  rentalYieldAvg: z.number(),
  supplyPressureScore: z.number(),
  contributingWeights: ContributingWeightsSchema,
  dataSources: z.array(z.string()),
  lastUpdated: z.string(),
});
