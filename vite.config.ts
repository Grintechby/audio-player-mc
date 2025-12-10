import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: "/src/components",
      shared: "/src/shared",
      api: "/src/api",
      types: "/src/types",
      lib: "/src/lib",
      styles: "/src/styles",
    },
  },
});
