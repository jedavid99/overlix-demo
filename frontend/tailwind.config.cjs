/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 🎨 Paleta de colores premium
      colors: {
        primary: {
          DEFAULT: '#0066FF',
          foreground: '#FFFFFF',
          hover: '#0052CC',
          active: '#003D99',
        },
        secondary: {
          DEFAULT: '#F4F4F5',
          foreground: '#18181B',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F4F4F5',
          foreground: '#71717A',
        },
        accent: {
          DEFAULT: '#F4F4F5',
          foreground: '#18181B',
        },
        background: {
          light: '#FAFAFA',
          dark: '#0A0A0A',
          DEFAULT: '#FAFAFA',
        },
        foreground: {
          DEFAULT: '#18181B',
          light: '#18181B',
          dark: '#FAFAFA',
        },
        'muted-foreground': {
          DEFAULT: '#71717A',
          light: '#71717A',
          dark: '#A1A1AA',
        },
        card: {
          light: '#FFFFFF',
          dark: '#1A1A1A',
          DEFAULT: '#FFFFFF',
        },
        border: {
          light: '#E4E4E7',
          dark: '#2A2A2A',
          DEFAULT: '#E4E4E7',
        },
        input: {
          light: '#E4E4E7',
          dark: '#2A2A2A',
          DEFAULT: '#E4E4E7',
        },
        ring: 'rgba(0,102,255,0.5)',
        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        info: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
      },
      // 🔤 Tipografía
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      // 🌗 Sombras multicapa (modo claro)
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.06)',
        'xl': '0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.06)',
      },
      // 🔘 Bordes redondeados
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        'full': '9999px',
      },
      // 📏 Espaciado (refuerzo de la grilla, pero tailwind ya incluye múltiplos de 4)
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem',
      },
      // ✨ Animaciones funcionales (solo las necesarias)
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-left': 'slide-in-left 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      // 📐 Transiciones globales
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
