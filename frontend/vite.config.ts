import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
        // AI question generation can legitimately take a while — don't
        // let the dev proxy give up on it early.
        timeout: 180000,
        proxyTimeout: 180000,
      },
    },
  },
})
