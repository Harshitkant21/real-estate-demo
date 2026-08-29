import { z } from 'zod';

export const FloorPlanSchema = z.object({
  title: z.string(),
  image: z.string(),
  bedrooms: z.number(),
  sqft: z.number(),
});

export const MediaSchema = z.object({
  heroImage: z.string(),
  galleryImages: z.array(z.string()),
  floorPlans: z.array(FloorPlanSchema).optional(),
  videoUrl: z.string().optional(),
});

export const ThesisSchema = z.object({
  whyInvest: z.string(),
  growthDrivers: z.array(z.string()),
  targetProfile: z.string(),
});

export const PropertySchema = z.object({
  id: z.string(),
  name: z.string(),
  developer: z.string(),
  area: z.string(),
  propertyType: z.enum(['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex']),
  startingPrice: z.number().positive(),
  currency: z.literal('AED'),
  bedrooms: z.number(),
  bathrooms: z.number(),
  sizeSqft: z.number().positive(),
  paymentPlan: z.string(),
  handover: z.string(),
  rentalYield: z.number(),
  status: z.enum(['Featured', 'Off-Plan', 'Newly Launched', 'Ready']),
  waterfront: z.boolean(),
  goldenVisaEligible: z.boolean(),
  media: MediaSchema,
  thesis: ThesisSchema,
  risks: z.array(z.string()),
});

export const DeveloperSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string(),
  overview: z.string(),
  deliveredProjects: z.number(),
  upcomingLaunches: z.number(),
  portfolioYield: z.number(),
  deliveryScore: z.number(),
  insights: z.array(z.string()),
  flagshipProject: z.string(),
});

export const LaunchSchema = z.object({
  id: z.string(),
  name: z.string(),
  developer: z.string(),
  area: z.string(),
  launchDate: z.string(),
  timeframe: z.enum(['Next 30 Days', 'Next 90 Days', 'Next Quarter']),
  startingPrice: z.number().positive(),
  paymentPlan: z.string(),
  handover: z.string(),
  propertyType: z.string(),
  expectedYield: z.number().optional(),
  status: z.string(),
  highlights: z.array(z.string()),
  image: z.string(),
});

export const AreaSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  avgPriceSqft: z.number(),
  avgYield: z.number(),
  yoyAppreciation: z.number(),
  keyDrivers: z.array(z.string()),
  heroImage: z.string(),
  totalTransactions: z.string(),
});

export const PropertyListSchema = z.array(PropertySchema);
export const DeveloperListSchema = z.array(DeveloperSchema);
export const LaunchListSchema = z.array(LaunchSchema);
export const AreaListSchema = z.array(AreaSchema);
