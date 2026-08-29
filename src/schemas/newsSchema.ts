import { z } from 'zod';

export const NewsCategorySchema = z.enum([
  'DLD Regulation',
  'Market Momentum',
  'Infrastructure & Connectivity',
  'Major Project Launch',
  'Macro Economic & Visa',
]);

export const NewsItemSchema = z.object({
  id: z.string(),
  headline: z.string().min(5),
  summary: z.string().min(10),
  category: NewsCategorySchema,
  sourceName: z.string(),
  sourceUrl: z.string().url().or(z.string().min(1)),
  publishedAt: z.string(),
  verifiedStatus: z.enum(['VERIFIED', 'OFFICIAL_WIRE', 'DEVELOPER_NOTICE']),
  impactArea: z.string().optional(),
});

export const NewsListSchema = z.array(NewsItemSchema);
