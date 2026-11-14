import type { PageMeta } from './meta';

function upsert(selector: string, create: () => HTMLElement, attr: string, value: string | number | undefined) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (value === undefined) {
    el?.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, String(value));
}

const meta = (key: 'name' | 'property', name: string, value: string | number | undefined) =>
  upsert(
    `meta[${key}="${name}"]`,
    () => {
      const m = document.createElement('meta');
      m.setAttribute(key, name);
      return m;
    },
    'content',
    value,
  );

/**
 * Brings the live document's head in line with a page's metadata after a client-side
 * navigation. The prerendered HTML already carries the same tags for a direct load.
 */
export function applyMeta(m: PageMeta) {
  document.title = m.title;
  meta('name', 'description', m.description);
  meta('name', 'robots', m.noindex ? 'noindex' : undefined);
  upsert(
    'link[rel="canonical"]',
    () => {
      const l = document.createElement('link');
      l.rel = 'canonical';
      return l;
    },
    'href',
    m.canonical,
  );
  meta('property', 'og:type', m.type);
  meta('property', 'og:title', m.title);
  meta('property', 'og:description', m.description);
  meta('property', 'og:url', m.canonical);
  meta('property', 'og:image', m.image.url);
  meta('property', 'og:image:secure_url', m.image.url);
  meta('property', 'og:image:type', m.image.type);
  meta('property', 'og:image:width', m.image.width);
  meta('property', 'og:image:height', m.image.height);
  meta('property', 'og:image:alt', m.image.alt);
  meta('name', 'twitter:title', m.title);
  meta('name', 'twitter:description', m.description);
  meta('name', 'twitter:image', m.image.url);
  meta('name', 'twitter:image:alt', m.image.alt);

  document.head.querySelectorAll('script[data-route-ld]').forEach((s) => s.remove());
  for (const ld of m.jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-route-ld', '');
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }
}
