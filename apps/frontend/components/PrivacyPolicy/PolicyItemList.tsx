import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface PolicyItemListProps {
  readonly items: ReactNode[];
  readonly ordered?: boolean;
}

/**
 * Renders a styled ul/ol list of policy items.
 * Keeps containers clean by extracting all li boilerplate here.
 */
export function PolicyItemList({ items, ordered = false }: PolicyItemListProps) {
  return (
    <Box
      component={ordered ? 'ol' : 'ul'}
      sx={{
        pl: 3,
        color: 'text.secondary',
        listStyleType: ordered ? 'decimal' : 'disc',
      }}
    >
      {items.map((item, index) => (
        <li key={index}>
          <Typography variant="body1">{item}</Typography>
        </li>
      ))}
    </Box>
  );
}
