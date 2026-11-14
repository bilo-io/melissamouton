// Loads modules from src/ in Node through Vite, so their `@/` alias and asset imports resolve.
// For the build and image scripts; the server is closed again before this returns.
import { createServer } from 'vite';

export async function loadSrc(root, ...paths) {
  const vite = await createServer({
    root,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    // The old src/html/ pages trip Vite's dependency scan, and nothing here needs it.
    optimizeDeps: { noDiscovery: true },
  });
  try {
    return await Promise.all(paths.map((p) => vite.ssrLoadModule(p)));
  } finally {
    await vite.close();
  }
}
