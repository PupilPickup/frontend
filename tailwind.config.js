const { text } = require('stream/consumers')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3498DB",
        secondary: "#27AE60",
        accent: "#F4D03F",
        neutral: "#2C3E50",
        background: "#FFFFFF",
        warning: "#F39C12",
        error: "#E74C3C",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        heading: ["Montserrat", "serif"],
      },
      spacing: {
        18: "4.5rem",
        72: "18rem",
      },
      label: {
        fontSize: "1rem",
        fontWeight: "600",
        marginBottom: "1rem",
        display: "block",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".btn": {
          padding: "0.5rem 1rem",
          borderRadius: "0.25rem",
          cursor: "pointer",
          transition: "background-color 0.3s, transform 0.3s",
        },
        ".btn-primary": {
          backgroundColor: "#3498DB",
          color: "#FFFFFF",
          border: "none",
        },
        ".btn-primary:hover": {
          backgroundColor: "#2980B9",
        },
        ".btn-secondary": {
          backgroundColor: "#FFFFFF",
          color: "#2980B9",
          border: "1px solid #2980B9",
        },
        ".btn-secondary:hover": {
          backgroundColor: "#EAF2F8", // A very light blue background on hover
          color: "#2980B9", // Keep the text color the same
          borderColor: "#2980B9",
        },
        ".btn-accent": {
          backgroundColor: "#2C3E50",
          color: "#FFFFFF",
          border: "none",
        },
        ".btn-accent:hover": {
          backgroundColor: "#2C3E50",
        },
        ".input": {
          padding: "0.5rem",
          borderRadius: "0.25rem",
          border: "1px solid #D1D5DB",
        },
        ".input:focus": {
          borderColor: "#2C3E50",
          outline: "none",
        },
      })
    }
  ],
}

