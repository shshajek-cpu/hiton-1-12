import React from 'react';
import { theme } from '@/lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'filter' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  active?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  active = false,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button className={`button ${variant} ${size} ${className}`} disabled={disabled} {...props}>
      {children}
      <style jsx>{`
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: ${theme.spacing[2]};
          font-family: ${theme.typography.fontFamily.primary};
          font-weight: ${theme.typography.fontWeight.semibold};
          border: none;
          cursor: pointer;
          transition: all ${theme.transitions.normal};
          white-space: nowrap;
          user-select: none;
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button:not(:disabled):hover {
          transform: translateY(-2px);
        }

        .button:not(:disabled):active {
          transform: translateY(0);
        }

        /* Sizes */
        .sm {
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
          border-radius: ${theme.borderRadius.sm};
        }

        .md {
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.base};
          border-radius: ${theme.borderRadius.md};
        }

        .lg {
          padding: ${theme.spacing[4]} ${theme.spacing[8]};
          font-size: ${theme.typography.fontSize.lg};
          border-radius: ${theme.borderRadius.lg};
        }

        /* Variants */
        .primary {
          background-color: ${theme.colors.brand.primary};
          color: ${theme.colors.text.onPrimary};
        }

        .primary:not(:disabled):hover {
          background-color: ${theme.colors.brand.primary};
          opacity: 0.9;
          box-shadow: ${theme.shadows.md};
        }

        .secondary {
          background-color: ${theme.colors.brand.secondary};
          color: ${theme.colors.text.primary};
        }

        .secondary:not(:disabled):hover {
          background-color: ${theme.colors.brand.secondary};
          opacity: 0.9;
          box-shadow: ${theme.shadows.md};
        }

        .ghost {
          background-color: ${theme.colors.background.overlay};
          color: ${theme.colors.text.primary};
        }

        .ghost:not(:disabled):hover {
          background-color: ${theme.colors.background.hover};
        }

        .outline {
          background-color: transparent;
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border.light};
        }

        .outline:not(:disabled):hover {
          background-color: ${theme.colors.background.tertiary};
          border-color: ${theme.colors.text.tertiary};
        }

        .filter {
          background-color: ${active ? theme.colors.text.primary : theme.colors.background.tertiary};
          color: ${active ? theme.colors.text.onPrimary : theme.colors.text.primary};
          font-weight: ${active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
          border-radius: ${theme.borderRadius['2xl']};
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
        }

        .filter:not(:disabled):hover {
          background-color: ${active ? theme.colors.text.primary : theme.colors.background.hover};
        }

        .danger {
          background-color: ${theme.colors.state.error};
          color: ${theme.colors.text.primary};
        }

        .danger:not(:disabled):hover {
          background-color: ${theme.colors.state.error};
          opacity: 0.9;
          box-shadow: ${theme.shadows.md};
        }

        ${fullWidth ? '.button { width: 100%; }' : ''}
      `}</style>
    </button>
  );
};
