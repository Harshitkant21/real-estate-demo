import { APP_CONFIG } from '../config/appConfig';
import type { EOIForm } from '../types';

export class WhatsAppService {
  private getAdvisorNumber(): string {
    const envNum = import.meta.env.VITE_ADVISOR_WHATSAPP;
    const num = envNum || APP_CONFIG.advisor.whatsApp || '971501234567';
    return num.toString().replace(/\D/g, '');
  }

  public getGeneralAdvisorUrl(): string {
    const num = this.getAdvisorNumber();
    if (!num) return '#';

    const text = encodeURIComponent(
      `Hello MITTAL & CO. Senior Advisor, I would like to schedule a private investment consultation regarding Dubai real estate opportunities.`
    );
    return `https://wa.me/${num}?text=${text}`;
  }

  public getPropertyInquiryUrl(propertyName: string, startingPriceFormatted: string): string {
    const num = this.getAdvisorNumber();
    if (!num) return '#';

    const text = encodeURIComponent(
      `Hello MITTAL & CO. Senior Advisor, I am inquiring about the dossier for "${propertyName}" (Starting from ${startingPriceFormatted}). Please share unit availability and payment schedule.`
    );
    return `https://wa.me/${num}?text=${text}`;
  }

  public getEoiSubmissionUrl(eoi: EOIForm, formattedPrice: string): string {
    const num = this.getAdvisorNumber();
    if (!num) return '#';

    const text = encodeURIComponent(
      `Hello MITTAL & CO. Senior Advisor, I have completed an Expression of Interest (EOI) for "${eoi.propertyName}".\n` +
        `• Investor: ${eoi.investorName} (${eoi.country})\n` +
        `• Target Budget: ${formattedPrice}\n` +
        `• Financing Preference: ${eoi.financingPreference}\n` +
        `Please arrange a priority callback to discuss allocation details.`
    );
    return `https://wa.me/${num}?text=${text}`;
  }

  public getInvestmentStudioUrl(_priceAED: number, formattedPrice: string, roiPercent: number): string {
    const num = this.getAdvisorNumber();
    if (!num) return '#';

    const text = encodeURIComponent(
      `Hello MITTAL & CO. Senior Advisor, I modeled a custom investment calculation in the MITTAL & CO. Investment Studio:\n` +
        `• Property Budget: ${formattedPrice}\n` +
        `• Projected Net 5-Yr Return: +${roiPercent.toFixed(1)}%\n` +
        `I would like to review suitable properties matching this financial model.`
    );
    return `https://wa.me/${num}?text=${text}`;
  }
}

export const whatsappService = new WhatsAppService();
