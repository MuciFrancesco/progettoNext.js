import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FooterLink } from './FooterLink';
import styles from './FooterSection.module.scss';

export interface FooterSectionItem {
  href: string;
  label: string;
  external?: boolean;
}

export interface FooterSectionProps {
  readonly title: string;
  readonly items: FooterSectionItem[];
}

export function FooterSection({ title, items }: FooterSectionProps) {
  return (
    <Box className={styles.section}>
      <Typography variant="overline" className={styles.title}>
        {title}
      </Typography>
      {items.map((item) => (
        <FooterLink
          key={`${item.href}-${item.label}`}
          href={item.href}
          label={item.label}
          external={item.external}
        />
      ))}
    </Box>
  );
}
