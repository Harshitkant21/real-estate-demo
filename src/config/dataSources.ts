export type DataSourceType =
  | 'GOVERNMENT_OPEN_DATA'
  | 'LICENSED_API'
  | 'EDITORIAL_VERIFIED'
  | 'DERIVED_ENGINE'
  | 'AI_MODEL'
  | 'NEWS_FEED';

export type DataFreshnessStatus =
  | 'LIVE'
  | 'RECENT'
  | 'CACHED'
  | 'DERIVED'
  | 'AI ANALYSIS'
  | 'EDITORIAL'
  | 'UNAVAILABLE';

export interface DataSourceMeta {
  id: string;
  sourceName: string;
  sourceType: DataSourceType;
  providerAgency: string;
  endpoint: string;
  accessMethod: 'REST_GET' | 'REST_POST' | 'STATIC_JSON' | 'EDGE_PROXY';
  authenticationRequired: boolean;
  refreshFrequency: string;
  fieldsAvailable: string[];
  rateLimit: string;
  licenseUsageNotes: string;
  fallbackStrategy: string;
  defaultStatus: DataFreshnessStatus;
}

export const DATA_SOURCE_REGISTRY: Record<string, DataSourceMeta> = {
  'pf-developers': {
    id: 'pf-developers',
    sourceName: 'Property Finder API via RapidAPI',
    sourceType: 'LICENSED_API',
    providerAgency: 'Property Finder / RapidAPI',
    endpoint: 'https://property-finder6.p.rapidapi.com/real-estate-developer',
    accessMethod: 'REST_GET',
    authenticationRequired: true,
    refreshFrequency: 'Real-time API Sync',
    fieldsAvailable: [
      'id',
      'name',
      'description',
      'established_since',
      'num_projects_online',
      'logo_url',
      'slug',
    ],
    rateLimit: 'RapidAPI Subscription Quota',
    licenseUsageNotes: 'Verified live developer registry feed directly from Property Finder RapidAPI.',
    fallbackStrategy: 'Honest UNAVAILABLE status state on network failure',
    defaultStatus: 'LIVE',
  },

  'open-fx': {
    id: 'open-fx',
    sourceName: 'Open Exchange Rates FX API',
    sourceType: 'LICENSED_API',
    providerAgency: 'Open Exchange Rates Inc.',
    endpoint: 'https://open.er-api.com/v6/latest/AED',
    accessMethod: 'REST_GET',
    authenticationRequired: false,
    refreshFrequency: 'Hourly Updates (12h LocalStorage Cache)',
    fieldsAvailable: ['rates', 'time_last_update_utc', 'base_code'],
    rateLimit: 'Standard Public Endpoint Rate Limit',
    licenseUsageNotes: 'Commercial Open License with 12h client caching',
    fallbackStrategy: 'Honest UNAVAILABLE status state on network failure',
    defaultStatus: 'LIVE',
  },

  'nvidia-ai': {
    id: 'nvidia-ai',
    sourceName: 'Mittalco Wealth Advisory AI',
    sourceType: 'AI_MODEL',
    providerAgency: 'NVIDIA NIM API',
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    accessMethod: 'EDGE_PROXY',
    authenticationRequired: true,
    refreshFrequency: 'On-Demand Interactive Reasoning',
    fieldsAvailable: [
      'marketView',
      'confidence',
      'summary',
      'drivers',
      'risks',
      'recommendedAreas',
      'recommendedProperties',
      'sources',
      'generatedAt',
    ],
    rateLimit: 'API Key Quota Scoped',
    licenseUsageNotes: 'NVIDIA NIM Hosted Model API with server-side key management',
    fallbackStrategy: 'Honest AI_UNAVAILABLE status state on model or network failure',
    defaultStatus: 'AI ANALYSIS',
  },
};
