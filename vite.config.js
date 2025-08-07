// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Этот блок - самый важный
    proxy: {
      // Все запросы, начинающиеся с /api
      '/api': {
        // будут перенаправлены сюда
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
      },
    },
  },
})