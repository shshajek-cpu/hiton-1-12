import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { theme } from '@/lib/theme';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showClearButton?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onClear,
  loading = false,
  size = 'md',
  fullWidth = false,
  showClearButton = true,
  value: controlledValue,
  onChange,
  placeholder = '검색...',
  className = '',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(String(value));
    }
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
  };

  const showClear = showClearButton && value && !loading;

  return (
    <div className={`search-input-wrapper ${size} ${fullWidth ? 'full-width' : ''} ${className}`}>
      <div className="search-icon">
        <Search size={getSizeValue(size).icon} />
      </div>

      <input
        className="search-input"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        {...props}
      />

      {loading && (
        <div className="loading-icon">
          <Loader2 size={getSizeValue(size).icon} className="spinner" />
        </div>
      )}

      {showClear && (
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={getSizeValue(size).icon} />
        </button>
      )}

      <style jsx>{`
        .search-input-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          background-color: ${theme.colors.background.tertiary};
          border: 1px solid ${theme.colors.border.light};
          border-radius: ${theme.borderRadius.md};
          transition: all ${theme.transitions.normal};
        }

        .full-width {
          width: 100%;
          display: flex;
        }

        .search-input-wrapper:focus-within {
          border-color: ${theme.colors.brand.primary};
          box-shadow: 0 0 0 2px rgba(251, 219, 81, 0.2);
        }

        .search-input-wrapper:hover {
          border-color: ${theme.colors.text.tertiary};
        }

        .search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme.colors.text.muted};
          pointer-events: none;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: ${theme.colors.text.primary};
          font-family: ${theme.typography.fontFamily.primary};
        }

        .search-input::placeholder {
          color: ${theme.colors.text.muted};
        }

        .loading-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme.colors.brand.primary};
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: ${theme.colors.text.muted};
          transition: color ${theme.transitions.fast};
          padding: 0;
        }

        .clear-button:hover {
          color: ${theme.colors.text.primary};
        }

        /* Sizes */
        .sm {
          padding: ${theme.spacing[2]};
          gap: ${theme.spacing[2]};
        }

        .sm .search-input {
          font-size: ${theme.typography.fontSize.sm};
        }

        .md {
          padding: ${theme.spacing[3]};
          gap: ${theme.spacing[2]};
        }

        .md .search-input {
          font-size: ${theme.typography.fontSize.base};
        }

        .lg {
          padding: ${theme.spacing[4]};
          gap: ${theme.spacing[3]};
        }

        .lg .search-input {
          font-size: ${theme.typography.fontSize.lg};
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        :global(.spinner) {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

function getSizeValue(size: 'sm' | 'md' | 'lg') {
  const sizes = {
    sm: { icon: 16 },
    md: { icon: 20 },
    lg: { icon: 24 },
  };
  return sizes[size];
}
