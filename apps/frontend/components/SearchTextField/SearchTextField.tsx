'use client';

import TextField from '@mui/material/TextField';

export interface SearchTextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly size?: 'small' | 'medium';
  readonly fullWidth?: boolean;
  readonly onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function SearchTextField({
  label,
  value,
  onChange,
  disabled = false,
  size = 'small',
  fullWidth = true,
  onKeyDown,
}: SearchTextFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
      onKeyDown={onKeyDown}
    />
  );
}
