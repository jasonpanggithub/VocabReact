import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/vocab2026/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/vocab2026API/api'),
      },
    },
  },
}))
