import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from the domain root on Vercel. For GitHub Pages, set
  // VITE_BASE_PATH=/Portfolio-Website/ when building.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
