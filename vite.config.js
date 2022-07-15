import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  root: 'src',
  publicDir: "../public",
  build: {
    outDir: '../dist',
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
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            // TODO should be 512 =- check source image used to genernate
            src: 'pwa-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
})
