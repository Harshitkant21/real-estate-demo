import type { Property, CurrencyCode, ExchangeRates } from '../../types';
import { formatConvertedPrice } from '../../utils/currency';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { whatsappService } from '../../services/whatsappService';
import {
  Bookmark,
  TrendingUp,
  Clock,
  Building,
  ShieldCheck,
  Waves,
  MessageSquare,
  ArrowRight,
  Calculator,
} from 'lucide-react';

interface Props {
  property: Property;
  selectedCurrency: CurrencyCode;
  rates: ExchangeRates;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenStudio?: (property: Property) => void;
}

export const PropertyCard: React.FC<Props> = ({
  property,
  selectedCurrency,
  rates,
  isSaved,
  onToggleSave,
  onSelectProperty,
  onOpenStudio,
}) => {
  const { formatted } = formatConvertedPrice(property.startingPrice, selectedCurrency, rates);
  const whatsappUrl = whatsappService.getPropertyInquiryUrl(property, formatted);

  return (
    <div className="luxury-card rounded-xl overflow-hidden flex flex-col group h-full">
      {/* Image Container */}
      <div className="relative">
        <ImageWithFallback
          src={property.media.heroImage}
          alt={property.name}
          aspectRatio="card"
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-amber-400 backdrop-blur-sm shadow">
              {property.status}
            </span>
            {property.waterfront && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-900/90 text-blue-200 backdrop-blur-sm shadow flex items-center gap-1">
                <Waves className="w-3 h-3" /> Waterfront
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow pointer-events-auto ${
              isSaved
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900/60 text-stone-200 hover:bg-stone-900'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save property'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Bottom Image Overlay: Golden Visa */}
        {property.goldenVisaEligible && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-amber-900/90 text-amber-200 backdrop-blur-sm flex items-center gap-1 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Golden Visa Eligible
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location & Developer */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">{property.area}</span>
            <span className="flex items-center gap-1 text-stone-600 font-semibold">
              <Building className="w-3 h-3 text-stone-400" /> {property.developer}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-lg font-serif-luxury font-bold text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer line-clamp-1"
          >
            {property.name}
          </h3>

          {/* Specs Bar */}
          <p className="text-xs text-stone-500 mt-1">
            {property.bedrooms} Bed · {property.bathrooms} Bath · {property.sizeSqft.toLocaleString()} sqft · {property.propertyType}
          </p>

          {/* Price Tag */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-stone-900">{formatted}</span>
            {selectedCurrency !== 'AED' && (
              <span className="text-xs text-stone-500">
                (AED {property.startingPrice.toLocaleString()})
              </span>
            )}
          </div>
        </div>

        {/* Key Intelligence Highlights */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 bg-stone-50/60 p-2.5 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="block text-[10px] text-stone-600 uppercase font-semibold">Est. Yield</span>
              <span className="font-bold text-stone-900">{property.rentalYield}% p.a.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="block text-[10px] text-stone-600 uppercase font-semibold">Plan / Handover</span>
              <span className="font-semibold text-stone-900">{property.paymentPlan} · {property.handover}</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
          <button
            onClick={() => onSelectProperty(property)}
            className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 hover:text-amber-800 transition-colors"
          >
            <span>View Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            {onOpenStudio && (
              <button
                onClick={() => onOpenStudio(property)}
                className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                title="Model in Investment Studio"
              >
                <Calculator className="w-4 h-4" />
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              title="Enquire on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
