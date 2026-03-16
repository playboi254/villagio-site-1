import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: { enabled: true },
      workbox: {
        // ✅ FIX 1: Raise limit to 6MB to cover large images
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,

        // ✅ FIX 2: Exclude huge static assets from precache — serve them on demand instead
        globPatterns: ['**/*.{js,css,html,ico,png,webp,svg,woff,woff2}'],
        globIgnores: [
          // Exclude images over ~2MB from precache — they load fine from network
          '**/Spinach-*.jpg',
          '**/Spices-*.jpg',
          '**/category-potatoes-*.jpg',
          '**/Dairy-*.jpg',
          '**/Fruits-*.jpg',
          '**/*.mp4',           // Never precache video
        ],
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/localhost:8000\/api\/v1\/products/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'products-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /^http:\/\/localhost:8000\/uploads\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: /^http:\/\/localhost:8000\/api\/v1\/orders/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'orders-cache',
              backgroundSync: {
                name: 'orders-sync-queue',
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
          {
            urlPattern: /^http:\/\/localhost:8000\/api\/v1\/dashboard/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dashboard-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 5 },
            },
          },
          // ✅ Cache large local images at runtime instead of precache
          {
            urlPattern: /\/assets\/.*\.(jpg|jpeg|png|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      manifest: {
        name: 'Villagio Farm',
        short_name: 'Villagio',
        description: 'Fresh farm produce delivered to your door',
        theme_color: '#2d6a4f',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/icon-72x72.png',   sizes: '72x72',   type: 'image/png' },
          { src: '/icons/icon-96x96.png',   sizes: '96x96',   type: 'image/png' },
          { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        shortcuts: [
          { name: 'Browse Products', url: '/products', icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }] },
          { name: 'My Orders',       url: '/profile',  icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }] },
          { name: 'Cart',            url: '/cart',     icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }] },
        ],
        categories: ['food', 'shopping', 'lifestyle'],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    // ✅ FIX 3: Split chunks to fix the 500kB warning
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries in their own chunk
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':     ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'vendor-query':  ['@tanstack/react-query'],
          'vendor-chart':  ['recharts'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
    // Raise warning threshold slightly
    chunkSizeWarningLimit: 600,
  },
})