import { useState } from 'react';
import type { AIAdvisorResponse, SimplifiedInvestorBrief } from '../../types';
import { aiAdvisorService } from '../../services/aiAdvisorService';
import { whatsappService } from '../../services/whatsappService';
import { Sparkles, Bot, ArrowRight, ShieldCheck, AlertCircle, MessageSquare, Building2, RefreshCw } from 'lucide-react';

interface Props {
  onSelectPropertyByName?: (name: string) => void;
}

export const AskAMAdvisor = ({ onSelectPropertyByName }: Props) => {
  const [briefInput, setBriefInput] = useState<SimplifiedInvestorBrief>({
    budgetTier: 'AED 2M',
    objective: 'Balance of Both',
    timeline: 'Next 3 months',
    propertyType: 'Apartment',
    locationPreference: 'Waterfront',
  });

  const [prompt, setPrompt] = useState('I want a balanced waterfront property with Golden Visa eligibility and steady rental returns.');
  const [budgetAED, setBudgetAED] = useState(2500000);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIAdvisorResponse | null>(null);

  const handleRunAdvisor = async () => {
    setIsLoading(true);
    try {
      const fullPrompt = `${prompt}. Budget Tier: ${briefInput.budgetTier}, Goal: ${briefInput.objective}, Property: ${briefInput.propertyType}, Location: ${briefInput.locationPreference}, Timeline: ${briefInput.timeline}`;
      const res = await aiAdvisorService.queryAdvisor(fullPrompt, budgetAED, briefInput);
      setResponse(res);
    } catch (err) {
      console.error('Mittalco Intelligence error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappUrl = whatsappService.getGeneralAdvisorUrl();

  return (
    <div className="dark-panel rounded-3xl p-6 sm:p-10 space-y-6 border border-stone-800 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-luxury font-bold text-2xl text-white">Mittalco Intelligence Analyst</h3>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                AI Reasoning Engine
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Interactive private wealth advisor analyzing official Dubai Land Department transaction trends.
            </p>
          </div>
        </div>
      </div>

      {/* Simplified Intuitive Investor Brief Intake Form */}
      <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Budget Tier */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Investment Budget
            </label>
            <select
              value={briefInput.budgetTier}
              onChange={(e) => {
                const tier = e.target.value as any;
                setBriefInput({ ...briefInput, budgetTier: tier });
                if (tier === 'AED 1M') setBudgetAED(1000000);
                else if (tier === 'AED 2M') setBudgetAED(2500000);
                else if (tier === 'AED 5M') setBudgetAED(5000000);
                else setBudgetAED(10000000);
              }}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 text-white rounded-xl focus:border-amber-500"
            >
              <option value="AED 1M">AED 1,000,000</option>
              <option value="AED 2M">AED 2,500,000</option>
              <option value="AED 5M">AED 5,000,000</option>
              <option value="AED 10M+">AED 10,000,000+</option>
            </select>
          </div>

          {/* Investment Objective */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Investment Goal
            </label>
            <select
              value={briefInput.objective}
              onChange={(e) => setBriefInput({ ...briefInput, objective: e.target.value as any })}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 text-white rounded-xl focus:border-amber-500"
            >
              <option value="Grow Investment">Capital Growth</option>
              <option value="Generate Rental Income">Generate Rental Income</option>
              <option value="Balance of Both">Balance of Both</option>
              <option value="Buy Luxury Home">Buy Luxury Home That Holds Value</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Property Type
            </label>
            <select
              value={briefInput.propertyType}
              onChange={(e) => setBriefInput({ ...briefInput, propertyType: e.target.value as any })}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 text-white rounded-xl focus:border-amber-500"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </div>

          {/* Location Preference */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Preferred Location
            </label>
            <select
              value={briefInput.locationPreference}
              onChange={(e) => setBriefInput({ ...briefInput, locationPreference: e.target.value as any })}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 text-white rounded-xl focus:border-amber-500"
            >
              <option value="Waterfront">Waterfront (Palm Jumeirah / Creek)</option>
              <option value="Downtown / City">Downtown / City Center</option>
              <option value="Family communities">Family Communities (Dubai Hills)</option>
              <option value="Emerging areas">Emerging High-Yield Corridors</option>
              <option value="Dubai-wide">Dubai-wide Opportunities</option>
            </select>
          </div>

          {/* Investment Timeline */}
          <div className="space-y-1 sm:col-span-2 lg:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Investment Timeline
            </label>
            <select
              value={briefInput.timeline}
              onChange={(e) => setBriefInput({ ...briefInput, timeline: e.target.value as any })}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 text-white rounded-xl focus:border-amber-500"
            >
              <option value="Now">Ready Now</option>
              <option value="Next 3 months">Next 3 Months</option>
              <option value="3–6 months">3 to 6 Months</option>
              <option value="6–12 months">6 to 12 Months</option>
              <option value="Just researching">Just Researching</option>
            </select>
          </div>

        </div>

        {/* Free Text Note */}
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">
            Additional Strategy Notes (Optional)
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Prefer off-plan milestone payment schedule with Golden Visa eligibility..."
            className="w-full p-3 text-xs bg-stone-950 border border-stone-700 text-white rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Submit Action CTA */}
        <button
          onClick={handleRunAdvisor}
          disabled={isLoading}
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing DLD Telemetry & Strategy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Build My Dubai Investment Brief</span>
            </>
          )}
        </button>
      </div>

      {/* Response Output Panel */}
      {response && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">
                {response.marketView}
              </span>
              <h4 className="font-serif-luxury font-bold text-lg text-white">Your Tailored Investment Brief</h4>
            </div>

            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-center">
              <span className="text-[9px] uppercase block font-semibold text-stone-400">Confidence</span>
              <span className="font-bold text-xs">{response.confidence}%</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            {response.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Growth Drivers
              </span>
              <ul className="space-y-1 text-stone-300 text-[11px]">
                {response.drivers.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Key Considerations & Risks
              </span>
              <ul className="space-y-1 text-stone-300 text-[11px]">
                {response.risks.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>

          {response.recommendedProperties.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Matching MITTALCO Dossiers
              </span>
              <div className="flex flex-wrap gap-2">
                {response.recommendedProperties.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectPropertyByName && onSelectPropertyByName(name)}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-stone-700 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{name}</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct WhatsApp Advisor Handoff */}
          <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-stone-400 text-[11px]">
              Data Sources: {response.sources.join(', ')}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-colors shrink-0"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Review Strategy with Mittalco Advisor</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
};
