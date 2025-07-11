import SignupForm from '@/components/auth/signup-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | ClientPulse',
  description: 'Create a new ClientPulse account.',
};

export default function SignupPage() {
  return <SignupForm />;
}
