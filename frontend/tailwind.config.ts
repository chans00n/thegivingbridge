import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: {
            50: "#EE9099",
            100: "#EB7E88",
            200: "#E65B68",
            300: "#E03847",
            400: "#CF2030", // Base
            500: "#9E1825", // Darker for hover
            600: "#6E1119",
            700: "#3D090E",
            800: "#0D0203",
            900: "#000000", // Note: 900 is black, 950 from image is also black
            950: "#000000",
          },
        },
      },
      // fontFamily: {
      //   sans: ["var(--font-geist-sans)", "sans-serif"], // Example if using Geist font
      // },
    },
  },
  plugins: [],
};
export default config;
