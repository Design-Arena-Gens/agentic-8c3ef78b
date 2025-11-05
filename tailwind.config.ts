import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8b5cf6",
          dark: "#6d28d9",
          light: "#c4b5fd",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
