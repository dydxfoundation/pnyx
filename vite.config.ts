import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: true,
    }),
    nodePolyfills(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@dydxfoundation-v3/governance', replacement: path.resolve(__dirname, 'node_modules/v3-governance') },
    ],
  },
  build: {
    commonjsOptions: { include: [] }
  },
  optimizeDeps: {
    disabled: false,
  },
})
