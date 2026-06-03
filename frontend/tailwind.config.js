/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warmSand: "#FDFBF7",
        warmSandSecondary: "#F3EFE9",
        terracotta: "#C85A4F",
        terracottaHover: "#D86B60",
        forestGreen: "#2A4736",
        forestGreenHover: "#365945",
        textPrimary: "#1A251F",
        textSecondary: "#4A5650",
        textMuted: "#8A948E",
      },
      fontFamily: {
        heading: ['Cabinet Grotesk', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};