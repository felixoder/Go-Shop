import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://go-shop-fbgh.onrender.com',
        secure: false,
      },
    },
    historyApiFallback: true, // Add this line to handle SPA routing
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
