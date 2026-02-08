import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth": "http://localhost:5001",
      "/media": "http://localhost:5001",
      "/instructor": "http://localhost:5001",
      "/student": "http://localhost:5001",
      "/admin": "http://localhost:5001",
      "/api": "http://localhost:5001",
    },
  },
});
