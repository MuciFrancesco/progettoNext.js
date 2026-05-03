'use client';

import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { DashboardLink } from './helpers/dashboardLinks';

type NavDrawerProps = {
  readonly links: DashboardLink[];
  readonly navAriaLabel: string;
};

export function NavDrawer({ links, navAriaLabel }: NavDrawerProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <IconButton
        aria-label="Apri menu di navigazione"
        onClick={() => setOpen(true)}
        sx={{ color: 'var(--foreground)', ml: 'auto' }}
      >
        <MoreVertIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 280 } } }}
      >
        <Box sx={{ px: 2, py: 2.5 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
            {navAriaLabel}
          </Typography>
        </Box>

        <Divider />

        <List component="nav" aria-label={navAriaLabel} sx={{ pt: 1 }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                selected={isActive}
                onClick={() => setOpen(false)}
                sx={{
                  borderRadius: 1.5,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                {link.Icon && (
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <link.Icon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={link.label}
                  slotProps={{
                    primary: { sx: { fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 } },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
