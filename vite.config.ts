import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/pexels': {
        target: 'https://images.pexels.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pexels/, '')
      }
    }
  }
});
