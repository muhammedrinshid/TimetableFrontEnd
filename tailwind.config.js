/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class", '[data-theme="dark"]'], // Enable dark mode using a class or a custom attribute
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
        "blink-shadow": {
          "0%, 100%": { boxShadow: "0 0 0px rgba(0, 0, 0, 0.5)" },
          "50%": { boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" },
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
        "blink-shadow": "blink-shadow 1s infinite",
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
        bottom1: "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px",
        "custom-11":
          "rgba(255, 165, 0, 0.25) 0px 54px 55px,rgba(255, 165, 0, 0.12) 0px -12px 30px, rgba(255, 165, 0, 0.12) 0px 4px 6px, rgba(255, 165, 0, 0.17) 0px 12px 13px, rgba(255, 165, 0, 0.09) 0px -3px 5px",
      },
      maxWidth: {
        "8xl": "120rem", // Example custom width
      },
      maxHeight: {
        128: "60rem", // Example custom height
      },
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
      },
      colors: {
        light: {
          primary: "#312ECB", // Original color (unchanged)
          primaryShades: {
            100: "#e7e7f8",
            200: "#cfcff1",
            300: "#b7b7eb",
            400: "#9f9fe4",
            500: "#8787de", // Close to the original primary color
            600: "#5e5eb3",
            700: "#464691",
            800: "#312ECB", // Matches your original light.primary
            900: "#1b1b8b",
          },
          secondary: "#7874E0", // Original color (unchanged)
          secondaryShades: {
            100: "#e6e5f7",
            200: "#cdccec",
            300: "#b3b2e0",
            400: "#9a99d5",
            500: "#7874E0", // Close to the original secondary color
            600: "#6666d2",
            700: "#5353b4",
            800: "#414196",
            900: "#2e2e78",
          },
          // Similarly, define accent and highlight shades
          accent: "#715DF1",
          highlight: "#ff8c42",
          background: "#DFDFDF",
          background1: "#ecf3fa",
        },
        dark: {
          primary: "#1f1f1f", // Use gray-900 for primary
          primaryShades: {
            100: "#e5e7eb", // gray-100 (Light gray)
            200: "#d1d5db", // gray-200 (Light gray)
            300: "#9ca3af", // gray-300 (Gray)
            400: "#6b7280", // gray-400 (Medium gray)
            500: "#4b5563", // gray-500 (Dark gray)
            600: "#374151", // gray-600 (Darker gray)
            700: "#1f2937", // gray-700 (Very dark gray)
            800: "#111827", // gray-800 (Almost black)
            900: "#0f172a", // gray-900 (Black)
          },
          secondary: "#2a2a2a", // A slightly lighter gray for secondary elements
          secondaryShades: {
            100: "#e5e7eb", // gray-100 (Light gray)
            200: "#d1d5db", // gray-200 (Light gray)
            300: "#9ca3af", // gray-300 (Gray)
            400: "#6b7280", // gray-400 (Medium gray)
            500: "#4b5563", // gray-500 (Dark gray)
            600: "#374151", // gray-600 (Darker gray)
            700: "#1f2937", // gray-700 (Very dark gray)
            800: "#111827", // gray-800 (Almost black)
            900: "#0f172a", // gray-900 (Black)
          },
          accent: "#4b86f5", // Bright blue for accent elements
          highlight: "#ffcc00", // Golden yellow for highlights
          background: "#121212", // Very dark gray for background
          background1: "#1e1e1e", // Slightly lighter dark gray for sections
          text: "#e0e0e0", // Light gray for text
          muted: "#b0b0b0", // Muted gray for less prominent text
          border: "#333333", // Dark border for separation
          shadow: "#000000", // Black for shadows
          success: "#4caf50", // Green for success messages
          error: "#f44336", // Red for error messages
          warning: "#ff9800", // Orange for warning messages
        },

        // Extra colors (unchanged)
        text_1: "#818181",
        text_2: "#a6a6a6",
        lightGreen: "#90EE90",
        lightRed: "#FFB6C1",
        pale_orange: "#f0853c",
        dark_rose: "#ca2c88",
        skyblue: "#009ee3",
      },

    
    },
    screens: {
      sm: "640px", // Small screens and up
      md: "768px", // Medium screens and up
      lg: "1024px", // Large screens and up
      xl: "1280px", // Extra-large screens and up
      "2xl": "1536px", // 2XL screens and up (common size)
      "3xl": "1980px", // 3XL screens and up (common size)
      "4xl": "2560px", // 4XL screens and up (common for large displays)
    },
  },
  plugins: [  require('@tailwindcss/forms'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
