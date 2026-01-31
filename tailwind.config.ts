// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Cari di semua file dalam src
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Cari di semua file dalam app (jika di luar src)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#F97316",
          blue: "#1E3A8A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
