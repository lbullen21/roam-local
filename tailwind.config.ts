import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sun: {
          50: "#FFF8E7",
          100: "#FFEDB8",
          200: "#FFE08A",
          300: "#FFCB5C",
          400: "#FFB72E",
          500: "#FFA000",
          600: "#E08600",
          700: "#A85F00",
        },
        coral: {
          50: "#FFF1ED",
          100: "#FFDCD2",
          200: "#FFB8A4",
          300: "#FF9879",
          400: "#FF7E5F",
          500: "#FF6347",
          600: "#E04E32",
        },
        sky: {
          50: "#EAF6FF",
          100: "#C8E6FF",
          200: "#9FD2FF",
          300: "#6EBBFF",
        },
        leaf: {
          400: "#7ED957",
          500: "#5BB033",
          600: "#3F8A1F",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
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
      backgroundImage: {
        "summer-gradient":
          "linear-gradient(135deg, #FFEDB8 0%, #FFCB5C 35%, #FF7E5F 100%)",
        "sky-gradient":
          "linear-gradient(180deg, #EAF6FF 0%, #FFF8E7 70%, #FFE08A 100%)",
      },
      boxShadow: {
        warm: "0 10px 30px -10px rgba(224, 78, 50, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
