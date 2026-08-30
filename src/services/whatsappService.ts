import { APP_CONFIG } from '../config/appConfig';
import type { EOIForm } from '../types';

export class WhatsAppService {
  private advisorNumber = APP_CONFIG.advisor.whatsApp;

  public getGeneralAdvisorUrl(): string {
    if (!this.advisorNumber) return '#';

    const text = encodeURIComponent(
      `Hello MITTALCO Advisor, I would like to schedule a private investment consultation regarding Dubai real estate opportunities.`
    );
    return `https://wa.me/${this.advisorNumber}?text=${text}`;
  }

  public getPropertyInquiryUrl(propertyName: string, startingPriceFormatted: string): string {
    if (!this.advisorNumber) return '#';

    const text = encodeURIComponent(
      `Hello MITTALCO Advisor, I am inquiring about the dossier for "${propertyName}" (Starting from ${startingPriceFormatted}). Please share unit availability and payment schedule.`
    );
    return `https://wa.me/${this.advisorNumber}?text=${text}`;
  }

  public getEoiSubmissionUrl(eoi: EOIForm, formattedPrice: string): string {
    if (!this.advisorNumber) return '#';

    const text = encodeURIComponent(
      `Hello MITTALCO Advisor, I have completed an Expression of Interest (EOI) for "${eoi.propertyName}".\n` +
        `• Investor: ${eoi.investorName} (${eoi.country})\n` +
        `• Target Budget: ${formattedPrice}\n` +
        `• Financing Preference: ${eoi.financingPreference}\n` +
        `Please arrange a priority callback to discuss allocation details.`
    );
    return `https://wa.me/${this.advisorNumber}?text=${text}`;
  }

  public getInvestmentStudioUrl(_priceAED: number, formattedPrice: string, roiPercent: number): string {
    if (!this.advisorNumber) return '#';

    const text = encodeURIComponent(
      `Hello MITTALCO Advisor, I modeled a custom investment calculation in the MITTALCO Investment Studio:\n` +
        `• Property Budget: ${formattedPrice}\n` +
        `• Projected Net 5-Yr Return: +${roiPercent.toFixed(1)}%\n` +
        `I would like to review suitable properties matching this financial model.`
    );
    return `https://wa.me/${this.advisorNumber}?text=${text}`;
  }
}

export const whatsappService = new WhatsAppService();
