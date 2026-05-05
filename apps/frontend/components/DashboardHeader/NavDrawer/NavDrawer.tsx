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
import type { DashboardLink } from '../helpers/dashboardLinks';
import styles from './NavDrawer.module.scss';

type NavDrawerProps = {
  readonly links: DashboardLink[];
  readonly navAriaLabel: string;
};

export function NavDrawer({ links, navAriaLabel }: NavDrawerProps) {
  // UI-local state: acceptable in atomic components.
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <IconButton
        aria-label="Apri menu di navigazione"
        onClick={() => setOpen(true)}
        className={styles.triggerButton}
      >
        <MoreVertIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { className: styles.drawerPaper } }}
      >
        <Box className={styles.drawerHeader}>
          <Typography variant="subtitle2" color="text.secondary" className={styles.sectionLabel}>
            {navAriaLabel}
          </Typography>
        </Box>

        <Divider />

        <List component="nav" aria-label={navAriaLabel} className={styles.navList}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                selected={isActive}
                onClick={() => setOpen(false)}
                className={styles.navItem}
              >
                {link.Icon && (
                  <ListItemIcon className={styles.navItemIcon}>
                    <link.Icon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={link.label}
                  slotProps={{
                    primary: {
                      className: `${styles.navItemLabel} ${isActive ? styles.navItemLabelActive : ''}`,
                    },
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
