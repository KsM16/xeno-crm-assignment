import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});
export type LoginFormValues = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});
export type SignupFormValues = z.infer<typeof SignupSchema>;

export const CampaignOptimizerSchema = z.object({
  campaignData: z.string().min(10, { message: 'Campaign data must be at least 10 characters.' }).max(5000, { message: 'Campaign data is too long.'}),
  emailContent: z.string().min(10, { message: 'Email content must be at least 10 characters.' }).max(5000, { message: 'Email content is too long.'}),
});
export type CampaignOptimizerFormValues = z.infer<typeof CampaignOptimizerSchema>;

export const SegmentSchema = z.object({
  name: z.string().min(3, {message: "Segment name must be at least 3 characters."}),
  description: z.string().optional(),
  criteria: z.object({
    demographics: z.string().optional(),
    purchaseHistory: z.string().optional(),
    engagementBehavior: z.string().optional(),
  })
});
export type SegmentFormValues = z.infer<typeof SegmentSchema>;

export const CampaignSchema = z.object({
  name: z.string().min(3, {message: "Campaign name must be at least 3 characters."}),
  subject: z.string().min(5, {message: "Subject line must be at least 5 characters."}),
  targetSegmentId: z.string().min(1, {message: "Target segment is required."}),
  emailContent: z.string().min(20, {message: "Email content must be at least 20 characters."}),
  sendDate: z.date().optional(),
});
export type CampaignFormValues = z.infer<typeof CampaignSchema>;
