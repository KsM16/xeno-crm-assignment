import AppLayout from '@/components/layout/app-layout';
import SegmentsContent from '@/components/segments/segments-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Segments | ClientPulse',
  description: 'Create and manage customer segments for targeted campaigns.',
};

export default function SegmentsPage() {
  return (
    <AppLayout>
      <SegmentsContent />
    </AppLayout>
  );
}
