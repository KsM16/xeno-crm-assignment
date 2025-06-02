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
