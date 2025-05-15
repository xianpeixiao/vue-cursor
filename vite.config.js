import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/vue-cursor/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 配置跨域
      "/api": {
        target: "http://your-api-server.com", // 替换为您的后端API地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // 如果需要多个跨域配置
      "/other-api": {
        target: "http://other-api-server.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/other-api/, ""),
      },
    },
    cors: true, // 允许跨域
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
