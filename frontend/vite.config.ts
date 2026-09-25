import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@/api": path.resolve(__dirname, "./src/api"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/entities": path.resolve(__dirname, "./src/entities"),
      "@/widgets": path.resolve(__dirname, "./src/widgets"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/core": path.resolve(__dirname, "./src/core"),
      "@/public": path.resolve(__dirname, "./public"),
      "@/providers": path.resolve(__dirname, "./src/providers"),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api/auth": "http://localhost:5090",
      "/api/users": "http://localhost:5090",
      "/api/movies": "http://localhost:5091",
      "/api/genres": "http://localhost:5091",
      "/api/comments": "http://localhost:5092",
      "/api/search": "http://localhost:5093",
      "/api/collections": "http://localhost:5094",
    },
  },
});
