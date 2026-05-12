/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EEF1FB",
          100: "#D6DDF1",
          300: "#6E7DBF",
          500: "#2E4191",
          700: "#1E2D6B",
          900: "#0F1B4C",
        },
        gold: {
          300: "#F1CE8F",
          400: "#E6B968",
          500: "#D8A24A",
          600: "#B5862E",
        },
        cream: {
          50: "#FAF6EE",
          100: "#F2EADB",
        },
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(15, 27, 76, 0.18)",
        cta: "0 12px 30px -10px rgba(216, 162, 74, 0.55)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, rgba(15,27,76,0.92) 0%, rgba(30,45,107,0.85) 50%, rgba(15,27,76,0.95) 100%)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "2rem",
          lg: "3rem",
        },
      },
    },
  },
  plugins: [],
};
