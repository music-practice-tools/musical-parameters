import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import { dirname } from 'node:path'
import { fileURLToPath } from 'url'
const _filename = fileURLToPath(import.meta.url)

export default defineConfig({
  appType: 'mpa',
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Add images to precache
        globPatterns: ['**/*.{js,css,html,ico,png,svg,yaml}'],
      },
      includeAssets: [
        'examples/*.yaml',
        'style.css',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'safari-pinned-tab.svg',
      ],
      manifest: {
        name: 'Musical Parameters',
        short_name: 'MusicParams',
        description: 'Generate Musical Parameters',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
