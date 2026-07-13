/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./demo-*/*.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Dracula base mapped to CSS variables
        drac: {
          bg: 'rgba(var(--drac-bg), <alpha-value>)',
          darker: 'rgba(var(--drac-darker), <alpha-value>)',
          current: 'rgba(var(--drac-current), <alpha-value>)',
          fg: 'rgba(var(--drac-fg), <alpha-value>)',
          comment: 'rgba(var(--drac-comment), <alpha-value>)',
          cyan: 'rgba(var(--drac-cyan), <alpha-value>)',
          green: 'rgba(var(--drac-green), <alpha-value>)',
          orange: 'rgba(var(--drac-orange), <alpha-value>)',
          pink: 'rgba(var(--drac-pink), <alpha-value>)',
          purple: 'rgba(var(--drac-purple), <alpha-value>)',
          red: 'rgba(var(--drac-red), <alpha-value>)',
          yellow: 'rgba(var(--drac-yellow), <alpha-value>)',
        },
        // Chilean flag
        chile: {
          red: '#D52B1E',
          redDark: '#B02218',
          blue: '#0039A6',
          blueDark: '#002D85',
          blueLight: '#1A5FCE',
          white: '#FFFFFF',
        },
        // Demo themes & palette extensions
        slate: {
          950: '#0B0F19',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          400: '#94A3B8',
          300: '#CBD5E1',
        },
        brand: {
          accent: '#38BDF8',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          purple: '#8B5CF6',
          prop: '#D97706',
          psi: '#65A30D',
          salon: '#DB2777',
          conta: '#1E40AF',
        },
        forest: {
          50: '#F4F7F5',
          100: '#E8EDE9',
          600: '#4A6B5D',
          700: '#3D584C',
          900: '#23332C',
        },
        coral: {
          50: '#FDF7F4',
          100: '#FCECE6',
          500: '#E8A382',
          600: '#D58661',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F4EFEB',
          200: '#EADFD7',
        },
        sage: {
          50: '#f4f7f6',
          100: '#e6eeeb',
          200: '#cfe0db',
          300: '#a7c5bc',
          400: '#7fa499',
          500: '#5c8479',
          600: '#47695f',
          700: '#3c554e',
          800: '#334641',
          900: '#2b3a36',
        },
        sand: {
          50: '#faf8f5',
          100: '#f5efe6',
          200: '#ebdcc5',
          300: '#dec29f',
          400: '#cca374',
          500: '#bd8953',
          600: '#ae7544',
          700: '#915d38',
          800: '#754b30',
          900: '#603f2a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(0,57,166,0.15)',
        'glow-red': '0 0 60px rgba(213,43,30,0.12)',
        card: '0 8px 32px rgba(0,0,0,0.3)',
        'card-hover': '0 16px 48px rgba(0,57,166,0.2)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
        mega: '0 24px 80px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'gradient-move': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'gradient-move': 'gradient-move 6s ease infinite',
        'count-up': 'count-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
      }
    }
  }
};
