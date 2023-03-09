/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#1C1C1C",
          secondary: "#2f2f2f",
          tertiary: "#3c3c3c",
        },
        foreground: {},
      },
      fontFamily: {
        gym: "Bebas Neue, sans-serif",
        roboto: "Roboto, sans-serif",
      },
    },
  },
  plugins: [],
};
