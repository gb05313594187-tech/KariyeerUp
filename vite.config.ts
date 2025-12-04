import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/", // Vercel'de kökten yayınlanacağı için
  build: {
    outDir: "dist", // Vercel Build Output Directory ile aynı olmalı
  },
});
