import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages serves project sites from /<repo>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH || '/',
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['node_modules/@uswds/uswds/packages'],
        quietDeps: true,
      },
    },
  },
  plugins: [
    tanstackStart({
      // Prerender a static shell and render everything on the client, so the
      // build output is plain static files that GitHub Pages can serve.
      spa: {
        enabled: true,
        prerender: {
          outputPath: '/index',
        },
      },
    }),
    tailwindcss(),
    viteReact(),
  ],
})
