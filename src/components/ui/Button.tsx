import React from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'glass' | 'gradient-border' | 'neon' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  glass: 'btn btn-glass',
  'gradient-border': 'btn btn-gradient-border',
  neon: 'btn btn-neon',
  icon: 'btn btn-icon',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'btn-full',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
