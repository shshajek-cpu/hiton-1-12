import React from 'react';
import { theme } from '@/lib/theme';

export type CardVariant = 'default' | 'elevated' | 'flat';
type SpacingKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20';

export interface CardProps {
  variant?: CardVariant;
  padding?: SpacingKey;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = '4',
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const isClickable = !!onClick || hoverable;

  return (
    <div className={`card ${variant} ${className}`} onClick={onClick}>
      {children}
      <style jsx>{`
        .card {
          border-radius: ${theme.borderRadius.md};
          transition: all ${theme.transitions.normal};
          ${isClickable ? 'cursor: pointer;' : ''}
        }

        .default {
          background-color: ${theme.colors.background.card};
          padding: ${theme.spacing[padding as unknown as keyof typeof theme.spacing]};
          box-shadow: ${theme.shadows.default};
        }

        .elevated {
          background-color: ${theme.colors.background.secondary};
          padding: ${theme.spacing[padding as unknown as keyof typeof theme.spacing]};
          box-shadow: ${theme.shadows.lg};
        }

        .flat {
          background-color: ${theme.colors.background.tertiary};
          padding: ${theme.spacing[padding as unknown as keyof typeof theme.spacing]};
          box-shadow: none;
        }

        .card:hover {
          ${isClickable ? `transform: translateY(-4px); box-shadow: ${theme.shadows.xl};` : ''}
        }
      `}</style>
    </div>
  );
};
