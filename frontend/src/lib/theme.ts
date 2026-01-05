/**
 * dak.gg 디자인 시스템 테마
 *
 * 모든 컴포넌트에서 일관된 디자인을 사용하기 위한 중앙화된 테마 설정
 */

export const theme = {
  colors: {
    brand: {
      primary: '#fbdb51',
      secondary: '#ff4655',
    },
    background: {
      primary: '#161618',
      secondary: '#212227',
      tertiary: '#27282e',
      card: '#1b1b1e',
      hover: '#323232',
      overlay: 'rgba(0, 0, 0, 0.7)',
      transparent: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cfd1d7',
      tertiary: '#a5a8b4',
      muted: '#848999',
      disabled: '#999999',
      onPrimary: '#000000',
    },
    border: {
      default: '#e5e9ec',
      light: 'rgba(255, 255, 255, 0.1)',
      dark: '#c5ced6',
    },
    state: {
      success: '#56c288',
      error: '#e52f28',
      warning: '#ffc555',
      info: '#1292ee',
    },
  },

  typography: {
    fontFamily: {
      primary: 'Pretendard, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
  },

  borderRadius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '60px',
    full: '100px',
  },

  shadows: {
    none: 'none',
    sm: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
    default: 'rgba(0, 0, 0, 0.1) 0px 4px 7px 0px',
    md: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
    lg: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 5px 30px 0px, rgba(0, 0, 0, 0.05) 0px 3px 3px 0px',
    xl: 'rgba(0, 0, 0, 0.25) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
  },

  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Theme = typeof theme;
