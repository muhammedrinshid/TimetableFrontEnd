
/** @type {import('tailwindcss').Config} */



module.exports = 
  {
    darkMode: "selector",
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      fontSize: {
        vs: ["10px", "12px"],
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "19.5px"],
        lg: ["18px", "21.94px"],
        xl: ["20px", "24.38px"],
        "2xl": ["24px", "29.26px"],
        "3xl": ["28px", "50px"],
        "4xl": ["48px", "58px"],
        "8xl": ["96px", "106px"],
      },
      extend: {
        keyframes: {
          'blink-shadow': {
            '0%, 100%': { boxShadow: '0 0 0px rgba(0, 0, 0, 0.5)' },
            '50%': { boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' },
          },
          "fade-in-blur": {
            "0%": { opacity: "0", filter: "blur(10px)" },
            "100%": { opacity: "1", filter: "blur(0)" },
          },
          "slide-in-left": {
            "0%": { transform: "translateX(-100%)", opacity: "0" },
            "100%": { transform: "translateX(0)", opacity: "1" },
          },
          "slide-in-right": {
            "0%": { transform: "translateX(100%)", opacity: "0" },
            "100%": { transform: "translateX(0)", opacity: "1" },
          },
          "zoom-in": {
            "0%": { transform: "scale(0.5)", opacity: "0" },
            "100%": { transform: "scale(1)", opacity: "1" },
          },
        },
        animation: {
          "fade-in-blur": "fade-in-blur 1s ease-out",
          "slide-in-left": "slide-in-left 1s ease-out",
          "slide-in-right": "slide-in-right 1s ease-out",
          "zoom-in": "zoom-in 1s ease-out",
          'blink-shadow': 'blink-shadow 1s infinite'
        },
        backgroundImage: {
          'my-gradient': 'linear-gradient(102deg, rgba(3, 5, 29, 0.85) 2.11%, rgba(255, 0, 0, 0.85) 100%)',
      },
        boxShadow: {
          "custom-1": "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          "custom-2": "rgba(0, 0, 0, 0.16) 0px 1px 4px",
          "custom-3": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          "custom-4":
            "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
          "custom-5":
            "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          "custom-6":
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          "custom-7":
            "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          "custom-8": "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          "custom-9":
            "rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
          "custom-10": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          "bottom1":"rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;",
          "custom-11":"rgba(255, 165, 0, 0.25) 0px 54px 55px,rgba(255, 165, 0, 0.12) 0px -12px 30px,   rgba(255, 165, 0, 0.12) 0px 4px 6px,  rgba(255, 165, 0, 0.17) 0px 12px 13px,  rgba(255, 165, 0, 0.09) 0px -3px 5px"
        },
        maxWidth: {
          "8xl": "90rem", // Example custom width
        },
        maxHeight: {
          128: "50rem", // Example custom height
        },
        fontFamily: {
          Roboto: ["Roboto", "sans-serif"],
          Inter: ["Inter", "sans-serif"],
          
        },
        colors: {
          light: {
            primary: "#312ECB",
            secondary: "#007AFF",
            accent: "#715DF1",
            highlight: "#ff8c42",
            background: "#DFDFDF",
          },
          dark: {
            primary: "#141414",
            secondary: "#242424",
            accent: "#36454F",
            highlight: "#ff5733",
            background: "#0c0c0c",
            background1:"#ecf3fa",
          },
          
          text_1: "#818181",
          text_2: "#a6a6a6",
          lightGreen: "#90EE90",
          lightRed: "#FFB6C1",
          pale_orange: "#f0853c",
          dark_rose: "#ca2c88",
          skyblue: "#009ee3",
          
        },
        backgroundImage: {
          hero: "url('assets/images/grid1.png')",
        },
      },
      screens: {
        sm: "640px", // Small screens and up
        md: "768px", // Medium screens and up
        lg: "1024px", // Large screens and up
        xl: "1280px", // Extra-large screens and up
        wide: "1440px", // Wide screens and up
      },
    },
    plugins: [],
  };
