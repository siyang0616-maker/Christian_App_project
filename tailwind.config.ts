import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2933",
        leaf: "#2F6F5E",
        bluewash: "#DDEBF3",
        clay: "#B76E4B",
        linen: "#F7F1E8",
        mist: "#E8F0ED",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 51, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
