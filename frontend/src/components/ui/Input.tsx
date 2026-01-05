import React from 'react';
import { theme } from '@/lib/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-wrapper ${fullWidth ? 'full-width' : ''}`}>
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'error' : ''} ${className}`} {...props} />
      {error && <span className="error-text">{error}</span>}
      {!error && helperText && <span className="helper-text">{helperText}</span>}

      <style jsx>{`
        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing[2]};
        }

        .full-width {
          width: 100%;
        }

        .label {
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.sm};
          font-weight: ${theme.typography.fontWeight.medium};
          color: ${theme.colors.text.secondary};
        }

        .input {
          padding: ${theme.spacing[3]} ${theme.spacing[4]};
          background-color: ${theme.colors.background.tertiary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border.light};
          border-radius: ${theme.borderRadius.md};
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.base};
          transition: all ${theme.transitions.normal};
          outline: none;
        }

        .input::placeholder {
          color: ${theme.colors.text.muted};
        }

        .input:hover {
          border-color: ${theme.colors.text.tertiary};
        }

        .input:focus {
          border-color: ${theme.colors.brand.primary};
          box-shadow: 0 0 0 2px rgba(251, 219, 81, 0.2);
        }

        .input.error {
          border-color: ${theme.colors.state.error};
        }

        .input.error:focus {
          box-shadow: 0 0 0 2px rgba(229, 47, 40, 0.2);
        }

        .error-text {
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.xs};
          color: ${theme.colors.state.error};
        }

        .helper-text {
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.xs};
          color: ${theme.colors.text.muted};
        }
      `}</style>
    </div>
  );
};
