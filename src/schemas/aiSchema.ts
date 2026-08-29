import { z } from 'zod';

export const AIAdvisorResponseSchema = z.object({
  marketView: z.string(),
  confidence: z.number().min(0).max(100),
  summary: z.string(),
  drivers: z.array(z.string()),
  risks: z.array(z.string()),
  recommendedAreas: z.array(z.string()),
  recommendedProperties: z.array(z.string()),
  sources: z.array(z.string()),
  generatedAt: z.string(),
});

export type AIAdvisorResponse = z.infer<typeof AIAdvisorResponseSchema>;
