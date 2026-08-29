import type { InvestmentScenario, CalculationResult } from '../types';

export const DEFAULT_SCENARIOS: Record<'Conservative' | 'Base' | 'Optimistic', InvestmentScenario> = {
  Conservative: {
    scenarioName: 'Conservative',
    downPaymentPercent: 20,
    mortgageRate: 4.8,
    loanTermYears: 25,
    holdingPeriodYears: 5,
    annualAppreciation: 4.5,
    occupancyRate: 85,
  },
  Base: {
    scenarioName: 'Base',
    downPaymentPercent: 20,
    mortgageRate: 4.2,
    loanTermYears: 25,
    holdingPeriodYears: 5,
    annualAppreciation: 7.5,
    occupancyRate: 92,
  },
  Optimistic: {
    scenarioName: 'Optimistic',
    downPaymentPercent: 20,
    mortgageRate: 3.8,
    loanTermYears: 25,
    holdingPeriodYears: 5,
    annualAppreciation: 11.0,
    occupancyRate: 96,
  },
};

export function calculateInvestmentModel(
  propertyPriceAED: number,
  rentalYieldPercent: number,
  scenario: InvestmentScenario
): CalculationResult {
  const downPayment = (propertyPriceAED * scenario.downPaymentPercent) / 100;
  const DLDAndFeeCosts = propertyPriceAED * 0.04; // 4% DLD Transfer Fee
  const initialCapitalAED = downPayment + DLDAndFeeCosts;

  const loanAmountAED = propertyPriceAED - downPayment;
  const monthlyRate = scenario.mortgageRate / 100 / 12;
  const numberOfPayments = scenario.loanTermYears * 12;

  let monthlyMortgageAED = 0;
  if (loanAmountAED > 0 && monthlyRate > 0) {
    monthlyMortgageAED =
      (loanAmountAED * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  // Rental income over holding period adjusted by occupancy
  const grossAnnualRentalAED = propertyPriceAED * (rentalYieldPercent / 100);
  const adjustedAnnualRentalAED = grossAnnualRentalAED * (scenario.occupancyRate / 100);
  const maintenanceAndServiceAED = grossAnnualRentalAED * 0.12; // 12% service/maintenance reserve
  const netAnnualRentalAED = adjustedAnnualRentalAED - maintenanceAndServiceAED;

  const projectedGrossRentalIncomeAED = grossAnnualRentalAED * scenario.holdingPeriodYears;
  const projectedNetRentalIncomeAED = netAnnualRentalAED * scenario.holdingPeriodYears;

  // Capital appreciation compounded over holding period
  const appreciationFactor = Math.pow(1 + scenario.annualAppreciation / 100, scenario.holdingPeriodYears);
  const projectedTotalPortfolioValueAED = propertyPriceAED * appreciationFactor;
  const projectedAppreciationAED = projectedTotalPortfolioValueAED - propertyPriceAED;

  const totalInvestmentOverHoldingAED = initialCapitalAED + monthlyMortgageAED * 12 * scenario.holdingPeriodYears;

  // Total return = Net rental cash flow + Capital Gain
  const totalNetGainAED = projectedNetRentalIncomeAED + projectedAppreciationAED;
  const netROIPercent = initialCapitalAED > 0 ? (totalNetGainAED / initialCapitalAED) * 100 : 0;

  return {
    propertyPriceAED,
    initialCapitalAED,
    loanAmountAED,
    monthlyMortgageAED,
    totalInvestmentOverHoldingAED,
    projectedGrossRentalIncomeAED,
    projectedNetRentalIncomeAED,
    projectedAppreciationAED,
    projectedTotalPortfolioValueAED,
    netROIPercent,
  };
}
