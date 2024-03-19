/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,vue}"],
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class',
}

