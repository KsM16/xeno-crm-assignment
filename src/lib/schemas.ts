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

// Data Ingestion Schemas
export const CustomerIngestionSchema = z.object({
  id: z.string().min(1, { message: 'Customer ID is required.' }),
  name: z.string().min(1, { message: 'Customer name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  registrationDate: z.string().datetime({ message: "Invalid registration date format. Use ISO 8601." }).optional(),
  lastLoginDate: z.string().datetime({ message: "Invalid last login date format. Use ISO 8601." }).optional(),
}).catchall(z.any()); // Allows additional custom properties

export type CustomerIngestionPayload = z.infer<typeof CustomerIngestionSchema>;

export const OrderItemSchema = z.object({
  productId: z.string().min(1, { message: 'Product ID is required.' }),
  productName: z.string().min(1, { message: 'Product name is required.' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1.' }),
  unitPrice: z.number().min(0, { message: 'Unit price cannot be negative.' }),
  totalPrice: z.number().min(0, { message: 'Total price cannot be negative.' }),
});

export const OrderIngestionSchema = z.object({
  id: z.string().min(1, { message: 'Order ID is required.' }),
  customerId: z.string().min(1, { message: 'Customer ID is required.' }),
  orderDate: z.string().datetime({ message: "Invalid order date format. Use ISO 8601." }),
  items: z.array(OrderItemSchema).min(1, { message: 'Order must contain at least one item.' }),
  totalAmount: z.number().min(0, { message: 'Total amount cannot be negative.' }),
  currency: z.string().min(3, { message: 'Currency code is required (e.g., USD).' }).max(3),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  shippingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  paymentMethod: z.string().optional(),
  discountAmount: z.number().optional(),
  shippingCost: z.number().optional(),
}).catchall(z.any()); // Allows additional custom properties

export type OrderIngestionPayload = z.infer<typeof OrderIngestionSchema>;
