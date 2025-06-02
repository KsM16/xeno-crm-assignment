import AppLayout from '@/components/layout/app-layout';
import DashboardContent from '@/components/dashboard/dashboard-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | ClientPulse',
  description: 'ClientPulse Dashboard - Overview of your customer engagement.',
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}
