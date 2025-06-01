import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Explicitly tell Vite where your PostCSS config is
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
