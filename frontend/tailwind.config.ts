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
      // Add any theme extensions here, for example:
      // colors: {
      //   primary: "#yourprimarycolor",
      // },
      // fontFamily: {
      //   sans: ["var(--font-geist-sans)", "sans-serif"], // Example if using Geist font
      // },
    },
  },
  plugins: [],
};
export default config;
