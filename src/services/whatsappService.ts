import { APP_CONFIG } from '../config/appConfig';
import type { Property, Launch, EOIForm } from '../types';

export class WhatsAppService {
  private getBaseUrl(): string {
    const rawNumber = APP_CONFIG.advisorWhatsApp.replace(/[^0-9]/g, '');
    if (!rawNumber) {
      // Missing environment configuration handled safely
      return '';
    }
    return `https://wa.me/${rawNumber}`;
  }

  public isConfigured(): boolean {
    return Boolean(APP_CONFIG.advisorWhatsApp.trim());
  }

  public getGeneralAdvisorUrl(): string {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return '#';
    const text = encodeURIComponent(
      `Hello AM Estates Advisor, I would like to schedule a private real estate investment consultation for Dubai.`
    );
    return `${baseUrl}?text=${text}`;
  }

  public getPropertyInquiryUrl(property: Property, formattedPrice: string): string {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return '#';
    const text = encodeURIComponent(
      `Hello AM Estates, I am interested in reviewing the investment dossier for "${property.name}" in ${property.area} listed at ${formattedPrice} (Ref: ${property.id}). Please share available inventory and payment plan options.`
    );
    return `${baseUrl}?text=${text}`;
  }

  public getLaunchVipUrl(launch: Launch, formattedPrice: string): string {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return '#';
    const text = encodeURIComponent(
      `Hello AM Estates, I would like to request VIP Launch Priority Access for "${launch.name}" by ${launch.developer} in ${launch.area} starting at ${formattedPrice}.`
    );
    return `${baseUrl}?text=${text}`;
  }

  public getInvestmentStudioUrl(_propertyPriceAED: number, formattedPrice: string, roiPercent: number): string {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return '#';
    const text = encodeURIComponent(
      `Hello AM Estates, I modeled a Dubai investment for property value ${formattedPrice} yielding ${roiPercent.toFixed(1)}% projected ROI in your Investment Studio. I would like an advisor to review this scenario with me.`
    );
    return `${baseUrl}?text=${text}`;
  }

  public getEoiSubmissionUrl(eoi: EOIForm, formattedPrice: string): string {
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return '#';
    const text = encodeURIComponent(
      `Hello AM Estates, I have prepared an Expression of Interest (EOI) for "${eoi.propertyName}" (Ref: ${eoi.propertyId}).\n\nInvestor: ${eoi.investorName}\nType: ${eoi.investorType}\nFinancing: ${eoi.financingPreference}\nTarget Budget: ${formattedPrice}\n\nPlease connect me with a Senior Advisory Partner.`
    );
    return `${baseUrl}?text=${text}`;
  }
}

export const whatsappService = new WhatsAppService();
