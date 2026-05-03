import Alert from '@mui/material/Alert';

type PopUpType = 'error' | 'success' | 'warning';

type PopupProps = {
  readonly message: string;
  readonly type?: PopUpType;
};

function Popup({ message, type = 'warning' }: Readonly<PopupProps>) {
  return (
    <Alert severity={type} variant="standard" data-testid="auth-server-error" role="alert">
      {message}
    </Alert>
  );
}

export default Popup;
