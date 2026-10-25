/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Figma Design System Palette
        ink: {
          50: '#F5F8F9',
          100: '#EAF0F2',
          200: '#D7E0E3',
          300: '#B5C2C7',
          500: '#6B8089',
          700: '#3A5560',
          900: '#15313C', // Main ink color
        },
        accent: {
          lime: '#CCEB74',   // Official lime accent
          light: '#F1FBD2',  // Official light lime tint
        },
        status: {
          success: '#2E9E6B',
          'success-tint': '#EAF5F0',
          warning: '#F2A93B',
          'warning-tint': '#FEF6EB',
          error: '#E5484D',
          'error-tint': '#FCEDED',
          info: '#2F7F9A',
        },
        // Fallback backward compatibility
        brand: {
          50: '#F1FBD2',
          100: '#EAF0F2',
          200: '#D7E0E3',
          300: '#B5C2C7',
          400: '#CCEB74',
          500: '#3A5560',
          600: '#15313C',
          700: '#112933',
          800: '#0D2128',
          900: '#15313C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px -1px rgba(21, 49, 60, 0.06), 0 1px 4px -1px rgba(21, 49, 60, 0.04)',
        'elevated': '0 20px 40px -10px rgba(21, 49, 60, 0.05)',
      },
      borderRadius: {
        'card': '1rem',
      }
    },
  },
  plugins: [],
}
