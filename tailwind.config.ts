import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ceipa: {
          50: "#eef9f6",
          100: "#d5f0e9",
          500: "#1a9b84",
          600: "#0f6b5c",
          700: "#0a5247",
          800: "#084038",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
