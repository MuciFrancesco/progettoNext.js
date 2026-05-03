'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { usePathname } from 'next/navigation';

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
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {panels.map((panel, i) => {
        const isActive = pathname === panel.href;
        return (
          <Box
            key={panel.href}
            component={Link}
            href={panel.href}
            data-testid={panel.testId}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.25,
              textDecoration: 'none',
              color: 'inherit',
              borderTop: i === 0 ? 'none' : '1px solid',
              borderColor: 'var(--border)',
              bgcolor: isActive ? 'var(--primary)' : 'var(--card)',
              transition: 'background-color 150ms',
              '&:hover': {
                bgcolor: isActive ? 'var(--primary)' : 'var(--secondary)',
                opacity: isActive ? 0.92 : 1,
              },
            }}
          >
            {/* Icona */}
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0,
                bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(11,60,93,0.08)',
              }}
            >
              {panel.icon}
            </Box>

            {/* Titolo */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                flex: 1,
                color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)',
              }}
            >
              {panel.title}
            </Typography>

            {/* Freccia */}
            <ArrowForwardIcon
              sx={{
                fontSize: '0.9rem',
                color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--primary)',
                flexShrink: 0,
              }}
            />
          </Box>
        );
      })}
    </Paper>
  );
}
