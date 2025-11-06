import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import devtools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), devtools()],
  base: "/position-size-calculator/",
});
