import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'streak' | 'success' | 'warning' | 'info' | 'purple' | 'outline';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  icon,
  children,
  ...props
}) => {
  return (
    <span className={cn('ui-badge', `ui-badge--${variant}`, className)} {...props}>
      {icon && <span className="ui-badge-icon">{icon}</span>}
      {children && <span className="ui-badge-text">{children}</span>}
    </span>
  );
};
