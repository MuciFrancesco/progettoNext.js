import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

type BadgeProps = {
  readonly variant?: BadgeVariant;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly [key: string]: unknown;
};

const VARIANT_MAP: Record<
  BadgeVariant,
  { color: ChipProps['color']; variant: ChipProps['variant'] }
> = {
  default: { color: 'primary', variant: 'filled' },
  secondary: { color: 'default', variant: 'filled' },
  destructive: { color: 'error', variant: 'filled' },
  outline: { color: 'default', variant: 'outlined' },
  ghost: { color: 'default', variant: 'filled' },
  link: { color: 'primary', variant: 'filled' },
};

function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const { color, variant: chipVariant } = VARIANT_MAP[variant] ?? VARIANT_MAP.default;
  return (
    <Chip
      label={children}
      color={color}
      variant={chipVariant}
      size="small"
      className={className}
      {...(props as Partial<ChipProps>)}
    />
  );
}

/** @deprecated Use MUI Chip directly. */
function badgeVariants(): string {
  return '';
}

export { Badge, badgeVariants };
