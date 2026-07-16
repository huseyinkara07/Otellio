import type { Config } from "tailwindcss";

// Renk paleti PRD Bölüm 5 ile birebir (hex değerleri değiştirilmemiştir).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0F2A43",
        "navy-alt": "#0B3B4A",
        accent: "#E86A33",
        "accent-hover": "#CF5622",
        teal: "#4FA69A",
        sand: "#F7F4EF",
        surface: "#FFFFFF",
        ink: "#1A1A1A",
        muted: "#5B6672",
        // Form hata metni: accent-hover (#CF5622), beyaz zeminde WCAG AA (4.5:1) için
        // yeterince koyulaştırılmış bir türevi. Section 5 paletinin dışında, yalnızca
        // erişilebilir hata metni için tanımlanmıştır.
        error: "#A8431A",
      },
      borderRadius: {
        card: "16px",
        button: "10px",
      },
      maxWidth: {
        content: "1152px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
