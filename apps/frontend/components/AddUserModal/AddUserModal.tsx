'use client';

import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MuiButton from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

export type AddUserModalProps = {
  readonly locale: Locale;
  readonly isOpen: boolean;
  readonly formEmail: string;
  readonly formPassword: string;
  readonly formFirstName: string;
  readonly formLastName: string;
  readonly formIsAdmin: boolean;
  readonly isAddPending: boolean;
  readonly addUserError: string | null;
  readonly addUserSuccess: string | null;
  readonly onClose: () => void;
  readonly onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  readonly onEmailChange: (value: string) => void;
  readonly onPasswordChange: (value: string) => void;
  readonly onFirstNameChange: (value: string) => void;
  readonly onLastNameChange: (value: string) => void;
  readonly onIsAdminChange: (value: boolean) => void;
};

export function AddUserModal({
  locale,
  isOpen,
  formEmail,
  formPassword,
  formFirstName,
  formLastName,
  formIsAdmin,
  isAddPending,
  addUserError,
  addUserSuccess,
  onClose,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onIsAdminChange,
}: AddUserModalProps) {
  const t = createTranslator(locale);

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="new-user-modal-title"
    >
      <DialogTitle
        id="new-user-modal-title"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {t('newUserModalTitle')}
        <IconButton size="small" aria-label={t('newUserCancel')} onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            type="email"
            required
            autoComplete="off"
            label={`${t('newUserFieldEmail')} *`}
            value={formEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            fullWidth
          />

          <TextField
            type="password"
            required
            autoComplete="new-password"
            label={`${t('newUserFieldPassword')} *`}
            value={formPassword}
            onChange={(e) => onPasswordChange(e.target.value)}
            fullWidth
            helperText={t('newUserPasswordHint')}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <TextField
              type="text"
              autoComplete="off"
              label={t('newUserFieldFirstName')}
              value={formFirstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 50 } }}
              fullWidth
            />
            <TextField
              type="text"
              autoComplete="off"
              label={t('newUserFieldLastName')}
              value={formLastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 50 } }}
              fullWidth
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={formIsAdmin}
                onChange={(e) => onIsAdminChange(e.target.checked)}
                color="primary"
              />
            }
            label={t('newUserFieldIsAdmin')}
          />

          {addUserError && <Alert severity="error">{addUserError}</Alert>}
          {addUserSuccess && <Alert severity="success">{addUserSuccess}</Alert>}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <MuiButton type="button" variant="outlined" onClick={onClose}>
            {t('newUserCancel')}
          </MuiButton>
          <MuiButton type="submit" variant="contained" className="btn-add" disabled={isAddPending}>
            {isAddPending ? '...' : t('newUserSubmit')}
          </MuiButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
