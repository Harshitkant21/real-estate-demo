export interface AppConfig {
  appName: string;
  tagline: string;
  companyDetails: {
    legalName: string;
    officeAddress: string;
    email: string;
    phone: string;
  };
  advisor: {
    name: string;
    title: string;
    networkAffiliation: string;
    whatsApp: string;
    photoUrl: string;
  };
  aiProvider: string;
  aiModel: string;
  aiBaseUrl: string;
  nvidiaApiKey: string;
  mistralApiKey: string;
  defaultCurrency: string;
  supportedCurrencies: string[];
  exchangeRateApiUrl: string;
  rateCacheDurationMs: number;
}

const rawWhatsapp = (import.meta.env.VITE_ADVISOR_WHATSAPP || '971501234567').toString().replace(/\D/g, '');

export const APP_CONFIG: AppConfig = {
  appName: 'MITTAL & CO.',
  tagline: 'Dubai real estate, intelligently invested.',
  companyDetails: {
    legalName: 'MITTAL & CO. Real Estate Advisory LLC',
    officeAddress: 'Level 28, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
    email: import.meta.env.VITE_ADVISOR_EMAIL || 'mittalanmol422@mittalco.org',
    phone: '+971 4 123 4567',
  },
  advisor: {
    name: 'Anmol Mittal',
    title: 'Senior Dubai Real Estate & Private Wealth Advisor',
    networkAffiliation: 'LICENSED BROKERAGE PARTNER NETWORK',
    whatsApp: rawWhatsapp,
    photoUrl: 'https://res.cloudinary.com/j7klg679/image/upload/v1788087252/183833ac-6fdb-4aa6-956a-50fc328877d1.jpg',
  },
  aiProvider: import.meta.env.VITE_AI_PROVIDER || 'nvidia',
  aiModel: import.meta.env.VITE_AI_MODEL || 'meta/llama-3.1-8b-instruct',
  aiBaseUrl: import.meta.env.VITE_AI_BASE_URL || '/api/nvidia/v1/chat/completions',
  nvidiaApiKey: '', // Server-handled via proxy header
  mistralApiKey: '', // Server-handled via proxy header
  defaultCurrency: 'AED',
  supportedCurrencies: ['AED', 'INR', 'USD', 'EUR', 'GBP', 'SAR'],
  exchangeRateApiUrl: 'https://open.er-api.com/v6/latest/AED',
  rateCacheDurationMs: 1000 * 60 * 60 * 12, // 12 Hours
};
