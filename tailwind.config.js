/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // สแกนไฟล์ HTML หลัก
    "./src/**/*.{vue,js,ts,jsx,tsx}", // สแกนไฟล์ .vue และ .js/.ts ทั้งหมดในโฟลเดอร์ src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
