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
  investorName: z.string().min(2, 'Name is required (at least 2 characters)'),
  email: z.string().email('Invalid email address format'),
  phone: z.string().min(7, 'Mobile or WhatsApp number is required'),
  country: z.string().min(2, 'Country of residence is required'),
  targetBudgetAED: z.number().positive(),
  preferredChannel: z.enum(['WhatsApp', 'Video Call', 'In-Person Meeting']),
  consultationTopic: z.string().min(5, 'Please specify your topic or area of interest'),
  scheduledDate: z.string().optional(),
});
