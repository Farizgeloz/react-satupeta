import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* export default defineConfig({
  plugins: [react()],
  //base: '/frontend-satupeta/', // <- penting untuk GitHub Pages
  server: {
    port: 3002,      // bisa ganti port permanen
    strictPort: true // error kalau port dipakai, bukan pindah otomatis
  }
}) */

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000' // dev proxy ke Hapi
    }
  },
  base: '/satupeta/' // path base React build
})
