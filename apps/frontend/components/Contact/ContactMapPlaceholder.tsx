import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MapIcon from '@mui/icons-material/Map';

interface ContactMapPlaceholderProps {
  address: string;
  caption: string;
}

export function ContactMapPlaceholder({ address, caption }: ContactMapPlaceholderProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        height: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
      }}
    >
      <Box sx={{ color: 'text.disabled', mb: 1 }}>
        <MapIcon sx={{ fontSize: 48 }} />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {address}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {caption}
      </Typography>
    </Paper>
  );
}
