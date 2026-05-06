import { ButtonHTMLAttributes } from 'react'
import { ButtonVariant } from '@/lib/types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md'
  fullWidth?: boolean
}

export default function Button({
  variant = 'gold',
  size = 'md',
  fullWidth = true,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    !fullWidth ? 'btn--auto' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
