import type { Metadata } from 'next';
import { TermsFeature } from '@/features/terms/TermsFeature';
import { PublicPageFrame } from '@/features/layout/PublicPageFrame/PublicPageFrame';

export const metadata: Metadata = {
  title: 'Termini di Servizio',
};

export default function TermsPage() {
  return (
    <PublicPageFrame>
      <TermsFeature />
    </PublicPageFrame>
  );
}
