'use client';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import { SearchTextField } from '@/components/SearchTextField/SearchTextField';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

type RoleManagerSearchBarProps = {
  readonly locale: Locale;
  readonly isPending: boolean;
  readonly searchEmail: string;
  readonly searchName: string;
  readonly onSearchEmailChange: (value: string) => void;
  readonly onSearchNameChange: (value: string) => void;
  readonly onSearch: () => void;
  readonly onSearchReset: () => void;
};

export function RoleManagerSearchBar({
  locale,
  isPending,
  searchEmail,
  searchName,
  onSearchEmailChange,
  onSearchNameChange,
  onSearch,
  onSearchReset,
}: Readonly<RoleManagerSearchBarProps>) {
  const t = createTranslator(locale);

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-end' }}
    >
      <Box sx={{ flex: '1 1 220px', minWidth: 180 }}>
        <SearchTextField
          label={t('roleManagerSearchEmail')}
          value={searchEmail}
          onChange={onSearchEmailChange}
          disabled={isPending}
        />
      </Box>
      <Box sx={{ flex: '1 1 220px', minWidth: 180 }}>
        <SearchTextField
          label={t('roleManagerSearchName')}
          value={searchName}
          onChange={onSearchNameChange}
          disabled={isPending}
        />
      </Box>
      <MuiButton
        type="submit"
        variant="contained"
        className="btn-add"
        size="small"
        startIcon={<SearchIcon />}
        disabled={isPending || (!searchEmail && !searchName)}
      >
        {t('roleManagerSearchButton')}
      </MuiButton>
      <MuiButton
        variant="outlined"
        size="small"
        startIcon={<ClearIcon />}
        onClick={onSearchReset}
        disabled={isPending}
      >
        {t('roleManagerSearchReset')}
      </MuiButton>
    </Box>
  );
}
