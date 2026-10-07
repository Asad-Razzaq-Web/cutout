import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Proxying /api and /uploads keeps everything same-origin in dev,
// which lets the canvas thumbnailer read image pixels without CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
