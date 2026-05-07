/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { base: '#0A0908', surface: '#111010', elevated: '#1A1917' },
        amber: { 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', neon: '#FFB800' },
        text: { warm: '#F5F0E8', muted: '#A89880' },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      borderRadius: { xl2: '20px', xl3: '28px' },
      backdropBlur: { xs: '4px', xl: '40px' },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.8s linear infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(217,119,6,0.2)' },
          '50%':      { boxShadow: '0 0 32px rgba(217,119,6,0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
