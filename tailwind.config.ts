import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        char: '#0B0D10',
        stone: '#26282C',
        bone: '#EAEAEE',
        sand: '#F5F5F7',
        cedar: '#8EB6DC',
        brass: '#6E9AC4',
        moss: '#1C2B3A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui'],
      },
      maxWidth: {
        shell: '78rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        rise: 'rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
