/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  warmSand: "#FAF7FF",
  warmSandSecondary: "#F3EEFC",

  terracotta: "#D4AF37",
  terracottaHover: "#E6C65C",

  forestGreen: "#5B2C83",
  forestGreenHover: "#6C3DA0",

  textPrimary: "#2E1A47",
  textSecondary: "#5F4B7A",
  textMuted: "#8B7BA8",
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
