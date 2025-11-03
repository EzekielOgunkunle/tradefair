/**
 * TradeFair Design System
 * 
 * Defines the brand identity, colors, typography, spacing, and component variants
 * for the TradeFair marketplace platform.
 */

export const designSystem = {
  // Brand Colors - Modern marketplace with trust and energy
  colors: {
    primary: {
      DEFAULT: '#0066FF', // Vibrant blue - trust and technology
      50: '#E6F0FF',
      100: '#CCE0FF',
      200: '#99C2FF',
      300: '#66A3FF',
      400: '#3385FF',
      500: '#0066FF',
      600: '#0052CC',
      700: '#003D99',
      800: '#002966',
      900: '#001433',
    },
    secondary: {
      DEFAULT: '#FF6B35', // Energetic orange - marketplace activity
      50: '#FFF3EF',
      100: '#FFE7DF',
      200: '#FFCFBF',
      300: '#FFB79F',
      400: '#FF9F7F',
      500: '#FF6B35',
      600: '#E64D1A',
      700: '#B33C14',
      800: '#802B0F',
      900: '#4D1A09',
    },
    accent: {
      DEFAULT: '#00D9A3', // Fresh mint - success and growth
      50: '#E6FFF8',
      100: '#CCFFF1',
      200: '#99FFE3',
      300: '#66FFD5',
      400: '#33FFC7',
      500: '#00D9A3',
      600: '#00B386',
      700: '#008C69',
      800: '#00664C',
      900: '#004030',
    },
    neutral: {
      50: '#F8F9FA',
      100: '#F1F3F5',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#868E96',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    },
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: 'var(--font-inter), system-ui, sans-serif',
      display: 'var(--font-cal-sans), system-ui, sans-serif',
      mono: 'var(--font-geist-mono), monospace',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // Spacing Scale (extends Tailwind defaults)
  spacing: {
    xs: '0.5rem', // 8px
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem', // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgb(0 102 255 / 0.3)',
    'glow-accent': '0 0 20px rgb(0 217 163 / 0.3)',
  },

  // Animation Timings
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
      slower: 700,
    },
    easing: {
      default: [0.4, 0.0, 0.2, 1],
      in: [0.4, 0.0, 1, 1],
      out: [0.0, 0.0, 0.2, 1],
      inOut: [0.4, 0.0, 0.2, 1],
      bounce: [0.68, -0.55, 0.265, 1.55],
    },
  },

  // Component Variants
  components: {
    button: {
      variants: {
        primary: {
          bg: 'primary-500',
          hover: 'primary-600',
          text: 'white',
          shadow: 'md',
        },
        secondary: {
          bg: 'secondary-500',
          hover: 'secondary-600',
          text: 'white',
          shadow: 'md',
        },
        outline: {
          border: 'primary-500',
          hover: 'primary-50',
          text: 'primary-500',
        },
        ghost: {
          hover: 'neutral-100',
          text: 'neutral-700',
        },
      },
      sizes: {
        sm: { padding: 'py-1.5 px-3', text: 'text-sm' },
        md: { padding: 'py-2 px-4', text: 'text-base' },
        lg: { padding: 'py-3 px-6', text: 'text-lg' },
      },
    },
    card: {
      variants: {
        default: {
          bg: 'white',
          border: 'neutral-200',
          shadow: 'DEFAULT',
          hover: 'shadow-lg',
        },
        elevated: {
          bg: 'white',
          shadow: 'lg',
          hover: 'shadow-xl',
        },
        outlined: {
          bg: 'white',
          border: 'primary-200',
          hover: 'border-primary-400',
        },
      },
    },
  },

  // Breakpoints (Tailwind defaults)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignSystem = typeof designSystem;
