import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
        hammersmith: ["var(--font-hammersmith)"],
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config;
