import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7122',
        changeOrigin: true,
        secure: false,
        agent: new https.Agent({ rejectUnauthorized: false }),
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      },
    },
  },
})
