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
        // 洗練されたプロフェッショナルカラーパレット
        // Base colors
        'base-white': '#FFFFFF',
        'base-light-gray': '#F8F9FA',
        'ui-background-gray': '#F1F3F5',

        // Primary colors - LinkedInスタイルカラー
        'linkedin-blue': '#0A66C2',    // LinkedIn公式カラー
        'linkedin-blue-light': '#0073B1', // LinkedInライトブルー
        'linkedin-blue-dark': '#004182',  // LinkedInダークブルー

        // Text colors - より洗練されたグレー
        'text-primary': '#1F2937',     // より濃いグレー
        'text-secondary': '#6B7280',   // 適度なコントラスト
        'text-tertiary': '#9CA3AF',    // 柔らかいグレー

        // Border colors
        'border-color': '#E5E7EB',     // 洗練されたボーダー
        'border-focus': '#3B82F6',     // 青系のフォーカス

        // Status colors
        'error-red': '#EF4444',
        'success-green': '#10B981',
        'warning-yellow': '#F59E0B',
        'info-blue': '#3B82F6',

        // shadcn/ui compatible colors - 洗練されたバージョン
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#0A66C2',
        background: '#FFFFFF',
        foreground: '#1F2937',
        primary: {
          DEFAULT: '#0A66C2',
          foreground: '#FFFFFF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#0A66C2',
          600: '#004182',
          700: '#004182',
          800: '#004182',
          900: '#004182',
        },
        secondary: {
          DEFAULT: '#F9FAFB',
          foreground: '#374151',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F9FAFB',
          foreground: '#6B7280',
        },
        accent: {
          DEFAULT: '#F9FAFB',
          foreground: '#1F2937',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // 洗練されたタイポグラフィスケール
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        // 洗練されたスペーシングスケール
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        // より洗練された角丸
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // 洗練されたシャドウ
        'elegant': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'elegant-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elegant-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'elegant-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'brand': '0 4px 14px 0 rgb(25 118 210 / 0.15)',
      },
      animation: {
        // 洗練されたアニメーション
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-up-bottom': 'slideUpBottom 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-elegant': 'pulseElegant 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'progress': 'progress 1.5s ease-in-out',
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
        slideUpBottom: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseElegant: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
}

