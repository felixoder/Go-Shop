import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://go-shop-fbgh.onrender.com',
        secure: true,      
      },
    },
  },
  plugins: [react()],
});
