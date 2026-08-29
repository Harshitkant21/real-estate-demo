import { useState, useMemo } from 'react';
import type { CurrencyCode, ExchangeRates, InvestmentScenario } from '../types';
import { DEFAULT_SCENARIOS, calculateInvestmentModel } from '../utils/calculations';
import { formatConvertedPrice } from '../utils/currency';
import { whatsappService } from '../services/whatsappService';
import { Calculator, MessageSquare } from 'lucide-react';

interface Props {
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  initialPriceAED?: number;
}

export const InvestmentStudio = ({
  selectedCurrency,
  rates,
  initialPriceAED = 2450000,
}: Props) => {
  const [propertyPriceAED, setPropertyPriceAED] = useState<number>(initialPriceAED);
  const [rentalYieldPercent, setRentalYieldPercent] = useState<number>(6.8);
  const [scenarioName, setScenarioName] = useState<'Conservative' | 'Base' | 'Optimistic'>('Base');

  const [customScenario, setCustomScenario] = useState<InvestmentScenario>(DEFAULT_SCENARIOS.Base);

  // Update custom scenario when preset buttons are clicked
  const handleSelectPreset = (name: 'Conservative' | 'Base' | 'Optimistic') => {
    setScenarioName(name);
    setCustomScenario(DEFAULT_SCENARIOS[name]);
  };

  const results = useMemo(() => {
    return calculateInvestmentModel(propertyPriceAED, rentalYieldPercent, customScenario);
  }, [propertyPriceAED, rentalYieldPercent, customScenario]);

  const formattedPrice = formatConvertedPrice(results.propertyPriceAED, selectedCurrency, rates);
  const formattedInitialCapital = formatConvertedPrice(results.initialCapitalAED, selectedCurrency, rates);
  const formattedNetRental = formatConvertedPrice(results.projectedNetRentalIncomeAED, selectedCurrency, rates);
  const formattedAppreciation = formatConvertedPrice(results.projectedAppreciationAED, selectedCurrency, rates);
  const formattedTotalValue = formatConvertedPrice(results.projectedTotalPortfolioValueAED, selectedCurrency, rates);

  const whatsappUrl = whatsappService.getInvestmentStudioUrl(
    results.propertyPriceAED,
    formattedPrice.formatted,
    results.netROIPercent
  );

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner - Dark Panel */}
      <div className="dark-panel rounded-3xl p-6 sm:p-8 space-y-3 border border-stone-800">
        <div className="flex items-center gap-3 text-amber-400">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
              Dubai Investment Calculator
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Model upfront capital requirements, milestone payments, and estimated 5-year returns.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-1 bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="font-serif-luxury font-bold text-lg text-stone-900 border-b border-stone-100 pb-2">
            Your Investment Parameters
          </h3>

          {/* Scenario Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Investment Outlook Scenario
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Conservative', 'Base', 'Optimistic'] as const).map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelectPreset(name)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    scenarioName === name
                      ? 'bg-amber-600 text-stone-950 border-amber-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Property Price Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-700">Property Budget (AED)</span>
              <span className="text-amber-800 font-bold">{formattedPrice.formatted}</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={30000000}
              step={250000}
              value={propertyPriceAED}
              onChange={(e) => setPropertyPriceAED(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-600 font-mono">
              <span>AED 1.0M</span>
              <span>AED 30.0M</span>
            </div>
          </div>

          {/* Rental Yield Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-700">Estimated Rental Yield (% p.a.)</span>
              <span className="text-stone-900 font-bold">{rentalYieldPercent}%</span>
            </div>
            <input
              type="range"
              min={4.0}
              max={10.0}
              step={0.1}
              value={rentalYieldPercent}
              onChange={(e) => setRentalYieldPercent(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
          </div>

          {/* Capital Appreciation Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-700">Annual Value Growth (%)</span>
              <span className="text-stone-900 font-bold">{customScenario.annualAppreciation}%</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={15.0}
              step={0.5}
              value={customScenario.annualAppreciation}
              onChange={(e) => setCustomScenario({ ...customScenario, annualAppreciation: Number(e.target.value) })}
              className="w-full accent-amber-700 cursor-pointer"
            />
          </div>

          {/* Holding Period */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-700">Investment Horizon</span>
              <span className="text-stone-900 font-bold">{customScenario.holdingPeriodYears} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={customScenario.holdingPeriodYears}
              onChange={(e) => setCustomScenario({ ...customScenario, holdingPeriodYears: Number(e.target.value) })}
              className="w-full accent-amber-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Results Outputs Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Highlight KPI Panel */}
          <div className="dark-panel rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                  Your {customScenario.holdingPeriodYears}-Year Outlook
                </span>
                <h3 className="font-serif-luxury font-bold text-2xl text-white">
                  Calculated Projections ({selectedCurrency})
                </h3>
              </div>

              <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Estimated Total Return</span>
                <span className="text-2xl font-bold text-amber-400">+{results.netROIPercent.toFixed(1)}%</span>
              </div>
            </div>

            {/* Main Calculated Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-400 font-semibold block">Upfront Investment</span>
                <span className="text-lg font-bold text-white">{formattedInitialCapital.formatted}</span>
                <span className="text-[10px] text-stone-400 block">Down payment ({customScenario.downPaymentPercent}%) + 4% DLD transfer fee</span>
              </div>

              <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-400 font-semibold block">Estimated Rental Income ({customScenario.holdingPeriodYears} yrs)</span>
                <span className="text-lg font-bold text-emerald-400">+{formattedNetRental.formatted}</span>
                <span className="text-[10px] text-stone-400 block">Adjusted for {customScenario.occupancyRate}% occupancy & service fees</span>
              </div>

              <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-400 font-semibold block">Estimated Value Growth</span>
                <span className="text-lg font-bold text-amber-400">+{formattedAppreciation.formatted}</span>
                <span className="text-[10px] text-stone-400 block">Compounded at {customScenario.annualAppreciation}% p.a.</span>
              </div>

              <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-1">
                <span className="text-stone-400 font-semibold block">Estimated Total Value</span>
                <span className="text-lg font-bold text-white">{formattedTotalValue.formatted}</span>
                <span className="text-[10px] text-stone-400 block">Property value at Year {customScenario.holdingPeriodYears}</span>
              </div>
            </div>

            {/* Disclaimer Note */}
            <div className="p-3 bg-stone-950/60 rounded-lg text-[10px] text-stone-400 border border-stone-800">
              Disclaimer: All calculations are illustrative estimates based on compounding financial math equations and historical DLD market indices. Projections do not constitute guaranteed investment returns.
            </div>
          </div>

          {/* Action CTA */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="font-serif-luxury font-bold text-base text-stone-900">
                Discuss Your Investment Model with an Advisor
              </h4>
              <p className="text-xs text-stone-500">
                Send your configured parameters directly to a Senior Advisor on WhatsApp.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Discuss Calculation on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};
