import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setup-test.js",
    coverage: {
      provider: "v8",
      exclude: [
        "**/*.scss",
        "**/Navigation.jsx",
        "**/assets/navicon.svg",
        "**/assets/strajk-logo.svg",
      ],
      reporter: ["text", "html"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
