/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages serves from /<repo>/; set BASE in the deploy action.
export default defineConfig({
  base: process.env.BASE ?? "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "YMPULS.",
        short_name: "YMPULS.",
        description: "Wissen in 2 Minuten. Statt Scrollen.",
        lang: "de",
        display: "standalone",
        orientation: "portrait",
        background_color: "#08142A",
        theme_color: "#002144",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,png,svg,ico}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
    }),
  ],
  test: { environment: "jsdom", include: ["tests/**/*.test.ts"] },
});
