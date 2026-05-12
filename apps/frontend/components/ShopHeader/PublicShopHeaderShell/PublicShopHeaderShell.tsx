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

export type HeaderSearchSuggestion = {
  readonly id: string;
  readonly title: string;
  readonly brand: string | null;
  readonly categoryLabel: string;
  readonly subcategoryLabel: string | null;
  readonly imageSrc: string;
  readonly href: string;
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
  readonly searchSuggestions?: readonly HeaderSearchSuggestion[];
  readonly showSearchSuggestions?: boolean;
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
  searchSuggestions = [],
  showSearchSuggestions = false,
  actionsSlot,
  cartSlot,
}: Readonly<PublicShopHeaderShellProps>) {
  return (
    <AppBar position="sticky" elevation={0} className={styles.appBar}>
      <Box className={styles.headerInner}>
        <Toolbar className={styles.toolbar}>
          {/* Left: logo */}
          <Box className={styles.toolbarLeft}>
            <Box aria-label={appName} className={styles.logoLink}>
              <Typography component="span" className={styles.logoText}>
                Think
                <Box component="span" className={styles.logoAccent}>
                  Shop
                </Box>
              </Typography>
            </Box>
          </Box>

          {/* Center: home + search */}
          <Box className={styles.toolbarCenter}>
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
              role="search"
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
              {showSearchSuggestions && searchSuggestions.length > 0 ? (
                <Box component="ul" className={styles.suggestionMenu}>
                  {searchSuggestions.map((product) => (
                    <Box component="li" key={product.id} className={styles.suggestionItem}>
                      <Link href={product.href} className={styles.suggestionLink}>
                        {product.imageSrc ? (
                          <Box
                            component="img"
                            src={product.imageSrc}
                            alt={product.title}
                            className={styles.suggestionImage}
                          />
                        ) : (
                          <Box className={styles.suggestionImageFallback} aria-hidden="true" />
                        )}
                        <Box className={styles.suggestionText}>
                          <Typography className={styles.suggestionTitle}>{product.title}</Typography>
                          <Box className={styles.suggestionMeta}>
                            {product.brand ? (
                              <Typography component="span" className={styles.suggestionMetaItem}>
                                {product.brand}
                              </Typography>
                            ) : null}
                            <Typography component="span" className={styles.suggestionMetaItem}>
                              {product.categoryLabel}
                            </Typography>
                            {product.subcategoryLabel ? (
                              <Typography component="span" className={styles.suggestionMetaItem}>
                                {product.subcategoryLabel}
                              </Typography>
                            ) : null}
                          </Box>
                        </Box>
                      </Link>
                    </Box>
                  ))}
                </Box>
              ) : null}
              <Button
                type="submit"
                variant="contained"
                aria-label={searchLabel}
                className={styles.searchButton}
              >
                <SearchIcon fontSize="small" />
              </Button>
            </Box>
          </Box>

          {/* Right: cart + auth actions */}
          <Box className={styles.toolbarRight}>
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
