import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // ensures SPA fallback in dev
  },
  preview: {
    historyApiFallback: true, // ensures SPA fallback in preview
  }
});
