/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}", // TypeScript files are included
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3498db",  // Mock primary color 
        secondary: "#2ecc71",
        accent: "#f39c12",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        heading: ["Montserrat", "serif"],
      },
      spacing: {
        18: "4.5rem",
        72: "18rem",
      },
    },
  },
  plugins: [],
}

