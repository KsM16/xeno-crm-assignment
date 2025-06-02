import AppLayout from '@/components/layout/app-layout';
import AnalyticsContent from '@/components/analytics/analytics-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics & Reporting | ClientPulse',
  description: 'Detailed analytics on campaign performance, customer engagement, and revenue impact.',
};

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <AnalyticsContent />
    </AppLayout>
  );
}
