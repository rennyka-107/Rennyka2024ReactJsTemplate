/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'desktop': '1280px',
      'laptop': '1024px',
      'tablet': '720px',
    },
    extend: {
      colors: {
        "purple-50": "#fbf7fd",
        "purple-100": "#f5ecfb",
        "purple-200": "#eddcf8",
        "purple-300": "#e0c0f2",
        "purple-400": "#d2a2eb",
        "purple-500": "#b86fdd",
        "purple-600": "#a650cd",
        "purple-700": "#8e3eb2",
        "purple-800": "#773792",
        "purple-900": "#622d76",
        "purple-950": "#431655",
        "denim-50": "#f1f7fe",
        "denim-100": "#e2edfc",
        "denim-200": "#c0daf7",
        "denim-300": "#87bcf2",
        "denim-400": "#489be8",
        "denim-500": "#207ed7",
        "denim-600": "#1261b5",
        "denim-700": "#104e94",
        "denim-800": "#11437b",
        "denim-900": "#143a66",
        "denim-950": "#0d2444",
        "iron-50": "#f7f7f7",
        "iron-100": "#ededed",
        "iron-200": "#dfdfdf",
        "iron-300": "#d1d1d1",
        "iron-400": "#adadad",
        "iron-500": "#999999",
        "iron-600": "#888888",
        "iron-700": "#7b7b7b",
        "iron-800": "#676767",
        "iron-900": "#545454",
        "iron-950": "#363636",
        "masala-50": "#f6f6f6",
        "masala-100": "#e7e7e7",
        "masala-200": "#d1d1d1",
        "masala-300": "#b0b0b0",
        "masala-400": "#888888",
        "masala-500": "#6d6d6d",
        "masala-600": "#5d5d5d",
        "masala-700": "#4f4f4f",
        "masala-800": "#454545",
        "masala-900": "#3d3d3d",
        "masala-950": "#262626",
      },
      borderRadius: {
        "radius-6": "6px",
        "radius-8": "8px",
        "radius-12": "12px",
      },
      fontWeight: {
        medium: "500",
        normal: "400",
        semibold: "600",
        bold: "700",
      },
      boxShadow: {
        'white-sm': '0px 4px 4px 0px rgba(0, 0, 0, 0.05)'
      },
      fontSize: {
        'size-base': '14px',
        'size-medium': '15px',
        'size-large': '16px'
      },
      backgroundSize: {
        "full": "100% 100%;"
      },
      
    },
  },
  plugins: [],
};
