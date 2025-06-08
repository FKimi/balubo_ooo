import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // プライマリカラー（青系）
        "primary-blue": "#2563EB",
        "primary-light-blue": "#3B82F6",
        
        // アクセントカラー（濃い青）
        "accent-dark-blue": "#1E3A8A",
        
        // ベースカラー（グレー系）
        "base-light-gray": "#F8FAFC",
        "base-dark-gray": "#1E293B",
        
        // テキストカラー
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        "text-tertiary": "#94A3B8",
        
        // UIコンポーネントカラー
        "ui-background-gray": "#F1F5F9",
        "border-color": "#E2E8F0",
        
        // システムカラー
        "success-green": "#10B981",
        "warning-yellow": "#F59E0B",
        "error-red": "#EF4444",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // カスタムユーティリティプラグイン
    function ({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
};

export default config;