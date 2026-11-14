import { SITE_COPY } from '@/data/site';

/** The home page's sections, in page order. */
export const SECTIONS = SITE_COPY.nav;

/** Sections that also have a /<id> route scrolling the home page to them (Projects is a page of its own). */
export const SECTION_ROUTES = SECTIONS.filter((s) => s.id !== 'projects');
