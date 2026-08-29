import { z } from 'zod';

export const EOIFormSchema = z.object({
  propertyId: z.string().min(1, 'Property reference is required'),
  propertyName: z.string().min(1, 'Property name is required'),
  investorName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number with country code'),
  country: z.string().min(2, 'Please enter your country of residence'),
  investorType: z.enum(['HNW Investor', 'International Buyer', 'Local UAE Expat', 'Institutional']),
  financingPreference: z.enum(['Off-Plan Payment Schedule', 'Full Cash', 'Mortgage']),
  budgetAED: z.number().positive('Target investment budget must be positive'),
});

export type EOIFormInput = z.infer<typeof EOIFormSchema>;
