// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

var path = require("path");

export default defineConfig({
  build: {
    outDir: "dev-dist",
  },
  plugins: [vue()],
  resolve: { alias: { "@": "/src" } },
});
