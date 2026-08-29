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
  DLD_PULSE: {
    id: 'DLD_PULSE',
    sourceName: 'Dubai Land Department (DLD) / Dubai Pulse Open Data Portal',
    sourceType: 'GOVERNMENT_OPEN_DATA',
    providerAgency: 'Government of Dubai / DLD',
    endpoint: '/api/dld-benchmark',
    accessMethod: 'REST_GET',
    authenticationRequired: false,
    refreshFrequency: 'Daily Open Data Batch',
    fieldsAvailable: [
      'residentialSaleIndex',
      'transactionVolume24h',
      'transactionValue24hAED',
      'avgPricePerSqftAED',
      'yoyPriceGrowthPercent',
      'yoyVolumeGrowthPercent',
      'avgNetRentalYieldPercent',
      'areaBenchmarks',
    ],
    rateLimit: 'Public Open Data Domain',
    licenseUsageNotes: 'Official Dubai Open Data License (Public Domain)',
    fallbackStrategy: 'Validated local DLD baseline dataset',
    defaultStatus: 'RECENT',
  },

  OPEN_EXCHANGE_RATES: {
    id: 'OPEN_EXCHANGE_RATES',
    sourceName: 'Open Exchange Rates FX API',
    sourceType: 'LICENSED_API',
    providerAgency: 'Open Exchange Rates Inc.',
    endpoint: 'https://open.er-api.com/v6/latest/AED',
    accessMethod: 'REST_GET',
    authenticationRequired: false,
    refreshFrequency: 'Hourly Updates (12h LocalStorage Cache)',
    fieldsAvailable: ['rates', 'time_last_update_utc', 'base_code'],
    rateLimit: 'Standard Public Endpoint Rate Limit',
    licenseUsageNotes: 'Commercial Open License with 12h caching',
    fallbackStrategy: 'Pre-configured static AED conversion matrix',
    defaultStatus: 'LIVE',
  },

  NVIDIA_NIM_AI: {
    id: 'NVIDIA_NIM_AI',
    sourceName: 'NVIDIA NIM AI Reasoning Service',
    sourceType: 'AI_MODEL',
    providerAgency: 'NVIDIA Corporation',
    endpoint: '/api/nvidia/v1/chat/completions',
    accessMethod: 'EDGE_PROXY',
    authenticationRequired: true,
    refreshFrequency: 'On-Demand Interactive Streaming',
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
    licenseUsageNotes: 'Commercial Enterprise API Key via Secure Proxy',
    fallbackStrategy: 'Deterministic Market Score Engine & Contextual Rules',
    defaultStatus: 'AI ANALYSIS',
  },

  DUBAI_REAL_ESTATE_NEWS: {
    id: 'DUBAI_REAL_ESTATE_NEWS',
    sourceName: 'Dubai Government Media Office & DLD Official News Wire',
    sourceType: 'NEWS_FEED',
    providerAgency: 'DLD Communications & Media Office',
    endpoint: '/api/news-feed',
    accessMethod: 'REST_GET',
    authenticationRequired: false,
    refreshFrequency: 'Real-time News Ingestion',
    fieldsAvailable: [
      'id',
      'headline',
      'summary',
      'category',
      'sourceName',
      'sourceUrl',
      'publishedAt',
      'verifiedStatus',
    ],
    rateLimit: 'Public News Aggregator',
    licenseUsageNotes: 'Fair-use news summary with original source URL attribution',
    fallbackStrategy: 'Verified local news archive JSON',
    defaultStatus: 'RECENT',
  },

  AM_EDITORIAL_DOSSIERS: {
    id: 'AM_EDITORIAL_DOSSIERS',
    sourceName: 'AM Estates Editorial Research & Private Wealth Intelligence',
    sourceType: 'EDITORIAL_VERIFIED',
    providerAgency: 'AM Estates Research Desk',
    endpoint: '/data/properties.json',
    accessMethod: 'STATIC_JSON',
    authenticationRequired: false,
    refreshFrequency: 'Build-time Editorial Verification',
    fieldsAvailable: [
      'id',
      'name',
      'area',
      'developer',
      'startingPrice',
      'rentalYield',
      'investmentThesis',
      'paymentPlan',
      'handover',
    ],
    rateLimit: 'Local Static Asset',
    licenseUsageNotes: 'Proprietary AM Estates Editorial Content',
    fallbackStrategy: 'Static JSON Dossier Archive',
    defaultStatus: 'EDITORIAL',
  },
};
