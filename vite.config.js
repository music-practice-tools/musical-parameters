import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [
  ],
})
