import { APP_CONFIG } from '../config/appConfig';
import type { EOIForm, ConsultationBooking } from '../types';

export class LeadCommunicationService {
  public getAdvisorNumber(): string {
    const envNum = import.meta.env.VITE_ADVISOR_WHATSAPP;
    let raw = (envNum || APP_CONFIG.advisor.whatsApp || '971501234567').toString().trim();

    let digits = raw.replace(/\D/g, '').replace(/^0+/, '');

    // Auto-fix 10-digit Indian numbers missing 91 country code
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      digits = '91' + digits;
    }
    // Auto-fix 9-digit UAE numbers missing 971 country code
    else if (digits.length === 9 && digits.startsWith('5')) {
      digits = '971' + digits;
    }

    return digits;
  }

  public getAdvisorEmail(): string {
    return import.meta.env.VITE_ADVISOR_EMAIL || APP_CONFIG.companyDetails.email || 'advisory@mittalco.com';
  }

  // --- WHATSAPP LINKS ---
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
        `• Contact Email: ${eoi.email}\n` +
        `• Phone: ${eoi.phone}\n` +
        `• Target Budget: ${formattedPrice}\n` +
        `• Financing Preference: ${eoi.financingPreference}\n` +
        `Please arrange a priority callback to discuss allocation details.`
    );
    return `https://wa.me/${num}?text=${text}`;
  }

  public getConsultationWhatsAppUrl(booking: ConsultationBooking): string {
    const num = this.getAdvisorNumber();
    if (!num) return '#';

    const text = encodeURIComponent(
      `Hello MITTAL & CO. Senior Advisor, I would like to book a private consultation:\n` +
        `• Investor: ${booking.investorName}\n` +
        `• Email: ${booking.email}\n` +
        `• Phone: ${booking.phone}\n` +
        `• Topic / Focus: ${booking.consultationTopic}\n` +
        `• Channel: ${booking.preferredChannel}\n` +
        `Please confirm available appointment slots.`
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

  // --- NATIVE EMAIL (MAILTO) LINKS ---
  public getConsultationEmailUrl(booking: ConsultationBooking): string {
    const recipient = this.getAdvisorEmail();
    const subject = encodeURIComponent(`[Booking Request] Private Consultation — ${booking.investorName}`);
    const body = encodeURIComponent(
      `Dear MITTAL & CO. Advisory Desk,\n\n` +
        `I would like to request an advisory consultation with Alexander Wright.\n\n` +
        `INVESTOR DETAILS:\n` +
        `• Name: ${booking.investorName}\n` +
        `• Email: ${booking.email}\n` +
        `• Phone / WhatsApp: ${booking.phone}\n` +
        `• Topic / Area of Interest: ${booking.consultationTopic}\n` +
        `• Preferred Channel: ${booking.preferredChannel}\n` +
        `• Target Budget: AED ${booking.targetBudgetAED.toLocaleString()}\n\n` +
        `Please confirm advisor availability and schedule a consultation slot.\n\n` +
        `Best regards,\n${booking.investorName}`
    );

    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  public getEoiEmailUrl(eoi: EOIForm, formattedPrice: string): string {
    const recipient = this.getAdvisorEmail();
    const subject = encodeURIComponent(`[EOI Submission] Property Allocation — ${eoi.propertyName}`);
    const body = encodeURIComponent(
      `Dear MITTAL & CO. Advisory Desk,\n\n` +
        `I have completed an Expression of Interest (EOI) for property allocation.\n\n` +
        `PROPERTY & INVESTOR DETAILS:\n` +
        `• Property: ${eoi.propertyName}\n` +
        `• Investor Name: ${eoi.investorName}\n` +
        `• Email: ${eoi.email}\n` +
        `• Phone: ${eoi.phone}\n` +
        `• Country of Residence: ${eoi.country}\n` +
        `• Financing Preference: ${eoi.financingPreference}\n` +
        `• Target Investment Budget: ${formattedPrice}\n\n` +
        `Please share available unit allocations and payment schedule.\n\n` +
        `Best regards,\n${eoi.investorName}`
    );

    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  // --- GMAIL WEB DIRECT LINKS (No Desktop App Required) ---
  public getConsultationGmailWebUrl(booking: ConsultationBooking): string {
    const recipient = this.getAdvisorEmail();
    const subject = encodeURIComponent(`[Booking Request] Private Consultation — ${booking.investorName}`);
    const body = encodeURIComponent(
      `Dear MITTAL & CO. Advisory Desk,\n\n` +
        `I would like to request an advisory consultation with Alexander Wright.\n\n` +
        `INVESTOR DETAILS:\n` +
        `• Name: ${booking.investorName}\n` +
        `• Email: ${booking.email}\n` +
        `• Phone / WhatsApp: ${booking.phone}\n` +
        `• Topic / Area of Interest: ${booking.consultationTopic}\n` +
        `• Preferred Channel: ${booking.preferredChannel}\n` +
        `• Target Budget: AED ${booking.targetBudgetAED.toLocaleString()}\n\n` +
        `Please confirm advisor availability and schedule a consultation slot.\n\n` +
        `Best regards,\n${booking.investorName}`
    );

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
  }

  public getEoiGmailWebUrl(eoi: EOIForm, formattedPrice: string): string {
    const recipient = this.getAdvisorEmail();
    const subject = encodeURIComponent(`[EOI Submission] Property Allocation — ${eoi.propertyName}`);
    const body = encodeURIComponent(
      `Dear MITTAL & CO. Advisory Desk,\n\n` +
        `I have completed an Expression of Interest (EOI) for property allocation.\n\n` +
        `PROPERTY & INVESTOR DETAILS:\n` +
        `• Property: ${eoi.propertyName}\n` +
        `• Investor Name: ${eoi.investorName}\n` +
        `• Email: ${eoi.email}\n` +
        `• Phone: ${eoi.phone}\n` +
        `• Country of Residence: ${eoi.country}\n` +
        `• Financing Preference: ${eoi.financingPreference}\n` +
        `• Target Investment Budget: ${formattedPrice}\n\n` +
        `Please share available unit allocations and payment schedule.\n\n` +
        `Best regards,\n${eoi.investorName}`
    );

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
  }
}

export const whatsappService = new LeadCommunicationService();
export const leadCommService = whatsappService;
