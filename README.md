# melissamouton

Melissa Mouton's design portfolio: a home page (split hero, about, featured projects, contact), a
searchable `/projects` page and a page per project. Client-side only. Built like
[bilo.dev](https://bilo.dev): Vite 6, React 19, TypeScript (strict), Tailwind 3, React Router 7,
lucide-react, and a vendored copy of [Midnite UI](https://github.com/bilo-io/midnite-ui)
(`src/vendor/midnite-ui`, pinned in its README).

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on http://localhost:5420 |
| `npm run build` | `tsc --noEmit`, `vite build` into `dist/`, then `scripts/prerender.mjs` (an HTML file per route, `404.html`, `sitemap.xml`, `llms.txt`) |
| `npm run preview` | Serves `dist/` (Vite preview, port 4173) |
| `npm run typecheck` | Typechecks `src` and `e2e` |
| `npm run test:e2e` | Playwright smoke suite; builds and serves on port 4173 itself |
| `npm run og-image` | Re-renders `public/og.jpg` (1200x630) from `src/data/profile.ts` |
| `npm run brand-icons` | Re-renders the favicon and app icons from `public/logos/app-logo-dark.svg` |

Playwright browsers are a one-off: `npx playwright install chromium`.

## Where things are

- **Copy** lives in `src/data/` (`profile.ts`, `projects.ts`, `site.ts`); components hold none.
  Content comes from melissamouton.co.za only: add more projects, images or copy there.
- **Pointer effect**: `src/hooks/use-pointer-trail.ts` and `src/components/ui/PointerTrail.tsx`.
- **SEO**: `src/seo/meta.ts` is the one source for each route's title, description, canonical
  (`https://melissamouton.vercel.app`) and share card. The build prerenders a flat HTML file per
  route, and `vercel.json` has `cleanUrls`, so deep links work without a rewrite.
- **Images**: `src/assets/projects/<id>/`; the Payfluent clip and poster are in `public/videos/`.

## Deploy

Vercel (Vite preset); `master` deploys production. Not linked yet.
