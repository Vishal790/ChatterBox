import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: /^mongoose($|\/)/, // Externalize mongoose
    },
  },
  server: {
    port: 4000,
  },
});
