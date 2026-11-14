import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Dev server only: fills index.html's route-meta block for the requested path from
 * src/seo/meta.ts, as scripts/prerender.mjs does for the build.
 */
function routeMeta(): Plugin {
  return {
    name: 'route-meta',
    apply: 'serve',
    async transformIndexHtml(html, ctx) {
      if (!ctx.server) return html;
      // The URL asked for; ctx.path is always /index.html.
      const pathname = new URL(ctx.originalUrl ?? '/', 'http://localhost').pathname;
      const { metaFor, fillHead } = await ctx.server.ssrLoadModule('/src/seo/meta.ts');
      return fillHead(html, metaFor(pathname));
    },
  };
}

export default defineConfig({
  plugins: [react(), routeMeta()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { port: 5420 },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
