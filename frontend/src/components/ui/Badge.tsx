import React from 'react';
import { theme } from '@/lib/theme';

export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => {
  return (
    <span className={`badge ${variant} ${size} ${className}`}>
      {children}
      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: ${theme.borderRadius.sm};
          font-family: ${theme.typography.fontFamily.primary};
          font-weight: ${theme.typography.fontWeight.semibold};
          white-space: nowrap;
        }

        /* Sizes */
        .sm {
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.xs};
        }

        .md {
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.sm};
        }

        .lg {
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.base};
        }

        /* Variants */
        .default {
          background-color: #5da1b0;
          color: ${theme.colors.text.primary};
        }

        .success {
          background-color: ${theme.colors.state.success};
          color: ${theme.colors.text.primary};
        }

        .error {
          background-color: ${theme.colors.state.error};
          color: ${theme.colors.text.primary};
        }

        .warning {
          background-color: ${theme.colors.state.warning};
          color: ${theme.colors.text.onPrimary};
        }

        .info {
          background-color: ${theme.colors.state.info};
          color: ${theme.colors.text.primary};
        }
      `}</style>
    </span>
  );
};
