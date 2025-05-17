/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors, // Asegura que los colores predeterminados estén disponibles
        primary: "#4F46E5",       // Tu color primario
        secondary: "#10B981",     // Tu color secundario
        background: "#F3F4F6",    // Color de fondo
        accent: "#EF4444"         // Color de acento
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans], // Usando Roboto y luego las fuentes predeterminadas
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out', // Animación personalizada
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [],
}

