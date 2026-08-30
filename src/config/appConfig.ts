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
    reraLicense: string;
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

export const APP_CONFIG: AppConfig = {
  appName: 'MITTALCO',
  tagline: 'Dubai real estate, intelligently invested.',
  companyDetails: {
    legalName: 'MITTALCO Real Estate Advisory LLC',
    officeAddress: 'Level 28, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
    email: 'advisory@mittalco.com',
    phone: '+971 4 123 4567',
  },
  advisor: {
    name: 'Alexander Wright',
    title: 'Senior Dubai Real Estate & Private Wealth Advisor',
    reraLicense: 'RERA Broker License #39281',
    whatsApp: import.meta.env.VITE_ADVISOR_WHATSAPP || '971501234567',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
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

