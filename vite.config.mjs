// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // ...other config
  base: '/', // Default for root deployment
  // If deployed to a subpath, e.g., 'yourdomain.com/my-app/'
  // base: '/my-app/',
});