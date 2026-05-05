import Grid from '@mui/material/Grid';
import type { ReactNode } from 'react';
import { AppFooter } from '@/components/Footer/AppFooter/AppFooter';
import { FooterSection } from '@/components/Footer/FooterSection/FooterSection';
import { FooterLink } from '@/components/Footer/FooterLink/FooterLink';
import type { FooterSection as FooterSectionData } from '@/lib/footer/footerSections';
import styles from './FooterFeature.module.scss';

type FooterFeatureProps = {
  readonly appName?: string;
  readonly copyright: string;
  readonly note?: string;
  readonly sections?: FooterSectionData[];
};

export function FooterFeature({
  appName,
  copyright,
  note,
  sections = [],
}: Readonly<FooterFeatureProps>) {
  const sectionsSlot: ReactNode =
    sections.length > 0 ? (
      <Grid container spacing={4} className={styles.sectionsGrid}>
        {sections.map((section) => (
          <Grid key={section.title} size={{ xs: 6, sm: 4, lg: 3 }}>
            <FooterSection title={section.title}>
              {section.items.map((item) => (
                <FooterLink key={`${item.href}-${item.label}`} href={item.href} label={item.label} />
              ))}
            </FooterSection>
          </Grid>
        ))}
      </Grid>
    ) : null;

  return (
    <AppFooter
      appName={appName}
      copyright={copyright}
      note={note}
      sectionsSlot={sectionsSlot}
    />
  );
}
