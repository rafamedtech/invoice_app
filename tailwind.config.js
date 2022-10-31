/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e90f02",
        secondary: "#dfa48c",
        // primary: "#608AF1",
      },
    },
  },

  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  plugins: [require("@tailwindcss/forms"), require("daisyui")],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#e90f02",
          neutral: "#1a1a1a",
        },
      },
      "light",
    ],
  },
};
