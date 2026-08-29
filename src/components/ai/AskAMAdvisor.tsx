import { useState } from 'react';
import type { AIAdvisorResponse, CurrencyCode, ExchangeRates } from '../../types';
import { aiAdvisorService } from '../../services/aiAdvisorService';
import { whatsappService } from '../../services/whatsappService';
import { formatConvertedPrice } from '../../utils/currency';
import { Sparkles, Bot, ArrowRight, ShieldCheck, AlertCircle, MessageSquare, Building2, RefreshCw } from 'lucide-react';

interface Props {
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  onSelectPropertyByName?: (name: string) => void;
}

export const AskAMAdvisor = ({ selectedCurrency, rates, onSelectPropertyByName }: Props) => {
  const [prompt, setPrompt] = useState('I have AED 2.5M and want high rental yield with Golden Visa eligibility');
  const [budgetAED, setBudgetAED] = useState(2500000);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIAdvisorResponse | null>(null);

  const formattedBudget = formatConvertedPrice(budgetAED, selectedCurrency, rates);

  const handleRunAdvisor = async () => {
    setIsLoading(true);
    try {
      const res = await aiAdvisorService.queryAdvisor(prompt, budgetAED);
      setResponse(res);
    } catch (err) {
      console.error('AI Advisor error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappUrl = response
    ? whatsappService.getGeneralAdvisorUrl()
    : '#';

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
              <h3 className="font-serif-luxury font-bold text-2xl text-white">Ask AM Intelligence</h3>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                NVIDIA NIM AI Reasoning
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Interactive AI advisor analyzing official Dubai Land Department transaction trends.
            </p>
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="space-y-4 bg-stone-900/90 p-5 rounded-2xl border border-stone-800">
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5">
            Describe Your Investment Strategy / Goal
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I have AED 2M for long term rental income in waterfront towers..."
            className="w-full p-3 text-xs bg-stone-950 border border-stone-700 text-white rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-stone-300 font-semibold">
            <span>Target Investment Budget:</span>
            <span className="text-amber-400 font-bold">{formattedBudget.formatted}</span>
          </div>
          <input
            type="range"
            min={1500000}
            max={20000000}
            step={500000}
            value={budgetAED}
            onChange={(e) => setBudgetAED(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <button
          onClick={handleRunAdvisor}
          disabled={isLoading}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing DLD Telemetry...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Ask AM Advisor</span>
            </>
          )}
        </button>
      </div>

      {/* Response Panel */}
      {response && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">
                {response.marketView}
              </span>
              <h4 className="font-serif-luxury font-bold text-lg text-white">AI Strategy Analysis</h4>
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
                <AlertCircle className="w-3.5 h-3.5" /> Risk Factors
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
                Matching AM Estates Dossiers
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
              <span>Review Strategy with Human Advisor</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
};
