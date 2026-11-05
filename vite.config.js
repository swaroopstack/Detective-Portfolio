import { defineConfig } from 'vite';

// For GitHub Pages project sites set BASE_PATH=/your-repo-name/ (the workflow does this).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
});
