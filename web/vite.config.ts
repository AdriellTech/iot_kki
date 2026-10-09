import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'HydroSky Defender',
        short_name: 'HydroSky',
        description: 'Monitoring pengusir hama burung berbasis semprotan air',
        theme_color: '#e4efe8',
        background_color: '#e4efe8',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^\/stream.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^\/mjpeg.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/three') ||
            id.includes('@react-three/fiber') ||
            id.includes('@react-three/drei')
          ) {
            return 'three'
          }
        },
      },
    },
  },
})
