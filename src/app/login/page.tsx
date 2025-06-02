import LoginForm from '@/components/auth/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | ClientPulse',
  description: 'Login to your ClientPulse account.',
};

export default function LoginPage() {
  return <LoginForm />;
}
