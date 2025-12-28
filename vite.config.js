import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // THÊM ĐOẠN NÀY VÀO:
  server: {
    proxy: {
      "/cinema": {
        target: "https://cinema-web-mme8.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
