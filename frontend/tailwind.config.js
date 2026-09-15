/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vayal: {
          cream: '#FAF1D6',
          'cream-light': '#FBF3DD',
          'cream-card': '#FFFDF4',
          'cream-hover': '#F4E9C4',
          forest: '#001C12',
          'forest-2': '#073B27',
          'forest-light': '#0D4E35',
          'forest-dark': '#00120B',
          green: '#0E6B3E',
          'green-light': '#DCEBC8',
          'green-pastel': '#E6F3D6',
          'green-soft': '#EAF3DF',
          yellow: '#F3C85B',
          'yellow-light': '#FDF3D8',
          orange: '#E89032',
          red: '#D95C45',
          'red-light': '#FBECE8',
          text: '#10130F',
          muted: '#5C6257',
          'muted-light': '#8A9284',
        }
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Tamil', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'vayal-card': '0 4px 20px -2px rgba(0, 28, 18, 0.05)',
        'vayal-glow': '0 0 25px rgba(14, 107, 62, 0.25)',
        'vayal-subtle': '0 2px 10px rgba(0, 28, 18, 0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-ring': 'waveRing 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        waveRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
