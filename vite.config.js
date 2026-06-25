/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babelPlugin from "@rolldown/plugin-babel";
import path from "path";

export default defineConfig({
  base: "/MCC-Finance-Planner/",
  plugins: [
    babelPlugin({
      babelOptions: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    react({
      include: "**/*.{jsx,js}",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
