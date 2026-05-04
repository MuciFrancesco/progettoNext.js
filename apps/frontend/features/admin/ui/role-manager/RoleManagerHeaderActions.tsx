'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

type RoleManagerHeaderActionsProps = {
  readonly locale: Locale;
  readonly isPending: boolean;
  readonly selectedCount: number;
  readonly changedCount: number;
  readonly onDeleteSelected: () => void;
  readonly onRequestSaveAll: () => void;
  readonly onOpenAddModal: () => void;
};

export function RoleManagerHeaderActions({
  locale,
  isPending,
  selectedCount,
  changedCount,
  onDeleteSelected,
  onRequestSaveAll,
  onOpenAddModal,
}: Readonly<RoleManagerHeaderActionsProps>) {
  const t = createTranslator(locale);

  return (
    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
      {selectedCount >= 2 ? (
        <MuiButton
          variant="outlined"
          color="error"
          disabled={isPending}
          onClick={onDeleteSelected}
          startIcon={<DeleteIcon />}
          size="small"
        >
          {t('roleManagerDeleteSelected').replace('{count}', String(selectedCount))}
        </MuiButton>
      ) : null}
      <MuiButton
        variant="outlined"
        sx={{
          borderColor: '#4CAF50',
          color: '#4CAF50',
          '&:hover': { borderColor: '#388E3C', color: '#388E3C' },
        }}
        disabled={changedCount < 2 || isPending}
        onClick={onRequestSaveAll}
        startIcon={<DoneAllIcon />}
        size="small"
      >
        {t('roleManagerSaveAll').replace('{count}', String(changedCount))}
      </MuiButton>
      <MuiButton
        variant="contained"
        className="btn-add"
        onClick={onOpenAddModal}
        startIcon={<PersonAddIcon />}
        size="small"
      >
        {t('newUserButton')}
      </MuiButton>
    </Box>
  );
}
