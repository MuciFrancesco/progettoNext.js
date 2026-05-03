import type { Metadata } from 'next';
import { TermsFeature } from '@/features/terms/TermsFeature';

export const metadata: Metadata = {
  title: 'Termini di Servizio',
};

export default function TermsPage() {
  return <TermsFeature />;
}
