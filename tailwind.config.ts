import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#F1F7F1",
          100: "#DCEBDC",
          200: "#B8D6B8",
          300: "#8FBE8F",
          400: "#5FA15F",
          500: "#3D8B40",
          600: "#2F6F32",
          700: "#235425",
          800: "#1A3F1C",
        },
        clay: {
          400: "#E07856",
          500: "#D55B36",
          600: "#B7461F",
        },
        sand: {
          50: "#FBF8F3",
          100: "#F4EEE3",
        },
      },
      fontFamily: {
        sans: [
          "'Inter'",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
