import { z } from 'zod';

export const AdvisorProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  reraLicenseNo: z.string(),
  brokeragePartner: z.string(),
  experienceYears: z.number().positive(),
  specialization: z.array(z.string()),
  languages: z.array(z.string()),
  bio: z.string(),
  email: z.string().email(),
  phoneWhatsApp: z.string(),
  officeAddress: z.string(),
  photoUrl: z.string(),
});

export const ConsultationBookingSchema = z.object({
  advisorId: z.string(),
  investorName: z
    .string()
    .min(2, 'Name is required (at least 2 characters)')
    .regex(/^[a-zA-Z\s'.\-]+$/, 'Please enter a valid name (letters only, no numbers)'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. investor@domain.com)'),
  phone: z
    .string()
    .min(7, 'Mobile or WhatsApp number is required (at least 7 digits)')
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number (digits only, e.g. +971501234567)'),
  country: z.string().min(2, 'Country of residence is required'),
  targetBudgetAED: z.number().positive(),
  preferredChannel: z.enum(['WhatsApp', 'Video Call', 'In-Person Meeting']),
  consultationTopic: z.string().min(5, 'Please specify your topic or area of interest'),
  scheduledDate: z.string().optional(),
});
