/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        'base-white': '#FFFFFF',
        'base-light-gray': '#F8F9FA',
        'ui-background-gray': '#F1F3F5',
        
        // Primary colors
        'primary-light-blue': '#74C0FC',
        'primary-blue': '#3DA9FC',
        'accent-dark-blue': '#1C7ED6',
        
        // Text colors
        'text-primary': '#212529',
        'text-secondary': '#495057',
        'text-tertiary': '#ADB5BD',
        
        // Border colors
        'border-color': '#DEE2E6',
        'border-focus': '#A5D8FF',
        
        // Status colors
        'error-red': '#FA5252',
        'success-green': '#40C057',
        'warning-yellow': '#FCC419',
        'info-blue': '#339AF0',
        
        // shadcn/ui compatible colors
        border: '#DEE2E6',
        input: '#DEE2E6',
        ring: '#1C7ED6',
        background: '#FFFFFF',
        foreground: '#212529',
        primary: {
          DEFAULT: '#1C7ED6',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F1F3F5',
          foreground: '#495057',
        },
        destructive: {
          DEFAULT: '#FA5252',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F8F9FA',
          foreground: '#495057',
        },
        accent: {
          DEFAULT: '#F1F3F5',
          foreground: '#212529',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#212529',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
    },
  },
  plugins: [],
}

