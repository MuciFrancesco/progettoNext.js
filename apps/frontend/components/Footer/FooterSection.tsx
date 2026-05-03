import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FooterLink } from './FooterLink';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        variant="overline"
        sx={{ color: 'text.disabled', fontWeight: 600, letterSpacing: '0.1em' }}
      >
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
