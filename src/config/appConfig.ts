export interface AppConfig {
  appName: string;
  tagline: string;
  advisorWhatsApp: string;
  nvidiaApiKey: string;
  defaultCurrency: string;
  supportedCurrencies: string[];
  exchangeRateApiUrl: string;
  nvidiaNimApiUrl: string;
  rateCacheDurationMs: number;
  featureFlags: {
    enableLiveMarketApi: boolean;
    enableSentimentTelemetry: boolean;
    enableEoiSubmission: boolean;
  };
}

export const APP_CONFIG: AppConfig = {
  appName: 'AM Estates',
  tagline: 'Dubai real estate, intelligently invested.',
  advisorWhatsApp: import.meta.env.VITE_ADVISOR_WHATSAPP || '',
  nvidiaApiKey: import.meta.env.VITE_NVIDIA_API_KEY || '',
  defaultCurrency: 'AED',
  supportedCurrencies: ['AED', 'INR', 'USD', 'EUR', 'GBP', 'SAR'],
  exchangeRateApiUrl: 'https://open.er-api.com/v6/latest/AED',
  nvidiaNimApiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
  rateCacheDurationMs: 1000 * 60 * 60 * 12, // 12 Hours
  featureFlags: {
    enableLiveMarketApi: true,
    enableSentimentTelemetry: true,
    enableEoiSubmission: true,
  },
};
