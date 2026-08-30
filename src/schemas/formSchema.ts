import { z } from 'zod';

export const EOIFormSchema = z.object({
  propertyId: z.string().min(1, 'Property reference is required'),
  propertyName: z.string().min(1, 'Property name is required'),
  investorName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s'.\-]+$/, 'Please enter a valid name (letters only, no numbers)'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. investor@domain.com)'),
  phone: z
    .string()
    .min(7, 'Mobile or WhatsApp number is required (at least 7 digits)')
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number (digits only, e.g. +971501234567)'),
  country: z.string().min(2, 'Please enter your country of residence'),
  investorType: z.enum(['HNW Investor', 'International Buyer', 'Local UAE Expat', 'Institutional']),
  financingPreference: z.enum(['Off-Plan Payment Schedule', 'Full Cash', 'Mortgage']),
  budgetAED: z.number().positive('Target investment budget must be positive'),
});

export type EOIFormInput = z.infer<typeof EOIFormSchema>;
