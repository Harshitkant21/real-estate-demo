import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { AIAdvisorResponse, Property } from '../../types';
import { aiAdvisorService } from '../../services/aiAdvisorService';
import { whatsappService } from '../../services/whatsappService';
import { AskAMAdvisor } from './AskAMAdvisor';
import { Sparkles, X, Bot, ChevronRight, ShieldCheck, AlertCircle, Building2, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface Props {
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const FloatingAIOrb = ({ properties, onSelectProperty }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuickTab, setActiveQuickTab] = useState<'prompt' | 'brief'>('prompt');
  const [quickQuery, setQuickQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIAdvisorResponse | null>(null);

  const advisorUrl = whatsappService.getGeneralAdvisorUrl();

  const handleRunQuickQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setQuickQuery(queryText);
    try {
      const res = await aiAdvisorService.queryAdvisor(queryText, 2500000);
      setAiResponse(res);
    } catch (err) {
      console.error('AI Orb Query Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Orb Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 px-4 py-3.5 bg-stone-950 text-white rounded-full shadow-2xl border border-amber-500/40 hover:border-amber-400 hover:scale-105 transition-all duration-300"
        title="Open MITTALCO Intelligence Analyst"
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400">
          <div className="absolute inset-0 rounded-full border border-amber-400/60 animate-ping opacity-30" />
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        <div className="text-left font-serif-luxury tracking-wide">
          <span className="text-xs font-bold text-amber-400 block leading-none">MITTALCO AI</span>
          <span className="text-[9px] text-stone-300 uppercase tracking-widest font-sans font-bold">
            Private Wealth Desk
          </span>
        </div>
      </button>

      {/* Render Slide-Over Modal directly onto document.body using React Portal */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Body */}
            <div className="relative w-full max-w-2xl bg-[#0F1115] text-stone-100 h-full shadow-2xl border-l border-stone-800 flex flex-col justify-between z-10 overflow-y-auto animate-slideLeft">
              
              {/* Header */}
              <div className="p-6 border-b border-stone-800/80 flex items-center justify-between sticky top-0 bg-[#0F1115]/95 backdrop-blur-md z-20">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury font-bold text-2xl text-white tracking-tight">
                      MITTALCO Private Wealth AI Desk
                    </h3>
                    <p className="text-xs text-stone-400">
                      Live Dubai real estate analyst powered by DLD transaction telemetry.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-stone-400 hover:text-white hover:bg-stone-900 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Container */}
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                
                {/* Tab Selector */}
                <div className="flex bg-stone-900/80 p-1 rounded-xl border border-stone-800 text-xs font-semibold">
                  <button
                    onClick={() => setActiveQuickTab('prompt')}
                    className={`flex-1 py-2.5 rounded-lg transition-colors ${
                      activeQuickTab === 'prompt'
                        ? 'bg-amber-600 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Interactive AI Query Analyst
                  </button>
                  <button
                    onClick={() => setActiveQuickTab('brief')}
                    className={`flex-1 py-2.5 rounded-lg transition-colors ${
                      activeQuickTab === 'brief'
                        ? 'bg-amber-600 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Build Investment Brief
                  </button>
                </div>

                {activeQuickTab === 'prompt' ? (
                  <div className="space-y-6">
                    
                    {/* Suggested Quick Investor Queries */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest block">
                        Suggested Wealth Advisory Prompts
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Where should I invest in Dubai?',
                          'Which areas offer highest net rental yield?',
                          'Analyze Palm Jumeirah vs Dubai Hills Estate',
                          'UAE Golden Visa AED 2M+ requirements',
                        ].map((promptText, i) => (
                          <button
                            key={i}
                            onClick={() => handleRunQuickQuery(promptText)}
                            className="px-3.5 py-2 bg-stone-900/90 hover:bg-stone-800 text-stone-200 text-xs rounded-xl border border-stone-800 transition-colors text-left font-medium"
                          >
                            {promptText}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Search Input Box */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-300 block">Ask Private Wealth Analyst</label>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleRunQuickQuery(quickQuery);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={quickQuery}
                          onChange={(e) => setQuickQuery(e.target.value)}
                          placeholder="Ask about prices, yields, areas, or specific developments..."
                          className="flex-1 px-4 py-3 text-xs bg-stone-900 border border-stone-800 text-white rounded-xl focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !quickQuery.trim()}
                          className="px-5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <span>Ask</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                    {/* Loading Indicator */}
                    {isLoading && (
                      <div className="p-10 text-center text-xs text-amber-400 animate-pulse space-y-3 bg-stone-900/50 rounded-2xl border border-stone-800">
                        <Bot className="w-8 h-8 mx-auto text-amber-400" />
                        <p className="font-semibold">Synthesizing DLD telemetry & investment parameters...</p>
                      </div>
                    )}

                    {/* Structured AI Response Card */}
                    {aiResponse && !isLoading && (
                      <div className="p-6 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-5 animate-fadeIn text-xs">
                        
                        {/* Response Title & Confidence */}
                        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                          <span className="text-amber-400 font-serif-luxury font-bold text-base">
                            {aiResponse.marketView}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                            {aiResponse.confidence}% Confidence
                          </span>
                        </div>

                        {/* Executive Summary */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Executive Analysis</span>
                          <p className="text-stone-200 leading-relaxed font-light text-xs sm:text-sm">
                            {aiResponse.summary}
                          </p>
                        </div>

                        {/* Drivers vs Risks Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-[#0A0C0E] rounded-xl border border-stone-800/80 space-y-2">
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                              <ShieldCheck className="w-4 h-4" /> Market Drivers
                            </span>
                            <ul className="space-y-1.5 text-stone-300 text-xs">
                              {aiResponse.drivers.map((d, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 bg-[#0A0C0E] rounded-xl border border-stone-800/80 space-y-2">
                            <span className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                              <AlertCircle className="w-4 h-4" /> Downside Considerations
                            </span>
                            <ul className="space-y-1.5 text-stone-300 text-xs">
                              {aiResponse.risks.map((r, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-amber-400 font-bold">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Recommended Dossiers */}
                        {aiResponse.recommendedProperties.length > 0 && (
                          <div className="pt-3 border-t border-stone-800 space-y-2">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                              Matched Property Dossiers
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {aiResponse.recommendedProperties.map((name, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    const found = properties.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
                                    if (found && onSelectProperty) {
                                      onSelectProperty(found);
                                      setIsOpen(false);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs rounded-lg flex items-center gap-1.5 border border-stone-700 transition-colors"
                                >
                                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{name}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                ) : (
                  <AskAMAdvisor
                    onSelectPropertyByName={(name) => {
                      const found = properties.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
                      if (found && onSelectProperty) {
                        onSelectProperty(found);
                        setIsOpen(false);
                      }
                    }}
                  />
                )}

              </div>

              {/* Footer */}
              <div className="p-5 border-t border-stone-800/80 bg-[#0F1115] sticky bottom-0 z-20 flex items-center justify-between gap-4 text-xs">
                <span className="text-stone-400 text-xs">Verified DLD Provenance Protocol</span>
                <a
                  href={advisorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Talk to Senior Advisor</span>
                </a>
              </div>

            </div>
          </div>,
          document.body
        )}
    </>
  );
};
