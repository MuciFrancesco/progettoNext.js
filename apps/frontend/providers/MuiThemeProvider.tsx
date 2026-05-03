'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    primary: { main: '#0b3c5d', contrastText: '#ffffff' },
    secondary: { main: '#e8f0f8', contrastText: '#0b3c5d' },
    error: { main: '#c0392b' },
    warning: { main: '#d9b310' },
    background: { default: '#f4f7f9', paper: '#ffffff' },
    text: { primary: '#0d1b2a', secondary: '#4a7a9b' },
    divider: '#c1d5e8',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    fontSize: 14,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.MuiButton-containedPrimary': {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            '&:hover': { backgroundColor: 'var(--primary)', filter: 'brightness(88%)' },
            '&.Mui-disabled': { opacity: 0.5 },
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
            backgroundColor: 'var(--background)',
            '&:hover': { backgroundColor: 'var(--muted)', borderColor: 'var(--border)' },
          },
          '&.MuiButton-textPrimary': {
            color: 'var(--foreground)',
            '&:hover': { backgroundColor: 'var(--muted)' },
          },
          // Variante "add" — blu navy scuro: aggiunta nuova risorsa
          '&.btn-add': {
            backgroundColor: '#0D47A1',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#1565C0' },
            '&.Mui-disabled': { opacity: 0.5 },
          },
          // Variante "edit" — blu medio-scuro: modifica singola
          '&.btn-edit': {
            backgroundColor: '#1565C0',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#0D47A1' },
            '&.Mui-disabled': { opacity: 0.5 },
          },
          // Variante "bulk" — blu chiaro: azione su selezione multipla
          '&.btn-bulk': {
            backgroundColor: '#1E88E5',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#1565C0' },
            '&.Mui-disabled': { opacity: 0.5 },
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true, variant: 'outlined' as const },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--ring)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary)',
            borderWidth: 2,
          },
          '&.Mui-disabled': { backgroundColor: 'var(--muted)' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--muted-foreground)',
          '&.Mui-focused': { color: 'var(--primary)' },
        },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' as const },
      styleOverrides: {
        root: {
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.8125rem',
          '&.MuiChip-filledPrimary': {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            '&:hover': { backgroundColor: 'var(--primary)', filter: 'brightness(88%)' },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontSize: '0.875rem', padding: '8px 16px' },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: { border: '1px solid var(--border)', borderRadius: 12, boxShadow: 'none' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgb(from var(--primary) r g b / 0.08)',
            color: 'var(--foreground)',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderBottomWidth: 2,
            borderBottomColor: 'var(--border)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          fontSize: '0.875rem',
          padding: '12px 16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 150ms',
          '&:hover': { backgroundColor: 'var(--muted)', opacity: 1 },
          '&:last-child td, &:last-child th': { border: 0 },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: 'var(--foreground)',
          fontWeight: 600,
          fontSize: '1.1rem',
          padding: '16px 24px 8px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: '8px 24px 16px' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: '8px 24px 16px', gap: 8 } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: 'var(--border)' } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'var(--muted-foreground)',
          '&:hover': { backgroundColor: 'var(--muted)', color: 'var(--foreground)' },
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
