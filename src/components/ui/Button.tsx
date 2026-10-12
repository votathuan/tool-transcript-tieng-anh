import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyle =
      'ui-button inline-flex items-center justify-center font-medium transition-all select-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyle,
          `ui-button--${variant}`,
          `ui-button--${size}`,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="ui-btn-spinner animate-spin" size={size === 'sm' ? 14 : 16} />
        ) : (
          leftIcon && <span className="ui-btn-icon-left">{leftIcon}</span>
        )}
        {children && <span className="ui-btn-text">{children}</span>}
        {!isLoading && rightIcon && <span className="ui-btn-icon-right">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
