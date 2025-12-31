import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/api': 'http://localhost:3000' // Hanya untuk lokal npm run dev
    }
  },
  // UBAH INI: Gunakan '/' karena Anda menggunakan SUBDOMAIN
  base: '/' 
})