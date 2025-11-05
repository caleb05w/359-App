/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    // add other folders where components live
  ],
  presets: [require("nativewind/preset")], // ✅ important for NativeWind v4
  theme: { extend: {} },
};
