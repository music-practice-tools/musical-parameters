import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  root: 'src',
  publicDir: "../public",
  build: {
    outDir: '../dist',  // note that dev-dist always appears under src/ :()
    emptyOutDir: true
  },
  plugins: [
    VitePWA({
      // see https://github.com/antfu/vite-plugin-pwa/blob/main/src/types.ts#L14-L140 
      registerType: 'autoUpdate',
//      workbox: {
//        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
//      },
      includeAssets: ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'masked-icon.svg'],
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
  