import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface ContactInfoCardProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly primaryText: string;
  readonly secondaryText?: string;
}

export function ContactInfoCard({ icon, title, primaryText, secondaryText }: ContactInfoCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <Box sx={{ color: 'primary.main', mt: 0.25 }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.25 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {primaryText}
        </Typography>
        {secondaryText && (
          <Typography variant="caption" color="text.secondary">
            {secondaryText}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
