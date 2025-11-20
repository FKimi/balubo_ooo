/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Unified Design Rules 2025
        // Base colors
        'base-white': '#FFFFFF',
        'base-soft-blue': '#F4F7FF', // Section background (with cards)
        
        // Primary colors
        'primary-blue': '#007AFF',    // Main CTA
        'primary-blue-hover': '#0062CC',

        // Text colors
        'text-primary': '#111111',     // Headings
        'text-secondary': '#333333',   // Body
        'text-tertiary': '#666666',    // Muted

        // Border colors
        'border-color': '#E5E7EB',
        
        // shadcn/ui compatible colors
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#007AFF',
        background: '#FFFFFF',
        foreground: '#111111',
        primary: {
          DEFAULT: '#007AFF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F4F7FF',
          foreground: '#333333',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F4F7FF',
          foreground: '#666666',
        },
        accent: {
          DEFAULT: '#F4F7FF',
          foreground: '#111111',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#111111',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111111',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1.5rem', // 24px
        '3xl': '2rem',   // 32px
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 18px 45px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 20px 50px rgba(37, 99, 235, 0.15)',
        'soft-xl': '0 25px 60px rgba(37, 99, 235, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

