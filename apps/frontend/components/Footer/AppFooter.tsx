import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { FooterSectionItem } from './FooterSection';
import { FooterSection } from './FooterSection';

export interface AppFooterProps {
  readonly appName?: string;
  readonly copyright: string;
  readonly sections?: Array<{
    title: string;
    items: FooterSectionItem[];
  }>;
  readonly note?: string;
}

export function AppFooter({ appName, copyright, sections = [], note }: AppFooterProps) {
  return (
    <Box
      component="footer"
      aria-label="footer"
      sx={{
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box sx={{ mx: 'auto', width: '100%', maxWidth: 1152, px: { xs: 2, sm: 3 }, py: 4 }}>
        {sections.length > 0 && (
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {sections.map((section) => (
              <Grid key={section.title} size={{ xs: 6, sm: 4, lg: 3 }}>
                <FooterSection title={section.title} items={section.items} />
              </Grid>
            ))}
          </Grid>
        )}

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
            gap: 0.5,
          }}
        >
          {appName && (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Think
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Shop
              </Box>
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {copyright}
          </Typography>
          {note && (
            <Typography variant="caption" color="text.secondary">
              {note}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
