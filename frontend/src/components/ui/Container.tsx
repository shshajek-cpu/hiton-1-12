import React from 'react';
import { theme } from '@/lib/theme';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = true,
  className = '',
}) => {
  const maxWidthValues = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    full: '100%',
  };

  return (
    <div className={`container ${className}`}>
      {children}
      <style jsx>{`
        .container {
          width: 100%;
          max-width: ${maxWidthValues[maxWidth]};
          margin: 0 auto;
          ${padding ? `padding: 0 ${theme.spacing[4]};` : ''}
        }

        @media (min-width: 768px) {
          .container {
            ${padding ? `padding: 0 ${theme.spacing[6]};` : ''}
          }
        }
      `}</style>
    </div>
  );
};
