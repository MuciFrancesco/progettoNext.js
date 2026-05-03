'use client';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface CategoryMultiSelectProps {
  readonly label: string;
  readonly options: SelectOption[];
  readonly selected: string[];
  readonly onChange: (selected: string[]) => void;
  readonly disabled?: boolean;
  readonly size?: 'small' | 'medium';
  readonly fullWidth?: boolean;
}

export function CategoryMultiSelect({
  label,
  options,
  selected,
  onChange,
  disabled = false,
  size = 'small',
  fullWidth = true,
}: CategoryMultiSelectProps) {
  const labelId = `category-multi-select-${label.replaceAll(/\s+/g, '-').toLowerCase()}`;

  return (
    <FormControl size={size} fullWidth={fullWidth} disabled={disabled}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        multiple
        value={selected}
        onChange={(e) => {
          const val = e.target.value;
          onChange(typeof val === 'string' ? val.split(',') : val);
        }}
        input={<OutlinedInput label={label} />}
        renderValue={(selectedValues) =>
          selectedValues.map((v) => options.find((o) => o.value === v)?.label ?? v).join(', ')
        }
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Checkbox checked={selected.includes(opt.value)} size="small" />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
