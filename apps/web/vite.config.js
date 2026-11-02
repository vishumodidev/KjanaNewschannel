import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    // Proxy API requests to the backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 4173,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split large vendor chunks
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router'],
          'query': ['@tanstack/react-query'],
        },
      },
    },
  },

  // Vitest configuration
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/main.jsx', 'src/test/**'],
    },
  },
})
