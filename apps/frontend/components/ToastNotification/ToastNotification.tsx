'use client';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export interface ToastMessage {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface ToastNotificationProps {
  readonly toast: ToastMessage | null;
  readonly onClose: () => void;
  readonly autoHideDuration?: number;
  readonly anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

export function ToastNotification({
  toast,
  onClose,
  autoHideDuration = 4000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
}: ToastNotificationProps) {
  return (
    <Snackbar
      open={Boolean(toast)}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      {toast ? (
        <Alert onClose={onClose} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
