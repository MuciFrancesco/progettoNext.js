'use client';

import LayersIcon from '@mui/icons-material/Layers';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

type UpdateProductBulkActionsProps = {
  readonly locale: Locale;
  readonly isLocked: boolean;
  readonly selectedCount: number;
  readonly onOpenBulkEdit: () => void;
  readonly onOpenBulkDelete: () => void;
};

export function UpdateProductBulkActions({
  locale,
  isLocked,
  selectedCount,
  onOpenBulkEdit,
  onOpenBulkDelete,
}: Readonly<UpdateProductBulkActionsProps>) {
  const t = createTranslator(locale);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <MuiButton
        variant="contained"
        className="btn-add"
        startIcon={<LayersIcon />}
        onClick={onOpenBulkEdit}
        disabled={isLocked || selectedCount < 2}
      >
        {t('productBulkEditButton').replace('{count}', String(selectedCount))}
      </MuiButton>
      <MuiButton
        variant="contained"
        color="error"
        startIcon={<DeleteSweepIcon />}
        onClick={onOpenBulkDelete}
        disabled={isLocked || selectedCount < 2}
      >
        {t('productBulkDeleteButton').replace('{count}', String(selectedCount))}
      </MuiButton>
    </Box>
  );
}
