'use client';

import MuiButton from '@mui/material/Button';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type { MouseEventHandler, ReactNode } from 'react';

type LegacyVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
type LegacySize = 'default' | 'sm' | 'lg' | 'xs' | 'icon' | 'icon-sm' | 'icon-lg';

export type ButtonProps = {
  readonly variant?: LegacyVariant;
  readonly size?: LegacySize;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onClick?: MouseEventHandler;
  readonly children?: ReactNode;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly [key: string]: unknown;
};

const VARIANT_MAP: Record<
  LegacyVariant,
  { variant: MuiButtonProps['variant']; color?: MuiButtonProps['color'] }
> = {
  default: { variant: 'contained', color: 'primary' },
  outline: { variant: 'outlined', color: 'primary' },
  secondary: { variant: 'contained', color: 'secondary' },
  ghost: { variant: 'text', color: 'primary' },
  destructive: { variant: 'contained', color: 'error' },
  link: { variant: 'text', color: 'primary' },
};

const SIZE_MAP: Record<LegacySize, MuiButtonProps['size']> = {
  default: 'medium',
  sm: 'small',
  lg: 'large',
  xs: 'small',
  icon: 'medium',
  'icon-sm': 'small',
  'icon-lg': 'large',
};

export function Button({
  variant = 'default',
  size = 'default',
  className,
  disabled,
  onClick,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const { variant: muiVariant, color } = VARIANT_MAP[variant] ?? VARIANT_MAP.default;
  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      size={SIZE_MAP[size] ?? 'medium'}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      disableElevation
      {...rest}
    >
      {children}
    </MuiButton>
  );
}

/** @deprecated Use <Button> or MUI Button directly. */
export function buttonVariants(): string {
  return '';
}
