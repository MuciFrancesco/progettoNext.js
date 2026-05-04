'use client';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import type { ProductCategory } from '@/types/api/product';
import {
  CategoryMultiSelect,
  type SelectOption,
} from '@/components/CategoryMultiSelect/CategoryMultiSelect';
import { SearchTextField } from '@/components/SearchTextField/SearchTextField';

type UpdateProductSearchBarProps = {
  readonly locale: Locale;
  readonly isLocked: boolean;
  readonly categoryOptions: SelectOption[];
  readonly searchCategoriesDraft: ProductCategory[];
  readonly setSearchCategoriesDraft: (categories: ProductCategory[]) => void;
  readonly searchTitleDraft: string;
  readonly setSearchTitleDraft: (value: string) => void;
  readonly searchNameDraft: string;
  readonly setSearchNameDraft: (value: string) => void;
  readonly onSearch: () => void;
  readonly onReset: () => void;
};

export function UpdateProductSearchBar({
  locale,
  isLocked,
  categoryOptions,
  searchCategoriesDraft,
  setSearchCategoriesDraft,
  searchTitleDraft,
  setSearchTitleDraft,
  searchNameDraft,
  setSearchNameDraft,
  onSearch,
  onReset,
}: Readonly<UpdateProductSearchBarProps>) {
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
      <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
        <CategoryMultiSelect
          label={t('productSearchCategory')}
          options={categoryOptions}
          selected={searchCategoriesDraft}
          onChange={(values) => setSearchCategoriesDraft(values as ProductCategory[])}
          disabled={isLocked}
        />
      </Box>
      <Box sx={{ flex: '1 1 180px', minWidth: 160 }}>
        <SearchTextField
          label={t('productSearchTitle')}
          value={searchTitleDraft}
          onChange={setSearchTitleDraft}
          disabled={isLocked}
        />
      </Box>
      <Box sx={{ flex: '1 1 180px', minWidth: 160 }}>
        <SearchTextField
          label={t('productSearchName')}
          value={searchNameDraft}
          onChange={setSearchNameDraft}
          disabled={isLocked}
        />
      </Box>
      <MuiButton
        type="submit"
        variant="contained"
        startIcon={<SearchIcon />}
        disabled={
          isLocked || (searchCategoriesDraft.length === 0 && !searchTitleDraft && !searchNameDraft)
        }
        size="small"
      >
        {t('productSearchButton')}
      </MuiButton>
      <MuiButton
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={onReset}
        disabled={isLocked}
        size="small"
      >
        {t('productSearchReset')}
      </MuiButton>
    </Box>
  );
}
