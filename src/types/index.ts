import { z } from 'zod';
import {
  PropertySchema,
  DeveloperSchema,
  LaunchSchema,
  AreaSchema,
  MediaSchema,
  ThesisSchema,
  FloorPlanSchema,
} from '../schemas/propertySchema';
import { DerivedMarketScoreSchema, DLDTransactionRecordSchema } from '../schemas/marketSchema';
import { EOIFormSchema } from '../schemas/formSchema';
import { AIAdvisorResponseSchema } from '../schemas/aiSchema';

export type Property = z.infer<typeof PropertySchema>;
export type Developer = z.infer<typeof DeveloperSchema>;
export type Launch = z.infer<typeof LaunchSchema>;
export type Area = z.infer<typeof AreaSchema>;
export type PropertyMedia = z.infer<typeof MediaSchema>;
export type InvestmentThesis = z.infer<typeof ThesisSchema>;
export type FloorPlan = z.infer<typeof FloorPlanSchema>;

export type DerivedMarketScore = z.infer<typeof DerivedMarketScoreSchema>;
export type DLDTransactionRecord = z.infer<typeof DLDTransactionRecordSchema>;

export type EOIForm = z.infer<typeof EOIFormSchema>;
export type AIAdvisorResponse = z.infer<typeof AIAdvisorResponseSchema>;

export type CurrencyCode = 'AED' | 'INR' | 'USD' | 'EUR' | 'GBP' | 'SAR';

export interface ExchangeRates {
  [currency: string]: number;
}

export type RateFetchStatus = 'Live' | 'Cached' | 'Fallback';

export interface CurrencyData {
  baseCurrency: 'AED';
  rates: ExchangeRates;
  lastFetchedTimestamp: number;
  expiresTimestamp: number;
  status: RateFetchStatus;
}

export interface TelemetryMetadata {
  source: string;
  lastUpdated: string;
  dataStatus: string;
  confidenceScore?: number;
}

export interface AreaSentiment {
  areaName: string;
  sentimentScore: number;
  status: 'Positive' | 'Neutral' | 'Negative';
  keyDriver: string;
}

export interface MarketMetrics {
  metadata: TelemetryMetadata;
  overallScore: number;
  marketOutlook: 'Positive' | 'Neutral' | 'Cautious';
  priceMomentumPercent: number;
  transactionVolumeYoY: number;
  rentalYieldAvg: number;
  supplyPressureScore: number;
  areaSentiments: AreaSentiment[];
  sentimentDrivers: string[];
  historicalYieldsByArea: { area: string; yieldPercent: number; priceSqft: number }[];
}

export interface InvestmentScenario {
  scenarioName: 'Conservative' | 'Base' | 'Optimistic';
  downPaymentPercent: number;
  mortgageRate: number;
  loanTermYears: number;
  holdingPeriodYears: number;
  annualAppreciation: number;
  occupancyRate: number;
}

export interface CalculationResult {
  propertyPriceAED: number;
  initialCapitalAED: number;
  loanAmountAED: number;
  monthlyMortgageAED: number;
  totalInvestmentOverHoldingAED: number;
  projectedGrossRentalIncomeAED: number;
  projectedNetRentalIncomeAED: number;
  projectedAppreciationAED: number;
  projectedTotalPortfolioValueAED: number;
  netROIPercent: number;
}
