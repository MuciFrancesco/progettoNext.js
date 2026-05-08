'use client';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type LogoutConfirmDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly message: string;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  readonly isPending: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
};

export function LogoutConfirmDialog({
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  isPending,
  onCancel,
  onConfirm,
}: Readonly<LogoutConfirmDialogProps>) {
  return (
    <Dialog open={open} onClose={isPending ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isPending}>
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
