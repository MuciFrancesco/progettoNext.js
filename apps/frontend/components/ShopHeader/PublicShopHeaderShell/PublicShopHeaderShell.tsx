'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './PublicShopHeaderShell.module.scss';

type HeaderCategoryOption = {
  readonly slug: string;
  readonly label: string;
};

type PublicShopHeaderShellProps = {
  readonly appName: string;
  readonly cartLabel: string;
  readonly homeLabel: string;
  readonly searchLabel: string;
  readonly searchValue: string;
  readonly categoryLabel: string;
  readonly categoryOptions: readonly HeaderCategoryOption[];
  readonly selectedCategory: string;
  readonly onSearchValueChange: (value: string) => void;
  readonly onSearchSubmit: () => void;
  readonly onCategorySelect: (slug: string) => void;
  readonly actionsSlot?: ReactNode;
  readonly cartSlot?: ReactNode;
};

export function PublicShopHeaderShell({
  appName,
  cartLabel,
  homeLabel,
  searchLabel,
  searchValue,
  categoryLabel,
  categoryOptions,
  selectedCategory,
  onSearchValueChange,
  onSearchSubmit,
  onCategorySelect,
  actionsSlot,
  cartSlot,
}: Readonly<PublicShopHeaderShellProps>) {
  return (
    <AppBar position="sticky" elevation={0} className={styles.appBar}>
      <Box className={styles.headerInner}>
        <Toolbar className={styles.toolbar}>
          <Box aria-label={appName} className={styles.logoLink}>
            <Typography component="span" className={styles.logoText}>
              Think
              <Box component="span" className={styles.logoAccent}>
                Shop
              </Box>
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/"
            startIcon={<HomeIcon fontSize="small" />}
            className={styles.homeButton}
          >
            {homeLabel}
          </Button>

          <Box
            component="form"
            className={styles.searchForm}
            onSubmit={(event) => {
              event.preventDefault();
              onSearchSubmit();
            }}
          >
            <TextField
              value={searchValue}
              onChange={(event) => onSearchValueChange(event.target.value)}
              placeholder={searchLabel}
              size="small"
              fullWidth
              className={styles.searchField}
            />
            <Button
              type="submit"
              variant="contained"
              aria-label={searchLabel}
              className={styles.searchButton}
            >
              <SearchIcon fontSize="small" />
            </Button>
          </Box>

          <Box className={styles.actionsSlot}>
            {cartSlot}
            {actionsSlot}
          </Box>
        </Toolbar>

        <Stack component="nav" aria-label={categoryLabel} direction="row" className={styles.subnav}>
          {categoryOptions.map((option) => (
            <ButtonBase
              key={option.slug}
              onClick={() => onCategorySelect(option.slug)}
              className={
                selectedCategory === option.slug ? styles.subnavItemActive : styles.subnavItem
              }
            >
              <Typography component="span" className={styles.subnavLabel}>
                {option.label}
              </Typography>
            </ButtonBase>
          ))}
        </Stack>
      </Box>
    </AppBar>
  );
}
