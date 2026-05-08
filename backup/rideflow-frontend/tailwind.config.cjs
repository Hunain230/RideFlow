/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premium warm palette
        'warm-white': '#FFFEF9',
        'soft-beige': '#F5F2ED',
        'ivory': '#FFFFF0',
        'champagne': '#F7E7CE',
        'soft-gold': '#E6D5B8',
        'cream': '#FFF8E7',
        
        // Glassmorphism colors
        'glass': {
          'white': 'rgba(255, 255, 255, 0.1)',
          'white-strong': 'rgba(255, 255, 255, 0.2)',
          'border': 'rgba(255, 255, 255, 0.18)',
          'shadow': 'rgba(31, 38, 135, 0.15)',
          'glow': 'rgba(255, 215, 0, 0.3)',
        },
        
        // Maintain existing colors for compatibility
        bg: { base: '#FFFEF9', surface: '#F5F2ED', elevated: '#FFFFF0' },
        amber: { 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', neon: '#FFB800' },
        text: { 
          warm: '#2C1810', 
          muted: '#8B7355',
          secondary: '#6B5D54',
          primary: '#1A1512'
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      borderRadius: { xl2: '20px', xl3: '28px', xl4: '32px' },
      backdropBlur: { xs: '4px', xl: '40px', '2xl': '60px' },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.8s linear infinite',
        'float':      'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPlow 3s ease-in-out infinite',
        'magnetic': 'magnetic 0.3s ease-out',
        'parallax': 'parallax 20s linear infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(255, 215, 0, 0.2)' },
          '50%':      { boxShadow: '0 0 32px rgba(255, 215, 0, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-12px) rotate(2deg)' },
        },
        glowPlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)' 
          },
        },
        magnetic: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        parallax: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(-10px) translateY(-5px)' },
          '50%': { transform: 'translateX(5px) translateY(-10px)' },
          '75%': { transform: 'translateX(-5px) translateY(-5px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.2)',
        'glass-xl': '0 24px 96px 0 rgba(31, 38, 135, 0.25)',
        'glow': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 215, 0, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(255, 215, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-reverse': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
