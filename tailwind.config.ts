import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          bg:        '#040D21',
          surface:   '#0A1628',
          card:      '#0F1F3D',
          border:    '#1E3A5F',
          blue:      '#2563EB',
          'blue-lt': '#3B82F6',
          gold:      '#F59E0B',
          'gold-lt': '#FCD34D',
          green:     '#10B981',
          red:       '#EF4444',
          orange:    '#F97316',
          text:      '#E2E8F0',
          muted:     '#64748B',
          subtle:    '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-blue':   'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)',
        'gradient-gold':   'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FCD34D 100%)',
        'gradient-dark':   'linear-gradient(180deg, #040D21 0%, #0A1628 100%)',
        'card-shine':      'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0) 60%)',
      },
      boxShadow: {
        card:    '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset',
        glow:    '0 0 24px rgba(37,99,235,0.3)',
        'glow-gold': '0 0 24px rgba(245,158,11,0.4)',
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'pulse-slow':   'pulse 3s infinite',
        'count-up':     'countUp 1s ease-out',
        'shimmer':      'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
