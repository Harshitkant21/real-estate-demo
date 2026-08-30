import { useState } from 'react';
import type { AdvisorProfile, ConsultationBooking } from '../types';
import { ConsultationBookingSchema } from '../schemas/advisorSchema';
import { APP_CONFIG } from '../config/appConfig';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { whatsappService } from '../services/whatsappService';
import {
  UserCheck,
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  MessageSquare,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

const DEFAULT_ADVISOR: AdvisorProfile = {
  id: 'adv-001',
  name: APP_CONFIG.advisor.name,
  title: APP_CONFIG.advisor.title,
  reraLicenseNo: APP_CONFIG.advisor.reraLicense,
  brokeragePartner: APP_CONFIG.companyDetails.legalName,
  experienceYears: 12,
  officeAddress: APP_CONFIG.companyDetails.officeAddress,
  email: APP_CONFIG.companyDetails.email,
  phoneWhatsApp: APP_CONFIG.companyDetails.phone,
  photoUrl: APP_CONFIG.advisor.photoUrl,
  bio: 'Senior Dubai Real Estate & Private Wealth Advisor specializing in prime waterfront acquisitions, off-plan developer allocation, and international portfolio structuring.',
  specialization: [
    'Prime Waterfront Acquisitions',
    'Off-Plan Master Developer Priority Access',
    'Golden Visa Equity Portfolio Structuring',
    'ROI & Net Rental Yield Optimization',
  ],
  languages: ['English', 'Arabic', 'French'],
};


export const AdvisorDesk = () => {
  const advisor: AdvisorProfile = DEFAULT_ADVISOR;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<ConsultationBooking>({
    advisorId: advisor.id,
    investorName: '',
    email: '',
    phone: '',
    country: 'United Arab Emirates',
    targetBudgetAED: 2500000,
    preferredChannel: 'WhatsApp',
    consultationTopic: 'Waterfront Off-Plan Investment Allocation',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const whatsappUrl = whatsappService.getGeneralAdvisorUrl();

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = ConsultationBookingSchema.safeParse(formData);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0].toString()] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Banner */}
      <div className="dark-panel rounded-3xl p-6 sm:p-10 border border-stone-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white">
              Senior Advisory Desk
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              The human private wealth expertise behind the AM Estates intelligence desk.
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Photo & Contact Info */}
        <div className="space-y-6">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-stone-200">
            <ImageWithFallback
              src={advisor.photoUrl}
              alt={advisor.name}
              aspectRatio="square"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1 font-mono">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Regulatory Credentials</span>
              <p className="font-bold text-stone-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                {advisor.reraLicenseNo}
              </p>
              <p className="text-stone-600">{advisor.brokeragePartner}</p>
            </div>

            <div className="space-y-2 text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{advisor.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{advisor.email}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Connect via WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setIsModalOpen(true);
                }}
                className="w-full py-3 bg-stone-900 text-amber-400 hover:bg-stone-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Advisory Consultation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Expertise & Services */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block">
              Senior Advisor Profile
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-stone-900">
              {advisor.name}
            </h2>
            <p className="text-sm font-semibold text-stone-600 mt-0.5">{advisor.title}</p>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
            {advisor.bio}
          </p>

          {/* Areas of Expertise */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <h4 className="font-serif-luxury font-bold text-lg text-stone-900">
              Areas of Specialization
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advisor.specialization.map((spec, idx) => (
                <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages Spoken */}
          <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
            <span className="font-bold text-stone-900 block">Verified Languages Spoken:</span>
            <div className="flex flex-wrap gap-2">
              {advisor.languages.map((lang, idx) => (
                <span key={idx} className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-lg font-semibold text-stone-700">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Confidentiality Notice */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 space-y-1">
            <span className="font-bold block flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              Confidential Private Wealth Advisory Standard
            </span>
            <p className="text-amber-800/90 text-[11px]">
              All client consultations and portfolio inquiries are handled under strict confidentiality protocols compliant with Dubai Real Estate Regulatory Authority (RERA) standards.
            </p>
          </div>
        </div>

      </div>

      {/* Consultation Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif-luxury font-bold text-lg">Book Advisory Consultation</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-stone-800 rounded">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="p-6">
              {isSubmitted ? (
                <div className="space-y-4 py-2 text-xs">
                  <div className="text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-serif-luxury font-bold text-xl text-stone-900">Consultation Request Prepared</h4>
                    <p className="text-xs text-stone-600">
                      Select your preferred channel below to send your booking request directly to Senior Advisor Alexander Wright.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1 font-mono text-[11px] text-stone-800">
                    <p><strong>Investor:</strong> {formData.investorName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Mobile:</strong> {formData.phone}</p>
                    <p><strong>Topic:</strong> {formData.consultationTopic}</p>
                    <p><strong>Target Advisor:</strong> Alexander Wright ({APP_CONFIG.companyDetails.email})</p>
                  </div>

                  {/* Multi-Channel Dispatch Buttons */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block text-center">
                      Choose Your Preferred Channel Below
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <a
                        href={whatsappService.getConsultationWhatsAppUrl(formData)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsModalOpen(false)}
                        className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                        <span>Send via WhatsApp</span>
                      </a>

                      <a
                        href={whatsappService.getConsultationGmailWebUrl(formData)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsModalOpen(false)}
                        className="py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open Gmail Web</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <a
                        href={whatsappService.getConsultationEmailUrl(formData)}
                        onClick={() => setIsModalOpen(false)}
                        className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 border border-stone-800 transition-colors"
                      >
                        <span>Desktop Mail App (mailto)</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          const textToCopy = `Advisor: Alexander Wright (${APP_CONFIG.companyDetails.email})\nInvestor: ${formData.investorName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nTopic: ${formData.consultationTopic}`;
                          navigator.clipboard.writeText(textToCopy);
                          alert('Consultation request details copied to clipboard!');
                        }}
                        className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
                      >
                        <span>Copy Summary to Clipboard</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookConsultation} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Investor Name *</label>
                    <input
                      type="text"
                      placeholder="Alexander Wright"
                      value={formData.investorName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, investorName: val });
                        if (errors.investorName) {
                          const res = ConsultationBookingSchema.shape.investorName.safeParse(val);
                          setErrors((prev) => ({ ...prev, investorName: res.success ? '' : res.error.issues[0].message }));
                        }
                      }}
                      className={`w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-none transition-colors ${
                        errors.investorName ? 'border-red-500 bg-red-50/50 focus:border-red-600' : 'border-stone-200 focus:border-amber-600'
                      }`}
                    />
                    {errors.investorName && (
                      <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0 text-red-600" /> {errors.investorName}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="investor@domain.com"
                        value={formData.email}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, email: val });
                          if (errors.email) {
                            const res = ConsultationBookingSchema.shape.email.safeParse(val);
                            setErrors((prev) => ({ ...prev, email: res.success ? '' : res.error.issues[0].message }));
                          }
                        }}
                        className={`w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500 bg-red-50/50 focus:border-red-600' : 'border-stone-200 focus:border-amber-600'
                        }`}
                      />
                      {errors.email && (
                        <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 shrink-0 text-red-600" /> {errors.email}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Mobile / WhatsApp *</label>
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
                          const res = ConsultationBookingSchema.shape.phone.safeParse(val);
                          setErrors((prev) => ({ ...prev, phone: res.success ? '' : res.error.issues[0].message }));
                        }}
                        className={`w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-none transition-colors ${
                          errors.phone ? 'border-red-500 bg-red-50/50 focus:border-red-600' : 'border-stone-200 focus:border-amber-600'
                        }`}
                      />
                      {errors.phone && (
                        <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 shrink-0 text-red-600" /> {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Consultation Topic / Area of Interest *</label>
                    <input
                      type="text"
                      placeholder="e.g. Palm Jebel Ali Villa Allocation"
                      value={formData.consultationTopic}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, consultationTopic: val });
                        if (errors.consultationTopic) {
                          const res = ConsultationBookingSchema.shape.consultationTopic.safeParse(val);
                          setErrors((prev) => ({ ...prev, consultationTopic: res.success ? '' : res.error.issues[0].message }));
                        }
                      }}
                      className={`w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-none transition-colors ${
                        errors.consultationTopic ? 'border-red-500 bg-red-50/50 focus:border-red-600' : 'border-stone-200 focus:border-amber-600'
                      }`}
                    />
                    {errors.consultationTopic && (
                      <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0 text-red-600" /> {errors.consultationTopic}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-stone-900 text-amber-400 font-bold text-xs rounded-xl hover:bg-stone-800 transition-colors mt-2 shadow-sm"
                  >
                    Validate & Confirm Booking Request
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
