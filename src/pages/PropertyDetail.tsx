import { useState } from 'react';
import type { Property, CurrencyCode, ExchangeRates } from '../types';
import { formatConvertedPrice } from '../utils/currency';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { EOIModal } from '../components/eoi/EOIModal';
import { whatsappService } from '../services/whatsappService';
import {
  ArrowLeft,
  Bookmark,
  TrendingUp,
  Waves,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface Props {
  property: Property;
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onBack: () => void;
  onOpenStudio?: (property: Property) => void;
}

export const PropertyDetail: React.FC<Props> = ({
  property,
  selectedCurrency,
  rates,
  isSaved,
  onToggleSave,
  onBack,
  onOpenStudio,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showEoiModal, setShowEoiModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const { formatted } = formatConvertedPrice(property.startingPrice, selectedCurrency, rates);
  const whatsappUrl = whatsappService.getPropertyInquiryUrl(property, formatted);

  const allImages = [property.media.heroImage, ...(property.media.galleryImages || [])];

  return (
    <div className="space-y-8 pb-24">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(property.id)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="space-y-3">
        <div className="relative rounded-2xl overflow-hidden shadow-lg group">
          <ImageWithFallback
            src={allImages[activeMediaIndex]}
            alt={property.name}
            aspectRatio="hero"
            className="w-full h-[320px] sm:h-[480px] object-cover"
          />

          <button
            onClick={() => setShowLightbox(true)}
            className="absolute bottom-4 right-4 px-3 py-1.5 bg-stone-900/80 text-white text-xs font-semibold rounded-lg backdrop-blur-md flex items-center gap-1.5 hover:bg-stone-900 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Lightbox ({allImages.length})</span>
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-stone-900/90 text-amber-400 font-bold text-xs uppercase rounded-full backdrop-blur-md shadow">
              {property.status}
            </span>
            {property.waterfront && (
              <span className="px-3 py-1 bg-blue-900/90 text-blue-200 font-bold text-xs uppercase rounded-full backdrop-blur-md shadow flex items-center gap-1">
                <Waves className="w-3.5 h-3.5" /> Waterfront
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Selector */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMediaIndex(idx)}
                className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activeMediaIndex === idx ? 'border-amber-600 scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <ImageWithFallback src={img} alt={`Thumbnail ${idx}`} aspectRatio="square" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Title & Investment Snapshot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Dossier Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span>{property.area}</span>
              <span>Developer: {property.developer}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-900">
              {property.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              {property.bedrooms} Bedrooms · {property.bathrooms} Bathrooms · {property.sizeSqft.toLocaleString()} sqft · {property.propertyType}
            </p>
          </div>

          {/* Investment Snapshot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Starting Price</span>
              <span className="text-base font-bold text-stone-900">{formatted}</span>
            </div>
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl">
              <span className="text-[10px] text-amber-900 uppercase font-bold block">Est. Yield</span>
              <span className="text-base font-bold text-amber-900">{property.rentalYield}% p.a.</span>
            </div>
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Payment Plan</span>
              <span className="text-base font-bold text-stone-900">{property.paymentPlan}</span>
            </div>
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Expected Handover</span>
              <span className="text-base font-bold text-stone-900">{property.handover}</span>
            </div>
          </div>

          {/* Investment Thesis */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-2">
              Investment Thesis
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              {property.thesis.whyInvest}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Primary Growth Drivers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.thesis.growthDrivers.map((driver, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs text-stone-600">
              <span className="font-semibold text-stone-900">Target Investor Profile:</span> {property.thesis.targetProfile}
            </div>
          </div>

          {/* Milestone Payment Plan Visualization */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-2">
              Payment Schedule Breakdown
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="font-semibold text-stone-800">Booking Down-Payment (10% + 4% DLD)</span>
                <span className="font-bold text-stone-900">Immediate</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="font-semibold text-stone-800">Construction Milestones ({property.paymentPlan.split('/')[0]}%)</span>
                <span className="font-bold text-stone-900">During Construction</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                <span className="font-semibold">Handover Balance ({property.paymentPlan.split('/')[1]}%)</span>
                <span className="font-bold">{property.handover} Completion</span>
              </div>
            </div>
          </div>

          {/* Transparent Risks & Considerations */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-amber-800" />
              <span>Investment Risk Considerations</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
              {property.risks.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: CTA Panel & Advisory Card */}
        <div className="space-y-6">
          <div className="bg-stone-900 text-white rounded-2xl p-6 space-y-5 border border-stone-800 sticky top-24 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">
                Private Advisory
              </span>
              <h3 className="font-serif-luxury font-bold text-xl text-white">
                Request Priority Dossier
              </h3>
              <p className="text-xs text-stone-400">
                Connect directly with an AM Estates Partner for inventory lists and unit allocation.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setShowEoiModal(true)}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Submit Expression of Interest (EOI)</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs rounded-xl border border-stone-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Inquire via WhatsApp</span>
              </a>

              {onOpenStudio && (
                <button
                  onClick={() => onOpenStudio(property)}
                  className="w-full py-2.5 text-stone-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Model Return in Studio</span>
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-stone-800 text-[10px] text-stone-400 space-y-1">
              <p>✔ RERA Escrow Account Protection</p>
              <p>✔ Confidential High Net-Worth Advisory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center text-white">
            <span className="text-xs font-mono">Image {activeMediaIndex + 1} of {allImages.length}</span>
            <button onClick={() => setShowLightbox(false)} className="p-2 text-stone-400 hover:text-white">
              ✕ Close Lightbox
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            <img src={allImages[activeMediaIndex]} alt="Full view" className="max-h-full max-w-full object-contain rounded-lg" />
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMediaIndex(idx)}
                className={`w-16 h-12 rounded overflow-hidden border ${activeMediaIndex === idx ? 'border-amber-400 scale-105' : 'border-stone-700 opacity-60'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EOI Modal */}
      {showEoiModal && (
        <EOIModal
          property={property}
          selectedCurrency={selectedCurrency}
          rates={rates}
          onClose={() => setShowEoiModal(false)}
        />
      )}
    </div>
  );
};
