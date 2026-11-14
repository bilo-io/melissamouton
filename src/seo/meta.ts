/**
 * Per-page metadata: title, description, canonical URL, share card and JSON-LD for every route.
 *
 * One source for two consumers: `scripts/prerender.mjs` writes a static HTML file per route with
 * these tags (link previews never run JavaScript), and `RouteMeta` in App.tsx keeps the live
 * document in step as the visitor navigates. Copy comes from `src/data`, never from here.
 */
import { HERO, profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { SITE_COPY } from '@/data/site';
import { SECTION_ROUTES } from '@/components/layout/sections';

export const SITE = 'https://melissamouton.vercel.app';

export interface ShareImage {
  url: string;
  alt: string;
  /** Only set when known: a guessed size is worse than none. */
  width?: number;
  height?: number;
  type?: string;
}

export interface PageMeta {
  /** The route as visited, lower case, no trailing slash ("/" for home). */
  route: string;
  /** The URL search engines should index for this page. */
  canonical: string;
  title: string;
  description: string;
  image: ShareImage;
  type: 'website' | 'article';
  /** Kept out of search results (and the sitemap). */
  noindex?: boolean;
  /** Listed in sitemap.xml: indexable pages that are not aliases of another. */
  sitemap: boolean;
  jsonLd: Record<string, unknown>[];
}

const HOME_TITLE = `${profile.name} · ${profile.headline}`;
/** Her own summary (the about copy, without the emoji), then the two halves of the hero. */
const HOME_DESCRIPTION = `${profile.name} is a digital designer working across web, social, campaigns, and video with international teams. ${HERO.trade} ${HERO.heart}`;

/** The 1200×630 card scripts/og-image.mjs renders. */
const SITE_IMAGE: ShareImage = {
  url: `${SITE}/og.jpg`,
  alt: `${profile.name}, ${profile.headline.toLowerCase()}. ${HERO.trade} ${HERO.heart}`,
  width: 1200,
  height: 630,
  type: 'image/jpeg',
};

const url = (path: string) => `${SITE}${path === '/' ? '/' : path}`;
const titled = (name: string) => `${name} · ${profile.name}`;

/** First sentence-ish of a paragraph, cut at a word under ~160 characters for search snippets. */
export function snippet(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = clean[max - 1] === ' ' ? cut.length : cut.lastIndexOf(' ');
  return `${(space > 0 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

const PERSON_ID = `${SITE}/#person`;

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: profile.name,
  url: SITE,
  image: SITE_IMAGE.url,
  jobTitle: profile.headline,
  email: profile.email,
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: profile.siteName,
  inLanguage: 'en',
  author: { '@id': PERSON_ID },
};

function breadcrumbs(...trail: [name: string, path: string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'] as const, ...trail].map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: url(path),
    })),
  };
}

function page(
  p: Omit<PageMeta, 'canonical' | 'image' | 'type' | 'sitemap'> & Partial<Pick<PageMeta, 'canonical' | 'image' | 'type' | 'sitemap'>>,
): PageMeta {
  return { canonical: url(p.route), image: SITE_IMAGE, type: 'website', sitemap: !p.noindex, ...p };
}

/** Every route with a page of its own. Dynamic routes are expanded from their data. */
export const PAGES: PageMeta[] = [
  page({ route: '/', title: HOME_TITLE, description: HOME_DESCRIPTION, jsonLd: [person, website] }),

  // /about, /contact: the home page scrolled to a section, so home is the page to index.
  ...SECTION_ROUTES.map((s) =>
    page({ route: `/${s.id}`, canonical: url('/'), title: HOME_TITLE, description: HOME_DESCRIPTION, sitemap: false, jsonLd: [] }),
  ),

  page({
    route: '/projects',
    title: titled(SITE_COPY.projectsPage.title),
    description: `${projects.length} design projects by ${profile.name}: ${projects.map((p) => p.name).join(', ')}.`,
    jsonLd: [breadcrumbs([SITE_COPY.projectsPage.title, '/projects'])],
  }),

  ...projects.map((p) =>
    page({
      route: `/projects/${p.id}`,
      title: titled(`${p.name}, ${p.kind}`),
      description: snippet(p.description),
      type: 'article',
      jsonLd: [breadcrumbs([SITE_COPY.projectsPage.title, '/projects'], [p.name, `/projects/${p.id}`])],
    }),
  ),
];

