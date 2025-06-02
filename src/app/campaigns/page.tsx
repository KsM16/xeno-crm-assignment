import AppLayout from '@/components/layout/app-layout';
import CampaignsContent from '@/components/campaigns/campaigns-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campaign Management | ClientPulse',
  description: 'Design, schedule, and manage your email campaigns.',
};

export default function CampaignsPage() {
  return (
    <AppLayout>
      <CampaignsContent />
    </AppLayout>
  );
}
