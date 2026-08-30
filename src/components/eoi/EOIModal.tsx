import { useState } from 'react';
import type { Property, CurrencyCode, ExchangeRates, EOIForm } from '../../types';
import { EOIFormSchema } from '../../schemas/formSchema';
import { formatConvertedPrice } from '../../utils/currency';
import { whatsappService } from '../../services/whatsappService';
import { X, CheckCircle2, ShieldCheck, ArrowRight, MessageSquare, Building2, AlertCircle, Mail } from 'lucide-react';


interface Props {
  property: Property;
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  onClose: () => void;
}

export const EOIModal = ({ property, selectedCurrency, rates, onClose }: Props) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<EOIForm>({
    propertyId: property.id,
    propertyName: property.name,
    investorName: '',
    email: '',
    phone: '',
    country: 'United Arab Emirates',
    investorType: 'HNW Investor',
    financingPreference: 'Off-Plan Payment Schedule',
    budgetAED: property.startingPrice,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { formatted } = formatConvertedPrice(property.startingPrice, selectedCurrency, rates);
  const whatsappUrl = whatsappService.getEoiSubmissionUrl(formData, formatted);

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Zod Schema Validation
    const validation = EOIFormSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(formattedErrors);
      return;
    }

    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="bg-stone-900 text-stone-100 p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif-luxury font-bold text-base text-white">
                Expression of Interest (EOI)
              </h3>
              <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                AM Estates Private Placement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="grid grid-cols-3 border-b border-stone-100 bg-stone-50 text-[11px] font-semibold text-center py-2">
          <span className={step === 1 ? 'text-amber-800 font-bold' : 'text-stone-400'}>1. Dossier Review</span>
          <span className={step === 2 ? 'text-amber-800 font-bold' : 'text-stone-400'}>2. Investor Profile</span>
          <span className={step === 3 ? 'text-amber-800 font-bold' : 'text-stone-400'}>3. Summary Handoff</span>
        </div>

        {/* Body Steps */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Selected Opportunity
                </span>
                <h4 className="font-serif-luxury font-bold text-lg text-stone-900">
                  {property.name}
                </h4>
                <p className="text-xs text-stone-600">
                  {property.area} · {property.developer}
                </p>
                <div className="pt-2 flex items-baseline justify-between border-t border-amber-200/50 text-xs">
                  <span className="text-stone-500">Starting Price:</span>
                  <span className="font-bold text-stone-900 text-sm">{formatted}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Est. Yield: <strong>{property.rentalYield}% p.a.</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Payment Schedule: <strong>{property.paymentPlan}</strong> ({property.handover})</span>
                </div>
                {property.goldenVisaEligible && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Eligible for 10-Year UAE Golden Visa</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-stone-900 text-amber-400 hover:bg-stone-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Continue to Investor Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitStep2} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name / Investor Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alexander Wright"
                  value={formData.investorName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, investorName: val });
                    const res = EOIFormSchema.shape.investorName.safeParse(val);
                    setFormErrors((prev) => ({ ...prev, investorName: res.success ? '' : res.error.issues[0].message }));
                  }}
                  className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none bg-stone-50 transition-colors ${
                    formErrors.investorName ? 'border-red-500 bg-red-50/50 focus:border-red-600' : 'border-stone-200 focus:border-amber-700'
                  }`}
                />
                {formErrors.investorName && (
                  <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-600 shrink-0" /> {formErrors.investorName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="investor@domain.com"
                    value={formData.email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, email: val });
                      const res = EOIFormSchema.shape.email.safeParse(val);
                      setFormErrors((prev) => ({ ...prev, email: res.success ? '' : res.error.issues[0].message }));
                    }}
                    className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none bg-stone-50 transition-colors ${
                      formErrors.email ? 'border-red-500 bg-red-50/50 focus:border-red-600' : 'border-stone-200 focus:border-amber-700'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-600 shrink-0" /> {formErrors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    maxLength={15}
                    placeholder="+971 50 000 0000"
                    value={formData.phone}
                    onKeyDown={(e) => {
                      if (/^[a-zA-Z]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9+\s-]/g, '').slice(0, 15);
                      setFormData({ ...formData, phone: val });
                      const res = EOIFormSchema.shape.phone.safeParse(val);
                      setFormErrors((prev) => ({ ...prev, phone: res.success ? '' : res.error.issues[0].message }));
                    }}
                    className={`w-full p-2.5 text-xs border rounded-lg focus:outline-none bg-stone-50 transition-colors ${
                      formErrors.phone ? 'border-red-500 bg-red-50/50 focus:border-red-600' : 'border-stone-200 focus:border-amber-700'
                    }`}
                  />
                  {formErrors.phone && (
                    <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-600 shrink-0" /> {formErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Country of Residence *</label>
                  <input
                    type="text"
                    placeholder="e.g. United Kingdom"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-2.5 text-xs border border-stone-200 rounded-lg bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Financing Preference</label>
                  <select
                    value={formData.financingPreference}
                    onChange={(e) => setFormData({ ...formData, financingPreference: e.target.value as any })}
                    className="w-full p-2.5 text-xs border border-stone-200 rounded-lg bg-stone-50"
                  >
                    <option value="Off-Plan Payment Schedule">Developer Milestone Plan</option>
                    <option value="Full Cash">Full Cash Transfer</option>
                    <option value="Mortgage">Mortgage / Bank Financing</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 border border-stone-200 text-stone-700 font-semibold text-xs rounded-xl hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-stone-900 text-amber-400 hover:bg-stone-800 font-semibold text-xs rounded-xl shadow-sm"
                >
                  Validate & Generate Summary
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-serif-luxury font-bold text-xl text-stone-900">
                  Enquiry Prepared
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Your enquiry is ready — continue with your AM Estates Advisor on WhatsApp.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-left text-xs space-y-1 font-mono">
                <p><strong>Property:</strong> {formData.propertyName}</p>
                <p><strong>Investor:</strong> {formData.investorName} ({formData.country})</p>
                <p><strong>Preference:</strong> {formData.financingPreference}</p>
                <p><strong>Target Budget:</strong> {formatted}</p>
              </div>

              {/* Multi-Channel Dispatch Buttons */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block text-center">
                  Choose Your Preferred Communication Channel
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Send via WhatsApp</span>
                  </a>

                  <a
                    href={whatsappService.getEoiGmailWebUrl(formData, formatted)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open Gmail Web</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={whatsappService.getEoiEmailUrl(formData, formatted)}
                    onClick={onClose}
                    className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 border border-stone-800 transition-colors text-center"
                  >
                    <span>Desktop Mail App (mailto)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const textToCopy = `EOI Submission for ${formData.propertyName}\nInvestor: ${formData.investorName} (${formData.country})\nEmail: ${formData.email}\nPhone: ${formData.phone}\nPreference: ${formData.financingPreference}\nBudget: ${formatted}`;
                      navigator.clipboard.writeText(textToCopy);
                      alert('EOI Summary copied to clipboard!');
                    }}
                    className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
                  >
                    <span>Copy Summary to Clipboard</span>
                  </button>
                </div>
              </div>



              <p className="text-[10px] text-stone-400 italic">
                No sensitive financial credentials stored locally. Confidential advisory guaranteed under UAE RERA standards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
