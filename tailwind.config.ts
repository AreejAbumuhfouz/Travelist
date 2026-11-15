import type { Config } from 'tailwindcss';

const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1200px' } },
    extend: {
      colors: {
        bg: withAlpha('--bg'),
        surface: withAlpha('--surface'),
        'surface-2': withAlpha('--surface-2'),
        ink: withAlpha('--ink'),
        muted: withAlpha('--muted'),
        line: withAlpha('--line'),
        heading: withAlpha('--heading'),
        navy: '#183153',
        'navy-deep': '#0E1F36',
        orange: '#F08335',
        'orange-ink': withAlpha('--orange-ink'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem' },
      boxShadow: { card: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(14 31 54 / 0.18)' },
    },
  },
  plugins: [],
};
export default config;
