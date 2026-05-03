import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface PolicyHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
}

export function PolicyHeader({ title, subtitle }: PolicyHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
