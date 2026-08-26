import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        foreground: "var(--foreground)",
        "muted-foreground": "var(--muted-foreground)",
        "subtle-foreground": "var(--subtle-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        "accent-soft": "var(--accent-soft)",
        ring: "var(--ring)",
        good: "var(--good)",
        "good-soft": "var(--good-soft)",
        warning: "var(--warning)",
        "warning-soft": "var(--warning-soft)",
        critical: "var(--critical)",
        "critical-soft": "var(--critical-soft)",
        violet: "var(--violet)",
        "violet-soft": "var(--violet-soft)",
        hot: "var(--hot)",
        "hot-soft": "var(--hot-soft)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
        popover: "0 4px 16px -2px rgb(0 0 0 / 0.12), 0 2px 6px -2px rgb(0 0 0 / 0.08)",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Inter",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
