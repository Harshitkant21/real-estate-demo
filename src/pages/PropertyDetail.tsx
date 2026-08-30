import { useState } from 'react';
import type { Property, CurrencyCode, ExchangeRates } from '../types';
import { formatConvertedPrice } from '../utils/currency';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';
import { EOIModal } from '../components/eoi/EOIModal';
import { DataStatusBadge } from '../components/shared/DataStatusBadge';
import { whatsappService } from '../services/whatsappService';
import {
  ArrowLeft,
  Bookmark,
  Sparkles,
  MessageSquare,
  Calculator,
  FileCheck2,
} from 'lucide-react';

interface Props {
  property: Property;
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onBack: () => void;
  onOpenStudio: () => void;
}

export const PropertyDetail = ({
  property,
  selectedCurrency,
  rates,
  isSaved,
  onToggleSave,
  onBack,
  onOpenStudio,
}: Props) => {
  const images = [property.media.heroImage, ...(property.media.galleryImages || [])];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [showEOIModal, setShowEOIModal] = useState(false);

  const { formatted } = formatConvertedPrice(property.startingPrice, selectedCurrency, rates);
  const whatsappUrl = whatsappService.getPropertyInquiryUrl(property.name, formatted);

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2">
          <DataStatusBadge status="EDITORIAL" sourceName="MITTAL & CO. Research Desk" />

          <button
            onClick={() => onToggleSave(property.id)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isSaved
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-800 text-amber-800' : ''}`} />
            <span>{isSaved ? 'Saved to Workspace' : 'Save Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 bg-stone-900 text-amber-400 rounded-md uppercase tracking-wider">
            {property.status}
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-700">{property.area}</span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-700">{property.developer}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-stone-900 leading-tight">
              {property.name}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base font-light mt-1 max-w-2xl">
              {property.propertyType} · {property.bedrooms} Beds · {property.bathrooms} Baths · {property.sizeSqft.toLocaleString()} sqft
            </p>
          </div>

          <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 shrink-0 space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">Starting Acquisition</span>
            <div className="text-2xl sm:text-3xl font-bold">{formatted}</div>
            <p className="text-[10px] text-stone-400 font-mono">Original Source: AED {property.startingPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Media Gallery Grid */}
      <div className="space-y-3">
        <div className="aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-xl border border-stone-200">
          <ImageWithFallback src={selectedImage} alt={property.name} aspectRatio="hero" />
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedImage === img ? 'border-amber-700 scale-105 shadow' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <ImageWithFallback src={img} alt={`${property.name} preview ${idx}`} aspectRatio="square" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Key Financial Metrics Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold block">Est. Net Rental Yield</span>
          <span className="text-2xl font-bold text-amber-800">{property.rentalYield}% Net</span>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold block">Payment Schedule</span>
          <span className="text-base font-bold text-stone-900">{property.paymentPlan}</span>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold block">Target Handover</span>
          <span className="text-base font-bold text-stone-900">{property.handover}</span>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] text-stone-500 uppercase font-bold block">Golden Visa Status</span>
          <span className="text-base font-bold text-emerald-800">
            {property.goldenVisaEligible ? 'Eligible (AED 2M+)' : 'Standard'}
          </span>
        </div>
      </div>

      {/* Investment Thesis & Developer Track Record */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Investment Thesis (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-serif-luxury font-bold text-xl text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span>Investment Thesis & Advisory Narrative</span>
            </h3>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              {property.thesis.whyInvest}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Key Growth Drivers</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.thesis.growthDrivers.map((driver, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 flex items-start gap-2">
                    <span className="text-amber-800 font-bold">•</span>
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel Column */}
        <div className="space-y-6">
          <div className="bg-stone-950 text-white rounded-2xl p-6 space-y-4 border border-stone-850 shadow-xl">
            <h3 className="font-serif-luxury font-bold text-lg text-white">Private Allocation Inquiry</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Submit an Expression of Interest (EOI) or speak directly with a MITTAL & CO. Senior Advisor.

            </p>

            <button
              onClick={() => setShowEOIModal(true)}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Submit Expression of Interest</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-current text-emerald-400" />
              <span>Inquire via WhatsApp</span>
            </a>

            <button
              onClick={onOpenStudio}
              className="w-full py-3 bg-stone-900/80 hover:bg-stone-800 text-stone-300 text-xs font-semibold rounded-xl border border-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Model Return in Calculator</span>
            </button>
          </div>
        </div>

      </div>

      {/* Expression of Interest Modal */}
      {showEOIModal && (
        <EOIModal
          property={property}
          selectedCurrency={selectedCurrency}
          rates={rates}
          onClose={() => setShowEOIModal(false)}
        />
      )}

    </div>
  );
};
