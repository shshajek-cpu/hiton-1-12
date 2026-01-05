import React from 'react';
import { theme } from '@/lib/theme';

type SpacingKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20';

export interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 'auto';
  gap?: SpacingKey;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 'auto',
  gap = '4',
  className = '',
}) => {
  const gridTemplateColumns = {
    1: 'repeat(1, minmax(0, 1fr))',
    2: 'repeat(2, minmax(0, 1fr))',
    3: 'repeat(3, minmax(0, 1fr))',
    4: 'repeat(4, minmax(0, 1fr))',
    auto: 'repeat(auto-fill, minmax(250px, 1fr))',
  };

  return (
    <div className={`grid ${className}`}>
      {children}
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: ${gridTemplateColumns[columns]};
          gap: ${theme.spacing[gap as unknown as keyof typeof theme.spacing]};
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};
