'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from './PanelsGrid.module.scss';

export interface PanelItem {
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly testId: string;
}

interface PanelsGridProps {
  readonly panels: PanelItem[];
  readonly goToLabel: string;
}

export function PanelsGrid({ panels }: Readonly<PanelsGridProps>) {
  const pathname = usePathname();

  return (
    <Paper variant="outlined" className={styles.list}>
      {panels.map((panel, i) => {
        const isActive = pathname === panel.href;
        return (
          <Box
            key={panel.href}
            component={Link}
            href={panel.href}
            data-testid={panel.testId}
            className={clsx(styles.row, isActive && styles.rowActive)}
          >
            {/* Icon */}
            <Box className={clsx(styles.rowIcon, isActive && styles.rowIconActive)}>
              {panel.icon}
            </Box>

            {/* Title */}
            <Typography
              variant="body2"
              className={clsx(styles.rowTitle, isActive && styles.rowTitleActive)}
            >
              {panel.title}
            </Typography>

            {/* Arrow */}
            <ArrowForwardIcon
              className={clsx(styles.rowArrow, isActive && styles.rowArrowActive)}
            />
          </Box>
        );
      })}
    </Paper>
  );
}
