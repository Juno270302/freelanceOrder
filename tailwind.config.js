/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "mont-regular": "Mont-Regular",
        "mont-bold": "Mont-Bold",
      },

      screens: {
        sm: "440px",
        md: "733px",
        lg: "1024px",
        xl: "1281px",
        "2xl": "1550px",
      },
    },
  },
  plugins: [],
};
