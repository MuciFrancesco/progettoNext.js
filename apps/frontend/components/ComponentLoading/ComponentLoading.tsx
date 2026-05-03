import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

type ComponentLoadingProps = {
  readonly label: string;
};

export function ComponentLoading({ label }: Readonly<ComponentLoadingProps>) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'var(--border)',
        bgcolor: 'rgba(0,0,0,0.03)',
        px: 1.5,
        py: 1,
      }}
    >
      <CircularProgress size={16} thickness={5} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}
