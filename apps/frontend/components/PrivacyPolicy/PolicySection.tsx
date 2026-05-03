import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface PolicySectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
