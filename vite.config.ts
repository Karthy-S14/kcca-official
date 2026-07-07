// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        strategies: "generateSW",
        filename: "sw.js",
        includeAssets: [
          "favicon.ico",
          "kcca-logo.png",
          "kcca-logo-192.png",
          "kcca-maskable-512.png",
          "apple-touch-icon.png",
          "offline.html",
        ],
        manifest: {
          name: "KCCA — Kilinochchi Central Chess Association",
          short_name: "KCCA Chess",
          description:
            "Kilinochchi Central Chess Association — tournaments, rated players, training and news.",
          theme_color: "#0a0a0a",
          background_color: "#0a0a0a",
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          lang: "en",
          categories: ["sports", "education", "games"],
          icons: [
            { src: "/kcca-logo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/kcca-logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/kcca-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: {
          navigateFallback: "/offline.html",
          navigateFallbackDenylist: [/^\/api\//, /^\/__/, /^\/_server/],
          globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2,ttf}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "kcca-pages",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === "style" ||
                request.destination === "script" ||
                request.destination === "worker",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "kcca-assets",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "kcca-images",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === "font",
              handler: "CacheFirst",
              options: {
                cacheName: "kcca-fonts",
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /\/__l5e\/assets-v1\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "kcca-cdn",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
  },
});
