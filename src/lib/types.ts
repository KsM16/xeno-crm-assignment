
export interface User {
  id?: string;
  name?: string | null;
  email: string;
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  criteria: {
    demographics?: string;
    purchaseHistory?: string;
    engagementBehavior?: string;
  };
  customerCount: number;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  targetSegmentId: string;
  targetSegmentName?: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Archived';
  sentDate?: string;
  createdDate: string;
  openRate?: number;
  clickRate?: number;
  audienceSize?: number;
  sentCount?: number;
  failedCount?: number;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

export interface AnalyticsData {
  date: string;
  value: number;
  category?: string;
}

// Data Ingestion Types
export interface CustomerIngestionData {
  id: string; // External unique ID for the customer
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  tags?: string[];
  // Example custom fields
  registrationDate?: string; // ISO 8601
  lastLoginDate?: string; // ISO 8601
  [key: string]: any; // For additional custom properties
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderIngestionData {
  id: string; // External unique ID for the order
  customerId: string;
  orderDate: string; // ISO 8601 date string
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  paymentMethod?: string;
  // Example custom fields
  discountAmount?: number;
  shippingCost?: number;
  [key: string]: any; // For additional custom properties
}
