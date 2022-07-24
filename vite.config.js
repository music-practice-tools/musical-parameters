import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import { dirname } from 'node:path'
import { fileURLToPath } from 'url';
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

import { resolve } from 'path'

export default defineConfig({
  build: {
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Add images to precache
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['style.css', 'pwa-512x512.png', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'Musical Parameters',
        short_name: 'MusicParams',
        description: 'Generate Musical Parameters',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
})
  