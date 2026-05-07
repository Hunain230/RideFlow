import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'gradient-border' | 'neon' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeStyles = {
      sm: 'text-sm px-3 py-1.5 rounded-radius-sm',
      md: 'text-base px-5 py-2.5 rounded-radius-md',
      lg: 'text-lg px-6 py-3 rounded-radius-lg',
    };

    const variantStyles = {
      primary: 'bg-amber-600 text-bg-base hover:scale-[1.02] hover:shadow-glow active:scale-95',
      glass: 'bg-glass-bg-light border border-glass-border backdrop-blur-[20px] text-text-primary hover:border-glass-border-accent active:scale-95',
      'gradient-border': 'bg-transparent text-amber-500 border-2 border-transparent bg-clip-padding relative before:absolute before:inset-0 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-amber-400 before:to-[#C2410C] before:-z-10',
      neon: 'bg-amber-400 text-bg-base shadow-[0_0_12px_rgba(255,184,0,0.6)] hover:shadow-[0_0_24px_rgba(255,184,0,0.8)] active:scale-95',
      icon: 'w-10 h-10 p-0 rounded-radius-full bg-glass-bg-light border border-glass-border hover:scale-110 hover:border-glass-border-accent text-text-primary flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variant !== 'icon' && sizeStyles[size], variantStyles[variant], className))}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span className={clsx(loading && 'opacity-70')}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