export const NOT_FOUND: PageMeta = page({
  route: '/404',
  canonical: url('/'),
  title: `${SITE_COPY.notFound.heading} · ${profile.siteName}`,
  description: SITE_COPY.notFound.line,
  noindex: true,
  jsonLd: [],
});

const byRoute = new Map(PAGES.map((p) => [p.route, p]));

/** Routes are case-insensitive, and a trailing slash is the same page. */
export const normalise = (pathname: string) => pathname.toLowerCase().replace(/\/+$/, '') || '/';

export const metaFor = (pathname: string): PageMeta => byRoute.get(normalise(pathname)) ?? NOT_FOUND;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ROUTE_META = /<!-- route-meta -->[\s\S]*?<!-- \/route-meta -->/;

/** index.html with its route-meta block filled for one page (the prerender and the dev server). */
export function fillHead(html: string, m: PageMeta): string {
  if (!ROUTE_META.test(html)) throw new Error('index.html has no <!-- route-meta --> block');
  return html.replace(ROUTE_META, () => `<!-- route-meta -->\n    ${headTags(m)}\n    <!-- /route-meta -->`);
}

/** The head tags that differ per page, as HTML (for the prerendered files). */
function headTags(m: PageMeta): string {
  const tags: string[] = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="author" content="${esc(profile.name)}" />`,
    `<link rel="canonical" href="${esc(m.canonical)}" />`,
  ];
  if (m.noindex) tags.push('<meta name="robots" content="noindex" />');
  const og: [string, string | number | undefined][] = [
    ['og:type', m.type],
    ['og:title', m.title],
    ['og:description', m.description],
    ['og:url', m.canonical],
    ['og:image', m.image.url],
    ['og:image:secure_url', m.image.url],
    ['og:image:type', m.image.type],
    ['og:image:width', m.image.width],
    ['og:image:height', m.image.height],
    ['og:image:alt', m.image.alt],
  ];
  for (const [k, v] of og) if (v !== undefined) tags.push(`<meta property="${k}" content="${esc(String(v))}" />`);
  for (const [k, v] of [
    ['twitter:title', m.title],
    ['twitter:description', m.description],
    ['twitter:image', m.image.url],
    ['twitter:image:alt', m.image.alt],
  ])
    tags.push(`<meta name="${k}" content="${esc(v)}" />`);
  for (const ld of m.jsonLd) tags.push(`<script type="application/ld+json" data-route-ld>${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n    ');
}

/** sitemap.xml: indexable pages only, aliases and noindex pages left out. */
export function sitemapXml(): string {
  const urls = PAGES.filter((p) => p.sitemap).map((p) => `  <url><loc>${esc(p.canonical)}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/** llms.txt (llmstxt.org): a plain summary of the site and its pages for AI crawlers and agents. */
export function llmsTxt(): string {
  const link = (name: string, path: string, note?: string) => `- [${name}](${url(path)})${note ? `: ${note}` : ''}`;
  return [
    `# ${profile.name}`,
    '',
    `> ${HOME_DESCRIPTION}`,
    '',
    '## Pages',
    '',
    link('Home', '/', 'about and featured projects'),
    link('Projects', '/projects', 'all projects, searchable'),
    '',
    '## Projects',
    '',
    ...projects.map((p) => link(p.name, `/projects/${p.id}`, p.kind)),
    '',
    '## Contact',
    '',
    `- ${profile.email}`,
    '',
  ].join('\n');
}
