import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import styles from './PolicyItemList.module.scss';

interface PolicyItemListProps {
  readonly items: ReactNode[];
  readonly ordered?: boolean;
}

export function PolicyItemList({ items, ordered = false }: PolicyItemListProps) {
  return (
    <Box
      component={ordered ? 'ol' : 'ul'}
      className={ordered ? styles.orderedList : styles.unorderedList}
    >
      {items.map((item, index) => (
        <li key={index}>
          <Typography variant="body1">{item}</Typography>
        </li>
      ))}
    </Box>
  );
}
